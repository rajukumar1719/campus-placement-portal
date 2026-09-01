const nodemailer = require('nodemailer');

// ✅ Email Transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        family: 4,
        tls: {
            rejectUnauthorized: false
        }
    });
};

// ✅ Send Email Function
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        await transporter.verify();
        console.log('✅ SMTP Connected Successfully');

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'CampusHire <noreply@campushire.com>',
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${options.to}: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error(`❌ Email failed to ${options.to}:`, error.message);
        return false;
    }
};

// ✅ Application Status Email
const sendApplicationStatusEmail = async (studentEmail, studentName, jobTitle, companyName, status) => {
    const statusConfig = {
        shortlisted: {
            subject: `🎉 Congratulations! You're Shortlisted - ${companyName}`,
            emoji: '🎉',
            color: '#27ae60',
            heading: 'You\'ve Been Shortlisted!',
            message: `Great news! Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted. The company is interested in your profile and you may receive further communication regarding the next steps.`,
            badge: 'SHORTLISTED',
            badgeColor: '#27ae60'
        },
        selected: {
            subject: `🏆 You're Selected! - ${companyName}`,
            emoji: '🏆',
            color: '#6c63ff',
            heading: 'Congratulations! You\'re Selected!',
            message: `Amazing news! You have been <strong>selected</strong> for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. This is a huge achievement. The placement cell will contact you with further details.`,
            badge: 'SELECTED',
            badgeColor: '#6c63ff'
        },
        rejected: {
            subject: `Application Update - ${companyName}`,
            emoji: '📋',
            color: '#e74c3c',
            heading: 'Application Status Update',
            message: `Thank you for your interest in <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. After careful review, we regret to inform you that your application was not selected for this position. Don't be discouraged — keep applying to other opportunities!`,
            badge: 'NOT SELECTED',
            badgeColor: '#e74c3c'
        },
        applied: {
            subject: `✅ Application Received - ${companyName}`,
            emoji: '✅',
            color: '#f39c12',
            heading: 'Application Submitted Successfully!',
            message: `Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been received. Our team will review your profile and you will be notified about the next steps.`,
            badge: 'APPLIED',
            badgeColor: '#f39c12'
        }
    };

    const config = statusConfig[status];

    if (!config) {
        console.error('❌ Unknown status:', status);
        return false;
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
            
            <!-- Header -->
            <div style="background:${config.color};border-radius:16px 16px 0 0;padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:28px;">🎓 CampusHire</h1>
                <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Campus Placement Portal</p>
            </div>

            <!-- Body -->
            <div style="background:#fff;padding:35px 30px;border-radius:0 0 16px 16px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
                
                <!-- Status Badge -->
                <div style="text-align:center;margin-bottom:25px;">
                    <span style="display:inline-block;padding:8px 24px;background:${config.badgeColor};color:#fff;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:1px;">
                        ${config.badge}
                    </span>
                </div>

                <!-- Greeting -->
                <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 8px;text-align:center;">
                    ${config.emoji} ${config.heading}
                </h2>

                <p style="color:#666;font-size:15px;line-height:1.8;margin:20px 0;">
                    Hi <strong>${studentName}</strong>,
                </p>

                <p style="color:#666;font-size:15px;line-height:1.8;margin:0 0 25px;">
                    ${config.message}
                </p>

                <!-- Job Details Box -->
                <div style="background:#f9f9ff;border-radius:12px;padding:20px;border-left:4px solid ${config.color};margin-bottom:25px;">
                    <table style="width:100%;">
                        <tr>
                            <td style="color:#999;font-size:13px;padding:5px 0;">Position</td>
                            <td style="color:#1a1a2e;font-size:14px;font-weight:700;padding:5px 0;text-align:right;">${jobTitle}</td>
                        </tr>
                        <tr>
                            <td style="color:#999;font-size:13px;padding:5px 0;">Company</td>
                            <td style="color:#6c63ff;font-size:14px;font-weight:700;padding:5px 0;text-align:right;">${companyName}</td>
                        </tr>
                        <tr>
                            <td style="color:#999;font-size:13px;padding:5px 0;">Status</td>
                            <td style="color:${config.badgeColor};font-size:14px;font-weight:700;padding:5px 0;text-align:right;">${config.badge}</td>
                        </tr>
                    </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin:25px 0;">
                    <a href="${process.env.Frontend_URI || 'http://localhost:5173'}/applications/me" 
                       style="display:inline-block;padding:14px 35px;background:${config.color};color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
                        View Application →
                    </a>
                </div>

                <!-- Divider -->
                <hr style="border:none;border-top:1px solid #f0f0f0;margin:25px 0;">

                <!-- Footer Text -->
                <p style="color:#aaa;font-size:12px;text-align:center;margin:0;line-height:1.6;">
                    This is an automated email from CampusHire Placement Portal.<br>
                    Please do not reply to this email.
                </p>
            </div>

            <!-- Bottom Footer -->
            <div style="text-align:center;padding:20px;color:#aaa;font-size:12px;">
                <p>© 2025 CampusHire. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return await sendEmail({
        to: studentEmail,
        subject: config.subject,
        html: html
    });
};

// ✅ Application Submitted Email
const sendApplicationSubmittedEmail = async (studentEmail, studentName, jobTitle, companyName) => {
    return await sendApplicationStatusEmail(studentEmail, studentName, jobTitle, companyName, 'applied');
};

// ✅ Welcome Email
const sendWelcomeEmail = async (studentEmail, studentName) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="margin:0;padding:0;background-color:#f5f7fa;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
            
            <div style="background:#6c63ff;border-radius:16px 16px 0 0;padding:30px;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:28px;">🎓 CampusHire</h1>
            </div>

            <div style="background:#fff;padding:35px 30px;border-radius:0 0 16px 16px;">
                <h2 style="color:#1a1a2e;text-align:center;">Welcome to CampusHire! 👋</h2>
                
                <p style="color:#666;font-size:15px;line-height:1.8;">
                    Hi <strong>${studentName}</strong>,
                </p>
                
                <p style="color:#666;font-size:15px;line-height:1.8;">
                    Welcome to CampusHire! Your account has been created successfully. Here's what you can do:
                </p>

                <div style="background:#f9f9ff;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="color:#444;margin:8px 0;">✅ Complete your Profile</p>
                    <p style="color:#444;margin:8px 0;">✅ Upload your Resume</p>
                    <p style="color:#444;margin:8px 0;">✅ Browse Available Jobs</p>
                    <p style="color:#444;margin:8px 0;">✅ Apply for Jobs</p>
                    <p style="color:#444;margin:8px 0;">✅ Track Application Status</p>
                </div>

                <div style="text-align:center;margin:25px 0;">
                    <a href="${process.env.Frontend_URI || 'http://localhost:5173'}/dashboard" 
                       style="display:inline-block;padding:14px 35px;background:#6c63ff;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;">
                        Go to Dashboard →
                    </a>
                </div>
            </div>

            <div style="text-align:center;padding:20px;color:#aaa;font-size:12px;">
                <p>© 2025 CampusHire. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return await sendEmail({
        to: studentEmail,
        subject: '🎓 Welcome to CampusHire!',
        html: html
    });
};

module.exports = {
    sendEmail,
    sendApplicationStatusEmail,
    sendApplicationSubmittedEmail,
    sendWelcomeEmail
};