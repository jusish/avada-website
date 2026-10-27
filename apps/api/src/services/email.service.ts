import nodemailer, { Transporter } from 'nodemailer';

interface InquiryEmailData {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  orgName?: string | null;
  roleTitle?: string | null;
  country: string;
  inquiryType: string;
  message: string;
  createdAt?: string | Date;
}

interface CountryRecipientInfo {
  name: string;
  code: string;
  officeEmail?: string | null;
  managerEmail?: string | null;
  managerName?: string | null;
}

export interface TeamInvitationData {
  email: string;
  name: string;
  temporaryPassword: string;
  roleName?: string;
  marketHubs?: string[];
  loginUrl?: string;
}

export interface PasswordResetData {
  email: string;
  name: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export class EmailService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter | null {
    if (this.transporter) {
      return this.transporter;
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    if (!host) {
      return null;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });

    return this.transporter;
  }

  /**
   * Sends an inquiry notification to the country-specific office and manager emails.
   * Returns the primary routed recipient email string or null.
   */
  public static async sendInquiryNotification(
    inquiry: InquiryEmailData,
    countryInfo?: CountryRecipientInfo | null
  ): Promise<string | null> {
    const recipients: string[] = [];

    if (countryInfo?.officeEmail?.trim()) {
      recipients.push(countryInfo.officeEmail.trim().toLowerCase());
    }
    if (countryInfo?.managerEmail?.trim()) {
      const mgr = countryInfo.managerEmail.trim().toLowerCase();
      if (!recipients.includes(mgr)) {
        recipients.push(mgr);
      }
    }

    // Fallback email if no country office or manager email exists
    const fallbackEmail = process.env.INQUIRY_FALLBACK_EMAIL || 'sales@avadapay.com';
    if (recipients.length === 0) {
      recipients.push(fallbackEmail);
    }

    const primaryRoutedEmail = recipients[0];
    const countryLabel = countryInfo?.name || inquiry.country;
    const subject = `[AvadaPay] New Inquiry: ${inquiry.fullName} - ${countryLabel} (${inquiry.inquiryType.toUpperCase()})`;

    const textContent = `
NEW INQUIRY RECEIVED FOR ${countryLabel.toUpperCase()}
======================================================
Country Hub: ${countryLabel}
Inquiry Type: ${inquiry.inquiryType}
Full Name: ${inquiry.fullName}
Email Address: ${inquiry.email}
Phone Number: ${inquiry.phone || 'N/A'}
Organization: ${inquiry.orgName || 'N/A'}
Role/Title: ${inquiry.roleTitle || 'N/A'}
Date & Time: ${new Date(inquiry.createdAt || Date.now()).toUTCString()}

Message:
------------------------------------------------------
${inquiry.message}
------------------------------------------------------

This inquiry was routed to: ${recipients.join(', ')}
Manage this inquiry in AvadaPay Admin: https://avadapay.com/admin/inquiries
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0052FF 0%, #0036b3 100%); padding: 28px 32px; color: #ffffff; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px; }
    .title { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; }
    .body { padding: 32px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; }
    .meta-item { font-size: 13px; }
    .meta-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; margin-bottom: 4px; }
    .meta-value { color: #0f172a; font-weight: 600; font-size: 14px; word-break: break-all; }
    .message-box { background: #f8fafc; border-left: 4px solid #0052FF; border-radius: 6px; padding: 18px; margin-bottom: 28px; }
    .message-text { margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
    .cta-btn { display: inline-block; background: #0052FF; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .footer { padding: 20px 32px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">${countryLabel} Market Hub</div>
      <h1 class="title">New Contact Inquiry</h1>
    </div>
    <div class="body">
      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Full Name</div>
          <div class="meta-value">${escapeHtml(inquiry.fullName)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Email Address</div>
          <div class="meta-value"><a href="mailto:${escapeHtml(inquiry.email)}" style="color: #0052FF;">${escapeHtml(inquiry.email)}</a></div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Phone</div>
          <div class="meta-value">${escapeHtml(inquiry.phone || 'N/A')}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Organization / Role</div>
          <div class="meta-value">${escapeHtml(inquiry.orgName || 'N/A')}${inquiry.roleTitle ? ` (${escapeHtml(inquiry.roleTitle)})` : ''}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Inquiry Category</div>
          <div class="meta-value" style="color: #0052FF; text-transform: uppercase;">${escapeHtml(inquiry.inquiryType)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Routed Recipient</div>
          <div class="meta-value">${escapeHtml(recipients.join(', '))}</div>
        </div>
      </div>

      <div class="meta-label" style="margin-bottom: 8px;">Inquiry Message</div>
      <div class="message-box">
        <p class="message-text">${escapeHtml(inquiry.message)}</p>
      </div>

      <div style="text-align: center;">
        <a href="https://avadapay.com/admin/inquiries" class="cta-btn">Open in AvadaPay Admin</a>
      </div>
    </div>
    <div class="footer">
      This notification was automatically sent by AvadaPay Platform because you are registered as the contact for ${countryLabel}.
    </div>
  </div>
</body>
</html>
`.trim();

    const fromAddress = process.env.SMTP_FROM || `"AvadaPay Inquiries" <${process.env.SMTP_USER || 'no-reply@avadapay.com'}>`;
    const transporter = this.getTransporter();

    if (!transporter) {
      console.log(`[EmailService] (Local/Mock) SMTP not configured. Notification would be sent to [${recipients.join(', ')}] with subject: "${subject}"`);
      return primaryRoutedEmail;
    }

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: recipients,
        replyTo: inquiry.email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EmailService] Successfully sent inquiry notification to [${recipients.join(', ')}]`);
    } catch (err) {
      console.error('[EmailService] Failed to send email via SMTP:', err);
    }

    return primaryRoutedEmail;
  }

  /**
   * Sends a branded team member invitation with temporary credentials and first-login instructions.
   */
  public static async sendTeamInvitation(data: TeamInvitationData): Promise<boolean> {
    const defaultLoginUrl = `https://avadapay.com/admin/login?email=${encodeURIComponent(data.email)}`;
    const loginUrl = data.loginUrl || defaultLoginUrl;
    const roleLabel = data.roleName || 'Team Member';
    const hubsLabel = data.marketHubs && data.marketHubs.length > 0
      ? data.marketHubs.join(', ')
      : 'All Markets (Global Access)';
    const subject = `Welcome to AvadaPay CMS - Your Team Invitation & Access Credentials`;

