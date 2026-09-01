const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendEmail } = require('../services/emailService');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const sendTokenResponse = (user, statusCode, message, res) => {
    const token = generateToken(user._id);

    const cookieOptions = {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    user.password = undefined;

    res.status(statusCode)
       .cookie('token', token, cookieOptions)
       .json({
           success: true,
           message,
           user: {
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               profileComplete: user.profileComplete
           }
       });
};

// ============================================
// API 1: Signup (SINGLE - removed duplicate)
// ============================================
// ✅ SIRF EK exports.signup hona chahiye - with email wala
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered. Please login'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'student'
        });

        try {
            await sendWelcomeEmail(email, name);
        } catch (emailError) {
            console.log('Email failed:', emailError.message);
        }

        sendTokenResponse(user, 201, 'User registered successfully', res);

    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// API 2: Login
// ============================================
exports.login = async (req, res) => {
    try {
        // console.log('🔐 Login attempt:', req.body.email);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        sendTokenResponse(user, 200, 'Login successful', res);

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// API 3: Logout
// ============================================
exports.logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// API 4: Get Me
// ============================================
exports.getme = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ============================================
// API 5: Forgot Password
// ============================================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }

        // Token generate karo
        const resetToken = user.generateResetToken();
        await user.save({ validateBeforeSave: false });

        // Reset URL
        const resetUrl = `${process.env.Frontend_URI || 'http://localhost:5173'}/reset-password/${resetToken}`;

        // Email HTML
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #6c63ff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">🎓 CampusHire</h1>
                </div>
                <div style="padding: 30px; background: #fff; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333;">Reset Your Password</h2>
                    <p style="color: #666;">Hi <strong>${user.name}</strong>,</p>
                    <p style="color: #666;">You requested to reset your password. Click the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background: #6c63ff; color: white; padding: 14px 30px; 
                                  border-radius: 8px; text-decoration: none; font-weight: bold;
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #999; font-size: 13px;">
                        ⏰ This link expires in <strong>15 minutes</strong>
                    </p>
                    <p style="color: #999; font-size: 13px;">
                        If button doesn't work, copy this link:
                    </p>
                    <p style="color: #6c63ff; font-size: 12px; word-break: break-all;">
                        ${resetUrl}
                    </p>
                    <p style="color: #999; font-size: 13px;">
                        If you didn't request this, ignore this email.
                    </p>
                </div>
            </div>
        `;

        // ✅ Email bhejo
        const emailSent = await sendEmail({
            to: email,
            subject: '🔐 Reset Your Password - CampusHire',
            html: html
        });

        // ✅ Email fail ho gayi
        if (!emailSent) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent. Please try again.'
            });
        }

        // ✅ Success
        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });

    } catch (error) {
        console.error('❌ Forgot password error:', error);

        // Error pe token clear karo
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({ validateBeforeSave: false });
            }
        } catch (e) {}

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// API 6: Reset Password
// ============================================
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new password'
            });
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, 'Password reset successful', res);

    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};