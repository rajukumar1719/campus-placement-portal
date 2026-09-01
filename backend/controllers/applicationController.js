const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { 
    sendApplicationStatusEmail, 
    sendApplicationSubmittedEmail 
} = require('../services/emailService');

// ✅ Student: Apply for Job
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const studentId = req.user._id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (job.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer active'
            });
        }

        if (new Date(job.deadline) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Deadline has passed for this job'
            });
        }

        const student = await User.findById(studentId);
        if (!student.profileComplete) {
            return res.status(400).json({
                success: false,
                message: 'Please complete your profile first'
            });
        }

        if (job.minCGPA > 0 && student.cgpa < job.minCGPA) {
            return res.status(400).json({
                success: false,
                message: `Minimum CGPA required is ${job.minCGPA}. Your CGPA is ${student.cgpa}`
            });
        }

        const existingApplication = await Application.findOne({
            student: studentId,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        const application = await Application.create({
            student: studentId,
            job: jobId,
            status: 'applied'
        });

        // ✅ Safe email - won't crash if fails
        try {
            await sendApplicationSubmittedEmail(
                student.email,
                student.name,
                job.jobTitle,
                job.companyName
            );
        } catch (emailError) {
            console.log('Email failed:', emailError.message);
        }

        const populatedApplication = await Application.findById(application._id)
            .populate('job', 'companyName jobTitle location salary deadline')
            .populate('student', 'name email');

        res.status(201).json({
            success: true,
            message: 'Applied successfully!',
            application: populatedApplication
        });

    } catch (error) {
        console.error('Apply error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Student: Get My Applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate('job', 'companyName jobTitle location salary status deadline')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Admin: Get All Applications
exports.getAllApplications = async (req, res) => {
    try {
        const { status, jobId } = req.query;

        let query = {};
        if (status) query.status = status;
        if (jobId) query.job = jobId;

        const applications = await Application.find(query)
            .populate('student', 'name email phone branch cgpa batch collegeName resume')
            .populate('job', 'companyName jobTitle location')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Admin: Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, adminRemarks } = req.body;

        const validStatuses = ['applied', 'pending', 'shortlisted', 'rejected', 'selected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const application = await Application.findById(req.params.id)
            .populate('student', 'name email')
            .populate('job', 'companyName jobTitle');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const previousStatus = application.status;
        application.status = status;
        if (adminRemarks) application.adminRemarks = adminRemarks;
        await application.save();

        // ✅ Safe email
        if (previousStatus !== status) {
            const emailStatuses = ['shortlisted', 'selected', 'rejected'];
            if (emailStatuses.includes(status)) {
                try {
                    await sendApplicationStatusEmail(
                        application.student.email,
                        application.student.name,
                        application.job.jobTitle,
                        application.job.companyName,
                        status
                    );
                } catch (emailError) {
                    console.log('Status email failed:', emailError.message);
                }
            }
        }

        const updatedApplication = await Application.findById(req.params.id)
            .populate('student', 'name email phone branch cgpa')
            .populate('job', 'companyName jobTitle');

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application: updatedApplication
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Student: Withdraw Application
exports.withdrawApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const studentId = req.user._id;

        const application = await Application.findById(applicationId)
            .populate('job', 'companyName jobTitle deadline');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.student.toString() !== studentId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only withdraw your own applications'
            });
        }

        if (application.status === 'selected') {
            return res.status(400).json({
                success: false,
                message: 'Cannot withdraw a selected application'
            });
        }

        await Application.findByIdAndDelete(applicationId);

        res.status(200).json({
            success: true,
            message: `Application withdrawn successfully`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; // ✅ Properly closed here