    const textContent = `
WELCOME TO AVADAPAY CMS
======================================================
Hello ${data.name},

You have been invited to join the AvadaPay Content Management & Regional Operations Platform.

Your Account Details:
- Role: ${roleLabel}
- Assigned Markets: ${hubsLabel}
- Corporate Email: ${data.email}
- Temporary Password: ${data.temporaryPassword}

Please sign in using the link below. You will be prompted to set your personal permanent password immediately:
${loginUrl}

Security Notice:
Do not share your temporary password with anyone. If you were not expecting this invitation, please contact your administrator.
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0052FF 0%, #0036b3 100%); padding: 32px; color: #ffffff; text-align: left; }
    .badge { display: inline-block; background: rgba(255,255,255,0.22); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 5px 12px; border-radius: 9999px; margin-bottom: 14px; }
    .title { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .creds-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 20px; margin-bottom: 24px; }
    .creds-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
    .creds-row:last-child { margin-bottom: 0; }
    .creds-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .creds-value { color: #0f172a; font-weight: 700; font-family: monospace; font-size: 14px; }
    .temp-pass { background: #e0e7ff; color: #1e40af; padding: 3px 8px; border-radius: 6px; font-size: 15px; letter-spacing: 0.05em; }
    .btn-wrap { text-align: center; margin: 30px 0; }
    .cta-btn { display: inline-block; background: #0052FF; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(0,82,255,0.25); }
    .notice { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 6px; font-size: 12px; color: #92400e; line-height: 1.5; margin-bottom: 24px; }
    .footer { padding: 20px 32px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Team Onboarding</div>
      <h1 class="title">You're Invited to AvadaPay CMS</h1>
    </div>
    <div class="body">
      <div class="greeting">Hello ${escapeHtml(data.name)},</div>
      <p class="lead">
        You have been granted administrative access to the AvadaPay CMS platform. Below are your account credentials and market assignments.
      </p>

      <div class="creds-box">
        <div class="creds-row" style="margin-bottom: 10px;">
          <span class="creds-label">Assigned Role:</span>
          <span class="creds-value" style="font-family: inherit; color: #0052FF;">${escapeHtml(roleLabel)}</span>
        </div>
        <div class="creds-row" style="margin-bottom: 10px;">
          <span class="creds-label">Market Hubs:</span>
          <span class="creds-value" style="font-family: inherit;">${escapeHtml(hubsLabel)}</span>
        </div>
        <div class="creds-row" style="margin-bottom: 10px;">
          <span class="creds-label">Corporate Email:</span>
          <span class="creds-value">${escapeHtml(data.email)}</span>
        </div>
        <div class="creds-row">
          <span class="creds-label">Temporary Password:</span>
          <span class="creds-value temp-pass">${escapeHtml(data.temporaryPassword)}</span>
        </div>
      </div>

      <div class="notice">
        <strong>Mandatory First-Time Password Setup:</strong><br>
        When you sign in with this temporary password, the system will prompt you immediately to set a secure permanent password of your choice.
      </div>

      <div class="btn-wrap">
        <a href="${loginUrl}" class="cta-btn">Sign In & Set Up Your Password</a>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;">
        Or copy and paste this link in your browser: <br>
        <a href="${loginUrl}" style="color: #0052FF; word-break: break-all;">${loginUrl}</a>
      </p>
    </div>
    <div class="footer">
      This is an automated administrative invitation from AvadaPay. If you were not expecting this message, please notify your team administrator.
    </div>
  </div>
</body>
</html>
`.trim();

