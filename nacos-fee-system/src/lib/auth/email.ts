import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@sacoetec.edu.ng',
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

/**
 * Send verification email to student
 */
export async function sendVerificationEmail(
  email: string,
  fullName: string,
  token: string
): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SACOETEC NACOS</h1>
          <p style="color: #e2e8f0; margin: 5px 0 0 0; font-size: 14px;">Fee Clearance System</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1a365d; margin-top: 0;">Hello, ${fullName}!</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Thank you for registering on the NACOS Fee Clearance System. Please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="display: inline-block; background-color: #38a169; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #4299e1; font-size: 12px; word-break: break-all;">
            ${verificationLink}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            This link expires in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Sikiru Adetona College of Education, Science and Technology</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const success = await sendEmail({
    to: email,
    subject: 'Verify Your Email - NACOS Fee Clearance System',
    html,
  });

  if (!success) {
    console.log('---------------------------------------------------');
    console.log('⚠ EMAIL SENDING FAILED (Dev Fallback)');
    console.log(`To: ${email}`);
    console.log(`Verification Link: ${verificationLink}`);
    console.log('---------------------------------------------------');
  }

  return success;
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  fullName: string,
  feeTitle: string,
  amount: number,
  reference: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">SACOETEC NACOS</h1>
          <p style="color: #e2e8f0; margin: 5px 0 0 0; font-size: 14px;">Fee Clearance System</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; background-color: #c6f6d5; border-radius: 50%; padding: 15px;">
              <span style="font-size: 30px;">✓</span>
            </div>
          </div>
          
          <h2 style="color: #38a169; margin-top: 0; text-align: center;">Payment Successful!</h2>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Dear ${fullName}, your payment has been confirmed successfully.
          </p>
          
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #718096; padding: 8px 0;">Fee:</td>
                <td style="color: #1a365d; font-weight: 600; text-align: right;">${feeTitle}</td>
              </tr>
              <tr>
                <td style="color: #718096; padding: 8px 0;">Amount:</td>
                <td style="color: #1a365d; font-weight: 600; text-align: right;">₦${amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color: #718096; padding: 8px 0;">Reference:</td>
                <td style="color: #1a365d; font-weight: 600; text-align: right; font-size: 12px;">${reference}</td>
              </tr>
              <tr>
                <td style="color: #718096; padding: 8px 0;">Date:</td>
                <td style="color: #1a365d; font-weight: 600; text-align: right;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #4a5568; line-height: 1.6;">
            Your clearance status has been automatically updated. You can view your clearance status on your dashboard.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">
            Keep this email as your payment receipt.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Sikiru Adetona College of Education, Science and Technology</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Payment Confirmed - NACOS Fee Clearance System',
    html,
  });
}
