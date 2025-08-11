const generateWelcomeEmail = (name, email) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Task Management</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 30px;">
      <div style="text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png" width="80" alt="Task Logo" style="margin-bottom: 20px;" />
        <h1 style="color: #4A6CF7;">Welcome to Task Management, ${name}!</h1>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">
        We're thrilled to have you join our community! 🎉<br><br>
        <strong>Task Management</strong> is your smart productivity partner where you can:
      </p>

      <ul style="padding-left: 20px; font-size: 15px; line-height: 1.7;">
        <li>✅ Create new tasks and goals</li>
        <li>✏️ Edit and update your task details anytime</li>
        <li>🗑️ Delete completed or unwanted tasks</li>
        <li>📋 Organize everything in a clean dashboard</li>
        <li>🔒 Enjoy secure login with your registered email: <strong>${email}</strong></li>
      </ul>


      <p style="font-size: 14px; color: #555;">
        If you ever need help, just reply to this email or contact our support team.
      </p>

      <hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} Task Management App. All rights reserved.<br />
        123 Task Street, Productivity City, Earth 🌍
      </p>

      <p style="font-size: 12px; text-align: center;">
        <a href="https://your-task-app.com/unsubscribe" style="color: #bbb; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </body>
  </html>
  `;
};

const generateLoginEmail = (name, email, ipAddress = 'Unknown') => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Login Alert - Task Management</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f6fa; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 32px;">
      <div style="text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/2107/2107957.png" width="72" alt="Login Icon" style="margin-bottom: 20px;" />
        <h2 style="color: #333;">Hi ${name}, you just logged in!</h2>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #555;">
        We noticed a successful login to your <strong>Task Management</strong> account using the email:
      </p>

      <p style="background-color: #f0f2f7; padding: 12px 18px; border-radius: 8px; font-size: 16px; color: #333;">
        📧 <strong>${email}</strong>
      </p>

      <p style="margin-top: 16px; font-size: 15px; color: #555;">
        // <strong>IP Address:</strong> ${ipAddress}<br />
        <strong>Time:</strong> ${new Date().toLocaleString()}
      </p>

    //   <div style="margin: 28px 0;">
    //     <a href="https://your-task-app.com/dashboard" style="background-color: #4A6CF7; padding: 14px 28px; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
    //   </div>

    //   <p style="font-size: 14px; color: #777;">
    //     If this wasn’t you, please <a href="https://your-task-app.com/reset-password" style="color: #4A6CF7;">reset your password</a> immediately or contact support.
    //   </p>

      <hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} Task Management App. All rights reserved.<br />
        123 Task Street, Productivity City, Earth 🌍
      </p>

      <p style="font-size: 12px; text-align: center;">
        <a href="https://your-task-app.com/unsubscribe" style="color: #bbb; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </body>
  </html>
  `;
};

const generateOtpVerificationEmail = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Account - Task Management</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png" width="72" alt="OTP Icon" style="margin-bottom: 20px;" />
        <h2 style="color: #4A6CF7;">Verify Your Email Address</h2>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">
        Hi <strong>${name}</strong>,<br /><br />
        You're almost done! Please use the OTP below to verify your email address and activate your Task Management account.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 28px; background-color: #f0f2f5; padding: 16px 24px; border-radius: 8px; display: inline-block; letter-spacing: 4px; font-weight: bold; color: #333;">
          ${otp}
        </p>
      </div>

      <p style="font-size: 14px; color: #555;">
        This OTP is valid for the next <strong>24 hours</strong>. Please do not share this code with anyone.
      </p>

      <p style="font-size: 14px; color: #777;">
        Didn’t request this code? You can safely ignore this email.
      </p>

      <hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} Task Management App. All rights reserved.<br />
        123 Task Street, Productivity City, Earth 🌍
      </p>

      <p style="font-size: 12px; text-align: center;">
        <a href="https://your-task-app.com/unsubscribe" style="color: #bbb; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </body>
  </html>
  `;
};


const generateResetPasswordOtpEmail = (name, email, otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password OTP - Task Management</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f6fa; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 32px;">
      <div style="text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png" width="72" alt="Reset Password Icon" style="margin-bottom: 20px;" />
        <h2 style="color: #4A6CF7;">Reset Password Request</h2>
      </div>

      <p style="font-size: 16px; color: #333;">
        Hi <strong>${name}</strong>,<br /><br />
        We received a request to reset the password for your <strong>Task Management</strong> account associated with:
      </p>

      <p style="background-color: #f0f2f7; padding: 12px 18px; border-radius: 8px; font-size: 16px; color: #333;">
        📧 <strong>${email}</strong>
      </p>

      <p style="font-size: 16px; color: #333; margin-top: 24px;">
        Use the following OTP to verify your identity and reset your password:
      </p>

      <p style="font-size: 24px; text-align: center; background-color: #eaf1ff; padding: 16px; border-radius: 10px; color: #1a237e; letter-spacing: 2px;">
        🔐 <strong>${otp}</strong>
      </p>

      <p style="font-size: 14px; color: #777; margin-top: 20px;">
        ⚠️ This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="https://your-task-app.com/reset-password" style="background-color: #4A6CF7; padding: 14px 28px; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
      </div>

      <p style="font-size: 14px; color: #777;">
        Didn't request a password reset? You can safely ignore this email.
      </p>

      <hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;" />

      <p style="font-size: 12px; color: #999; text-align: center;">
        © ${new Date().getFullYear()} Task Management App. All rights reserved.<br />
        123 Task Street, Productivity City, Earth 🌍
      </p>

      <p style="font-size: 12px; text-align: center;">
        <a href="https://your-task-app.com/unsubscribe" style="color: #bbb; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>
  </body>
  </html>
  `;
};



export {generateWelcomeEmail,generateLoginEmail,generateOtpVerificationEmail,generateResetPasswordOtpEmail}