    const fromAddress = process.env.SMTP_FROM || `"AvadaPay Platform" <${process.env.SMTP_USER || 'no-reply@avadapay.com'}>`;
    const transporter = this.getTransporter();

    if (!transporter) {
      console.log(`[EmailService] (Local/Mock) Invitation email would be sent to [${data.email}] with temp pass "${data.temporaryPassword}"`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: data.email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EmailService] Successfully sent team invitation email to [${data.email}]`);
      return true;
    } catch (err) {
      console.error('[EmailService] Failed to send team invitation via SMTP:', err);
      return false;
    }
  }

  /**
   * Sends a branded password reset email with a secure one-time link.
   */
  public static async sendPasswordReset(data: PasswordResetData): Promise<boolean> {
    const subject = `Reset Your AvadaPay CMS Password`;
    const expireMinutes = data.expiresInMinutes || 60;

    const textContent = `
PASSWORD RESET REQUEST
======================================================
Hello ${data.name},

We received a request to reset your password for the AvadaPay CMS administration portal.

Please click the link below to set a new password:
${data.resetUrl}

This link is valid for ${expireMinutes} minutes. If you did not request this password reset, please ignore this email; your account remains secure.
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: #0f172a; padding: 28px 32px; color: #ffffff; text-align: left; }
    .badge { display: inline-block; background: rgba(59,186,147,0.2); color: #3BBA93; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 9999px; margin-bottom: 10px; border: 1px solid rgba(59,186,147,0.4); }
    .title { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .lead { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
    .btn-wrap { text-align: center; margin: 28px 0; }
    .cta-btn { display: inline-block; background: #3BBA93; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(59,186,147,0.3); }
    .notice { background: #f8fafc; border-left: 4px solid #94a3b8; padding: 14px; border-radius: 6px; font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
    .footer { padding: 20px 32px; background: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Security Notification</div>
      <h1 class="title">Password Reset Request</h1>
    </div>
    <div class="body">
      <div class="greeting">Hello ${escapeHtml(data.name)},</div>
      <p class="lead">
        We received a request to reset the password associated with your corporate account (<strong>${escapeHtml(data.email)}</strong>).
      </p>

      <div class="btn-wrap">
        <a href="${data.resetUrl}" class="cta-btn">Reset My Password</a>
      </div>

      <div class="notice">
        <strong>Important Security Notice:</strong><br>
        This link is only valid for <strong>${expireMinutes} minutes</strong>. If you did not initiate this request, you can safely disregard this email; your account and credentials remain protected.
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 16px;">
        If the button does not work, copy and paste this link in your browser: <br>
        <a href="${data.resetUrl}" style="color: #3BBA93; word-break: break-all;">${data.resetUrl}</a>
      </p>
    </div>
    <div class="footer">
      Sent securely by AvadaPay CMS Platform.
    </div>
  </div>
</body>
</html>
`.trim();

    const fromAddress = process.env.SMTP_FROM || `"AvadaPay Security" <${process.env.SMTP_USER || 'no-reply@avadapay.com'}>`;
    const transporter = this.getTransporter();

    if (!transporter) {
      console.log(`[EmailService] (Local/Mock) Password reset email would be sent to [${data.email}] with URL: "${data.resetUrl}"`);
      return true;
    }

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: data.email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EmailService] Successfully sent password reset email to [${data.email}]`);
      return true;
    } catch (err) {
      console.error('[EmailService] Failed to send password reset via SMTP:', err);
      return false;
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
