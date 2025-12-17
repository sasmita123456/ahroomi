const nodemailer = require("nodemailer");

class EmailService {
    constructor() {

        this.simulateEmail =
            process.env.NODE_ENV === "development" &&
            process.env.SIMULATE_EMAIL === "true";

        if (this.simulateEmail) {
            console.log("📩 Email simulation enabled — no real emails will be sent.");
            return;
        }

        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("⚠️  Email configuration incomplete - emails will not be sent");
            this.transporter = null;
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,    
            port: Number(process.env.EMAIL_PORT), 
            secure: true, 
            auth: {
                user: process.env.EMAIL_USER,    
                pass: process.env.EMAIL_PASS,    
            },
          
        });

        // VERIFY SMTP CONNECTION
        this.transporter.verify((error, success) => {
            if (error) {
                console.error("❌ SMTP Verification Failed:", error.message);
                console.error("🔧 Please check your email configuration in .env file");
                console.error("📘 Make sure you're using a Zoho App Password, not your regular password");
            } else {
                console.log("✅ SMTP Server is ready to send emails.");
            }
        });
    }

    // SEND OTP EMAIL
    async sendOtp(email, otp) {
        if (this.simulateEmail) {
            console.log(`SIMULATED OTP: ${otp} → ${email}`);
            return { success: true, messageId: "simulated-message-id" };
        }

        if (!this.transporter) {
            console.warn("📧 Email transporter not configured - skipping email send");
            return { success: false, error: "Email transporter not configured" };
        }

        const mailOptions = {
            from: `"Aashdit Admin" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Admin Login OTP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color:#222;">Admin Login OTP</h2>
                    <p>Your OTP for admin login is:</p>
                    <div style="padding:15px;background:#eee;border-radius:8px;text-align:center;">
                        <h1 style="color:#e67e22;letter-spacing:4px;">${otp}</h1>
                    </div>
                    <p>Valid for 5 minutes. Do not share this code.</p>
                    <hr />
                    <small style="color:#777;">Automated email — please do not reply.</small>
                </div>
            `
        };

        try {
            console.log("📨 Sending OTP email to:", email);

            const info = await this.transporter.sendMail(mailOptions);

            console.log("✅ Email sent successfully:", info.messageId);

            return { success: true, messageId: info.messageId };

        } catch (error) {
            console.error("❌ Email Error:", error.message);

            if (error.response) console.error("SMTP Response:", error.response);
            if (error.code) console.error("SMTP Code:", error.code);

            let errorMessage = error.message;
            if (error.code === 'EAUTH' || error.message.includes('BadCredentials')) {
                errorMessage = "Email authentication failed. Please ensure you're using an App Password, not your regular password, and that 2-Factor Authentication is enabled for your email account.";
            }

            return { success: false, error: errorMessage };
        }
    }
}

module.exports = new EmailService();