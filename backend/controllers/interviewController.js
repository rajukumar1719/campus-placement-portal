const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// ✅ Admin: Schedule Interview
exports.scheduleInterview = async (req, res) => {
    try {
        const {
            applicationId,
            interviewDate,
            interviewTime,
            interviewType,
            venue,
            meetingLink,
            round,
            instructions
        } = req.body;

        // Validation
        if (!applicationId || !interviewDate || !interviewTime) {
            return res.status(400).json({
                success: false,
                message: 'Application ID, date, and time are required'
            });
        }

        // ✅ FIX: Pehle bina populate ke application find karo
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // ✅ FIX: Student aur Job alag se find karo
        const student = await User.findById(application.student);
        const job = await Job.findById(application.job);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // ✅ Create interview - direct IDs use karo
        const interview = await Interview.create({
            application: applicationId,
            student: application.student,  // ✅ Direct se - populate se nahi
            job: application.job,          // ✅ Direct se - populate se nahi
            interviewDate,
            interviewTime,
            interviewType: interviewType || 'Online',
            venue: venue || '',
            meetingLink: meetingLink || '',
            round: round || 'Round 1',
            instructions: instructions || '',
            scheduledBy: req.user._id
        });

        // ✅ Safe Email - crash na ho agar fail ho
        try {
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#f5f7fa;font-family:'Segoe UI',sans-serif;">
                <div style="max-width:600px;margin:0 auto;padding:20px;">
                    <div style="background:#6c63ff;border-radius:16px 16px 0 0;padding:30px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:24px;">🎓 CampusHire</h1>
                        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Interview Scheduled</p>
                    </div>
                    <div style="background:#fff;padding:30px;border-radius:0 0 16px 16px;">
                        <div style="text-align:center;margin-bottom:20px;">
                            <span style="display:inline-block;padding:8px 24px;background:#27ae60;color:#fff;border-radius:20px;font-size:13px;font-weight:700;">
                                INTERVIEW SCHEDULED
                            </span>
                        </div>
                        <h2 style="color:#1a1a2e;text-align:center;font-size:20px;">
                            📅 Interview Invitation
                        </h2>
                        <p style="color:#666;font-size:15px;line-height:1.8;">
                            Hi <strong>${student.name}</strong>,
                        </p>
                        <p style="color:#666;font-size:15px;line-height:1.8;">
                            Your interview has been scheduled for <strong>${job.jobTitle}</strong> 
                            at <strong>${job.companyName}</strong>.
                        </p>
                        <div style="background:#f9f9ff;border-radius:12px;padding:20px;border-left:4px solid #6c63ff;margin:20px 0;">
                            <table style="width:100%;">
                                <tr>
                                    <td style="color:#999;font-size:13px;padding:8px 0;">📅 Date</td>
                                    <td style="color:#1a1a2e;font-size:14px;font-weight:700;text-align:right;">
                                        ${new Date(interviewDate).toDateString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#999;font-size:13px;padding:8px 0;">⏰ Time</td>
                                    <td style="color:#1a1a2e;font-size:14px;font-weight:700;text-align:right;">
                                        ${interviewTime}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#999;font-size:13px;padding:8px 0;">📍 Type</td>
                                    <td style="color:#1a1a2e;font-size:14px;font-weight:700;text-align:right;">
                                        ${interviewType || 'Online'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#999;font-size:13px;padding:8px 0;">🔄 Round</td>
                                    <td style="color:#1a1a2e;font-size:14px;font-weight:700;text-align:right;">
                                        ${round || 'Round 1'}
                                    </td>
                                </tr>
                                ${venue ? `
                                <tr>
                                    <td style="color:#999;font-size:13px;padding:8px 0;">🏢 Venue</td>
                                    <td style="color:#1a1a2e;font-size:14px;font-weight:700;text-align:right;">
                                        ${venue}
                                    </td>
                                </tr>` : ''}
                                ${meetingLink ? `
                                <tr>
                                    <td style="color:#999;font-size:13px;padding:8px 0;">🔗 Link</td>
                                    <td style="font-size:14px;text-align:right;">
                                        <a href="${meetingLink}" style="color:#6c63ff;font-weight:700;">
                                            Join Meeting
                                        </a>
                                    </td>
                                </tr>` : ''}
                            </table>
                        </div>
                        ${instructions ? `
                        <div style="background:#fff8e1;border-radius:12px;padding:16px;border-left:4px solid #f39c12;margin:15px 0;">
                            <p style="color:#f39c12;font-weight:700;margin:0 0 8px;">📝 Instructions:</p>
                            <p style="color:#666;font-size:14px;margin:0;line-height:1.6;">${instructions}</p>
                        </div>` : ''}
                        <div style="text-align:center;margin:25px 0;">
                            <a href="${process.env.Frontend_URI || 'http://localhost:5173'}/interviews" 
                               style="display:inline-block;padding:14px 35px;background:#6c63ff;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;">
                                View Interview Details →
                            </a>
                        </div>
                        <hr style="border:none;border-top:1px solid #f0f0f0;margin:20px 0;">
                        <p style="color:#aaa;font-size:12px;text-align:center;">
                            This is an automated email from CampusHire.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `;

            await sendEmail({
                to: student.email,
                subject: `📅 Interview Scheduled - ${job.companyName} | ${round || 'Round 1'}`,
                html: emailHtml
            });

            console.log('✅ Interview email sent to:', student.email);

        } catch (emailError) {
            console.log('⚠️ Email failed:', emailError.message);
            // Email fail ho bhi to interview schedule hoga
        }

        // ✅ Populated response
        const populatedInterview = await Interview.findById(interview._id)
            .populate('student', 'name email phone')
            .populate('job', 'companyName jobTitle')
            .populate('scheduledBy', 'name');

        res.status(201).json({
            success: true,
            message: 'Interview scheduled! Email sent to student.',
            interview: populatedInterview
        });

    } catch (error) {
        console.error('❌ Schedule Interview Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Admin: Get All Interviews
exports.getAllInterviews = async (req, res) => {
    try {
        const { status, date } = req.query;
        let query = {};

        if (status) query.status = status;
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.interviewDate = { $gte: startOfDay, $lte: endOfDay };
        }

        const interviews = await Interview.find(query)
            .populate('student', 'name email phone branch cgpa')
            .populate('job', 'companyName jobTitle')
            .populate('scheduledBy', 'name')
            .sort({ interviewDate: 1, interviewTime: 1 });

        res.status(200).json({
            success: true,
            count: interviews.length,
            interviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Student: Get My Interviews
exports.getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ student: req.user._id })
            .populate('job', 'companyName jobTitle location')
            .sort({ interviewDate: 1 });

        res.status(200).json({
            success: true,
            count: interviews.length,
            interviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Admin: Update Interview
exports.updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        const allowedUpdates = [
            'interviewDate', 'interviewTime', 'interviewType',
            'venue', 'meetingLink', 'round', 'instructions',
            'status', 'adminNotes'
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updated = await Interview.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        )
        .populate('student', 'name email phone')
        .populate('job', 'companyName jobTitle');

        // ✅ Safe Email on update/cancel
        try {
            if (req.body.status === 'cancelled' || req.body.interviewDate || req.body.interviewTime) {
                const student = await User.findById(interview.student);
                const job = await Job.findById(interview.job);

                if (student && job) {
                    const statusMsg = req.body.status === 'cancelled'
                        ? 'Your interview has been <strong style="color:#e74c3c;">cancelled</strong>.'
                        : 'Your interview details have been <strong style="color:#f39c12;">updated</strong>.';

                    await sendEmail({
                        to: student.email,
                        subject: `📅 Interview ${req.body.status === 'cancelled' ? 'Cancelled' : 'Updated'} - ${job.companyName}`,
                        html: `
                        <div style="max-width:600px;margin:0 auto;padding:20px;font-family:'Segoe UI',sans-serif;">
                            <div style="background:#6c63ff;border-radius:16px 16px 0 0;padding:25px;text-align:center;">
                                <h1 style="color:#fff;margin:0;font-size:22px;">🎓 CampusHire</h1>
                            </div>
                            <div style="background:#fff;padding:30px;border-radius:0 0 16px 16px;">
                                <p style="color:#666;font-size:15px;">Hi <strong>${student.name}</strong>,</p>
                                <p style="color:#666;font-size:15px;line-height:1.8;">${statusMsg}</p>
                                <div style="background:#f9f9ff;padding:16px;border-radius:10px;margin:15px 0;">
                                    <p style="margin:5px 0;color:#444;"><strong>Position:</strong> ${job.jobTitle}</p>
                                    <p style="margin:5px 0;color:#444;"><strong>Company:</strong> ${job.companyName}</p>
                                    <p style="margin:5px 0;color:#444;"><strong>Date:</strong> ${new Date(updated.interviewDate).toDateString()}</p>
                                    <p style="margin:5px 0;color:#444;"><strong>Time:</strong> ${updated.interviewTime}</p>
                                </div>
                                <div style="text-align:center;margin:20px 0;">
                                    <a href="${process.env.Frontend_URI || 'http://localhost:5173'}/interviews" 
                                       style="display:inline-block;padding:12px 30px;background:#6c63ff;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;">
                                        View Details →
                                    </a>
                                </div>
                            </div>
                        </div>
                        `
                    });
                }
            }
        } catch (emailError) {
            console.log('⚠️ Update email failed:', emailError.message);
        }

        res.status(200).json({
            success: true,
            message: `Interview ${req.body.status === 'cancelled' ? 'cancelled' : 'updated'} successfully`,
            interview: updated
        });

    } catch (error) {
        console.error('❌ Update Interview Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Admin: Delete Interview
exports.deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({
                success: false,
                message: 'Interview not found'
            });
        }

        await Interview.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Interview deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete Interview Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Admin: Get Shortlisted Applications
exports.getShortlistedApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            status: { $in: ['shortlisted', 'selected'] }
        })
        .populate('student', 'name email phone branch')
        .populate('job', 'companyName jobTitle')
        .sort({ createdAt: -1 });

        // ✅ Already scheduled check
        const scheduledAppIds = await Interview.find({
            status: 'scheduled'
        }).distinct('application');

        const appsWithScheduleStatus = applications.map(app => ({
            ...app.toObject(),
            isScheduled: scheduledAppIds.some(
                id => id.toString() === app._id.toString()
            )
        }));

        res.status(200).json({
            success: true,
            count: applications.length,
            applications: appsWithScheduleStatus
        });

    } catch (error) {
        console.error('❌ Shortlisted Apps Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};