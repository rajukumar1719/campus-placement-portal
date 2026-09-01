const Job = require('../models/Job');
const Application = require('../models/Application');

// ✅ UPDATED: Get All Jobs with Search & Filter
exports.getAllJobs = async (req, res) => {
    try {
        const {
            search,
            jobType,
            location,
            minCGPA,
            salary,
            branch,
            sortBy,
            page = 1,
            limit = 12
        } = req.query;

        // ✅ Base query - only active jobs
        let query = { status: 'active' };

        // ✅ Search: title, company, location
        if (search) {
            query.$or = [
                { companyName: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { eligibility: { $regex: search, $options: 'i' } }
            ];
        }

        // ✅ Filter: Job Type
        if (jobType) {
            query.jobType = jobType;
        }

        // ✅ Filter: Location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // ✅ Filter: Min CGPA (show jobs where minCGPA <= student's CGPA)
        if (minCGPA) {
            query.minCGPA = { $lte: parseFloat(minCGPA) };
        }

        // ✅ Filter: Salary
        if (salary) {
            query.salary = { $regex: salary, $options: 'i' };
        }

        // ✅ Filter: Branch/Eligibility
        if (branch) {
            query.eligibility = { $regex: branch, $options: 'i' };
        }

        // ✅ Filter: Only non-expired jobs
        query.deadline = { $gte: new Date() };

        // ✅ Sort options
        let sortOption = { createdAt: -1 }; // Default: newest first

        if (sortBy === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sortBy === 'deadline') {
            sortOption = { deadline: 1 };
        } else if (sortBy === 'cgpa_low') {
            sortOption = { minCGPA: 1 };
        } else if (sortBy === 'cgpa_high') {
            sortOption = { minCGPA: -1 };
        }

        // ✅ Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Job.countDocuments(query);

        // ✅ Fetch jobs
        const jobs = await Job.find(query)
            .populate('postedBy', 'name')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        // ✅ Get unique values for filter dropdowns
        const allJobs = await Job.find({ status: 'active' });
        const locations = [...new Set(allJobs.map(j => j.location))].sort();
        const jobTypes = [...new Set(allJobs.map(j => j.jobType))].sort();
        const branches = [...new Set(
            allJobs.flatMap(j => j.eligibility.split(',').map(b => b.trim()))
        )].sort();

        res.status(200).json({
            success: true,
            count: jobs.length,
            total: total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            jobs: jobs,
            filters: {
                locations,
                jobTypes,
                branches
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ Rest of the functions same rahenge
exports.createJob = async (req, res) => {
    try {
        const {
            companyName, jobTitle, description, jobType,
            location, salary, eligibility, minCGPA,
            deadline, applyLink
        } = req.body;

        if (!companyName || !jobTitle || !description || !location || !salary || !eligibility || !deadline) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        const job = await Job.create({
            companyName,
            jobTitle,
            description,
            jobType: jobType || 'Full Time',
            location,
            salary,
            eligibility,
            minCGPA: minCGPA || 0,
            deadline,
            applyLink: applyLink || '',
            postedBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Job posted successfully',
            job: job
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSingleJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            job: job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const allowedUpdates = [
            'companyName', 'jobTitle', 'description', 'jobType',
            'location', 'salary', 'eligibility', 'minCGPA',
            'deadline', 'applyLink', 'status'
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        job = await Job.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            job: job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ job: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Job and related applications deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAdminAllJobs = async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'applications'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'postedBy',
                    foreignField: '_id',
                    as: 'postedBy'
                }
            },
            {
                $unwind: {
                    path: '$postedBy',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    applicationCount: { $size: '$applications' }
                }
            },
            {
                $project: {
                    applications: 0,
                    'postedBy.password': 0
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs: jobs
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ NEW FEATURE: Save / Unsave a job (toggle bookmark)
exports.toggleSaveJob = async (req, res) => {
    try {
        const User = require('../models/User');
        const jobId = req.params.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const user = await User.findById(req.user._id);
        const alreadySaved = user.savedJobs.some(id => id.toString() === jobId);

        if (alreadySaved) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        } else {
            user.savedJobs.push(jobId);
        }

        await user.save();

        res.status(200).json({
            success: true,
            saved: !alreadySaved,
            message: alreadySaved ? 'Job removed from saved list' : 'Job saved successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ NEW FEATURE: Get all saved jobs of logged-in student
exports.getSavedJobs = async (req, res) => {
    try {
        const User = require('../models/User');

        const user = await User.findById(req.user._id).populate({
            path: 'savedJobs',
            populate: { path: 'postedBy', select: 'name' }
        });

        res.status(200).json({
            success: true,
            count: user.savedJobs.length,
            jobs: user.savedJobs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};