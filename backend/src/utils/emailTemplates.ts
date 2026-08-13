const escapeHtml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const layout = (title: string, body: string): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%); padding: 40px 16px 20px 16px;">
      <tr>
        <td align="center" style="vertical-align: top; height: 100%;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto;">
            <!-- Card -->
            <tr>
              <td style="background-color: #ffffff; border-radius: 16px; padding: 40px 36px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04); border: 1px solid rgba(255, 255, 255, 0.5);">
                <!-- Status Badge -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                  <tr>
                    <td style="background: #eff6ff; color: #2563eb; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; padding: 4px 14px; border-radius: 9999px; border: 1px solid #bfdbfe;">
                      🔐 ${escapeHtml(title)}
                    </td>
                  </tr>
                </table>
                
                <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
                  ${escapeHtml(title)}
                </h1>
                
                <div style="font-size: 15px; line-height: 1.7; color: #475569;">
                  ${body}
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td align="center" style="padding-top: 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="font-size: 12px; color: #94a3b8; line-height: 1.6;">
                  <tr>
                    <td align="center">
                      If you didn't request this, you can safely ignore this email.
                      <br />
                      <span style="color: #cbd5e1;">·</span>
                      <span style="color: #94a3b8;">&copy; ${new Date().getFullYear()} All rights reserved</span>
                      <span style="color: #cbd5e1;">·</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;
const otpCodeBlock = (code: string): string => `
  <div style="margin: 24px 0; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8;">
    ${escapeHtml(code)}
  </div>
`;

export const verificationEmail = (
  name: string,
  code: string,
  minutes: number,
): { subject: string; html: string; text: string } => {
  const body = `
    <p>Hello ${escapeHtml(name)},</p>
    <p>Welcome aboard! Use the code below to verify your email address.</p>
    ${otpCodeBlock(code)}
    <p>This code expires in ${minutes} minutes.</p>
  `;
  return {
    subject: "Verify your email",
    html: layout("Verify your email", body),
    text: `Hello ${name}, welcome! Your verification code is ${code}. It expires in ${minutes} minutes.`,
  };
};

export const resendVerificationEmail = (
  name: string,
  code: string,
  minutes: number,
): { subject: string; html: string; text: string } => {
  const body = `
    <p>Hello ${escapeHtml(name)},</p>
    <p>Here is a fresh verification code for your account.</p>
    ${otpCodeBlock(code)}
    <p>This code expires in ${minutes} minutes.</p>
  `;
  return {
    subject: "Your new verification code",
    html: layout("New verification code", body),
    text: `Hello ${name}, your new verification code is ${code}. It expires in ${minutes} minutes.`,
  };
};

export const welcomeEmail = (name: string): { subject: string; html: string; text: string } => {
  const body = `
    <p>Hello ${escapeHtml(name)},</p>
    <p>Your email has been verified and your account is now ready to use.</p>
    <p>You can now sign in and start managing your inventory.</p>
  `;
  return {
    subject: "Welcome to POS",
    html: layout("Welcome!", body),
    text: `Hello ${name}, your email has been verified and your account is ready. Welcome aboard!`,
  };
};

export const loginAlertEmail = (
  name: string,
  ip: string,
  device: string,
): { subject: string; html: string; text: string } => {
  const body = `
    <p>Hello ${escapeHtml(name)},</p>
    <p>We noticed a new sign in to your account. If this was you, no action is needed.</p>
    <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #374151;">
      <p style="margin: 0 0 8px;"><strong>IP address:</strong> ${escapeHtml(ip)}</p>
      <p style="margin: 0;"><strong>Device:</strong> ${escapeHtml(device)}</p>
    </div>
    <p>If this wasn't you, please reset your password right away.</p>
  `;
  return {
    subject: "New sign in to your account",
    html: layout("New sign in detected", body),
    text: `Hello ${name}, a new sign in was detected on your account from IP ${ip} (${device}). If this wasn't you, please reset your password.`,
  };
};

export const passwordResetEmail = (
  name: string,
  code: string,
  minutes: number,
): { subject: string; html: string; text: string } => {
  const body = `
    <p>Hello ${escapeHtml(name)},</p>
    <p>We received a request to reset your password. Use the code below to continue.</p>
    ${otpCodeBlock(code)}
    <p>This code expires in ${minutes} minutes. If you didn't request this, no action is needed.</p>
  `;
  return {
    subject: "Reset your password",
    html: layout("Reset your password", body),
    text: `Hello ${name}, your password reset code is ${code}. It expires in ${minutes} minutes.`,
  };
};

export const accountDeletedEmail = (name: string): { subject: string; html: string; text: string } => {
  const body = `
    <p>Hello ${escapeHtml(name)},</p>
    <p>Your account has been deleted. All of your data has been permanently removed from our system.</p>
    <p>If this was a mistake, or you'd like to start over, you can create a new account at any time.</p>
    <p>We're sorry to see you go.</p>
  `;
  return {
    subject: "Your account has been deleted",
    html: layout("Account deleted", body),
    text: `Hello ${name}, your account has been deleted and all your data has been permanently removed. If this was a mistake, you can create a new account at any time.`,
  };
};
