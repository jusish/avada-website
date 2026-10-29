import nodemailer, { Transporter } from 'nodemailer';
import { prisma } from '../prisma';

export interface InquiryEmailData {
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

export interface CountryRecipientInfo {
  name: string;
  code: string;
  officeEmail?: string | null;
  managerEmail?: string | null;
  managerName?: string | null;
  managerId?: string | null;
  notificationSettings?: {
    notifyOfficeEmail?: boolean;
    notifyManagerEmail?: boolean;
    extraRecipients?: string[];
  } | null;
}

export interface GlobalAdminNotificationConfig {
  globalAdminNotificationMode?: 'ALL' | 'UNASSIGNED_ONLY' | 'OFF';
  globalAdminRecipients?: string[];
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

export interface TwoFactorOtpData {
  email: string;
  name: string;
  otpCode: string;
  expiresInMinutes?: number;
}

export interface SmtpConfigPayload {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  enabled?: boolean;
}

const APP_URL = process.env.APP_URL || 'https://avadapay.com';
const LOGO_URL = `${APP_URL}/logo-horizontal.png`;

export class EmailService {
  /**
   * Dynamically resolves the active SMTP transport.
   * Priority:
   * 1. Dynamic database Integration record (key: 'smtp') configured via CMS.
   * 2. Environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS, etc.).
   */
  public static async getTransporter(): Promise<{ transporter: Transporter | null; fromAddress: string }> {
    try {
      const dbIntegration = await prisma.integration.findUnique({
        where: { key: 'smtp' },
      });

      if (dbIntegration && dbIntegration.enabled) {
        const cfg = (dbIntegration.config as Record<string, any>) || {};
        const host = cfg.host ? String(cfg.host).trim() : '';
        const user = cfg.user ? String(cfg.user).trim() : '';
        const pass = cfg.pass ? String(cfg.pass).trim() : '';
        const port = parseInt(String(cfg.port || '587'), 10);
        const secure = cfg.secure === true || port === 465;

        if (host) {
          const fromName = cfg.fromName ? String(cfg.fromName).trim() : 'AvadaPay Platform';
          const fromEmail = cfg.fromEmail ? String(cfg.fromEmail).trim() : user || 'no-reply@avadapay.com';
          const fromAddress = `"${fromName}" <${fromEmail}>`;

          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: user && pass ? { user, pass } : undefined,
            tls: {
              rejectUnauthorized: process.env.NODE_ENV === 'production',
            },
          });

          return { transporter, fromAddress };
        }
      }
    } catch (err) {
      console.warn('[EmailService] Could not check DB for SMTP config, falling back to env:', err);
    }

    // Fallback: Environment variables
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    if (!host) {
      return { transporter: null, fromAddress: '"AvadaPay Platform" <no-reply@avadapay.com>' };
    }

    const fromAddress = process.env.SMTP_FROM || `"AvadaPay Platform" <${user || 'no-reply@avadapay.com'}>`;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });

    return { transporter, fromAddress };
  }

  /**
   * Verifies SMTP credentials and optionally dispatches a live test email.
   */
  public static async testConnection(
    config: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
      fromEmail?: string;
      fromName?: string;
    },
    testRecipient?: string
  ): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const startTime = Date.now();
    try {
      const transporter = nodemailer.createTransport({
        host: config.host.trim(),
        port: Number(config.port),
        secure: Boolean(config.secure),
        auth: config.user && config.pass ? { user: config.user.trim(), pass: config.pass.trim() } : undefined,
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });

      await transporter.verify();

      if (testRecipient && testRecipient.trim().includes('@')) {
        const fromName = config.fromName?.trim() || 'AvadaPay Platform';
        const fromEmail = config.fromEmail?.trim() || config.user.trim() || 'no-reply@avadapay.com';

        await transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: testRecipient.trim(),
          subject: '[AvadaPay CMS] SMTP Integration Test Verification',
          text: `This is a verification test email from AvadaPay CMS.\n\nYour SMTP integration was verified successfully.\nHost: ${config.host}\nPort: ${config.port}\nTimestamp: ${new Date().toISOString()}`,
          html: `<div style="font-family:sans-serif;padding:20px;color:#2A292D;">
            <h2 style="color:#3BBA93;">SMTP Integration Verified</h2>
            <p>Your AvadaPay CMS transactional email integration is operational.</p>
            <p><strong>Host:</strong> ${escapeHtml(config.host)}<br>
            <strong>Port:</strong> ${config.port}<br>
            <strong>User:</strong> ${escapeHtml(config.user)}<br>
            <strong>Timestamp:</strong> ${new Date().toUTCString()}</p>
          </div>`,
        });
      }

      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: testRecipient
          ? `Connected successfully! Test email delivered to ${testRecipient}.`
          : 'SMTP handshake and authentication verified successfully.',
        latencyMs,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        message: err?.message || 'Failed to authenticate with SMTP server.',
        latencyMs,
      };
    }
  }

  /**
   * Resolves recipients based on multi-tiered preferences:
   * 1. Country-level preferences (officeEmail toggle, managerEmail toggle, extra recipients).
   * 2. Global Admin preferences ('ALL', 'UNASSIGNED_ONLY', 'OFF').
   * Dispatches the branded notification.
   */
  public static async sendInquiryNotification(
    inquiry: InquiryEmailData,
    countryInfo?: CountryRecipientInfo | null,
    globalAdminSettings?: GlobalAdminNotificationConfig | null
  ): Promise<{ primaryRoutedEmail: string | null; allRecipients: string[] }> {
    const recipients: string[] = [];

    const notifyOffice = countryInfo?.notificationSettings?.notifyOfficeEmail !== false;
    const notifyManager = countryInfo?.notificationSettings?.notifyManagerEmail !== false;
    const extraRecipients = countryInfo?.notificationSettings?.extraRecipients || [];

    // 1. Country Office Email
    if (notifyOffice && countryInfo?.officeEmail?.trim()) {
      const off = countryInfo.officeEmail.trim().toLowerCase();
      if (!recipients.includes(off)) {
        recipients.push(off);
      }
    }

    // 2. Country Manager / CEO Email
    if (notifyManager && countryInfo?.managerEmail?.trim()) {
      const mgr = countryInfo.managerEmail.trim().toLowerCase();
      if (!recipients.includes(mgr)) {
        recipients.push(mgr);
      }
    }

    // 3. Extra country recipients
    if (Array.isArray(extraRecipients)) {
      for (const extra of extraRecipients) {
        if (typeof extra === 'string' && extra.includes('@')) {
          const norm = extra.trim().toLowerCase();
          if (!recipients.includes(norm)) {
            recipients.push(norm);
          }
        }
      }
    }

    // 4. Global Admin Routing
    const globalMode = globalAdminSettings?.globalAdminNotificationMode || 'ALL';
    const globalRecipients = (globalAdminSettings?.globalAdminRecipients && globalAdminSettings.globalAdminRecipients.length > 0)
      ? globalAdminSettings.globalAdminRecipients
      : ['winnie.odede@avadapay.com'];

    const hasAssignedManager = Boolean(countryInfo?.managerEmail?.trim() || countryInfo?.managerId);

    if (globalMode === 'ALL') {
      for (const gAdmin of globalRecipients) {
        const norm = gAdmin.trim().toLowerCase();
        if (norm && norm.includes('@') && !recipients.includes(norm)) {
          recipients.push(norm);
        }
      }
    } else if (globalMode === 'UNASSIGNED_ONLY') {
      if (!hasAssignedManager) {
        for (const gAdmin of globalRecipients) {
          const norm = gAdmin.trim().toLowerCase();
          if (norm && norm.includes('@') && !recipients.includes(norm)) {
            recipients.push(norm);
          }
        }
      }
    }
    // If 'OFF', global admin does not receive inquiry emails

    // 5. Fallback safety
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937; -webkit-font-smoothing: antialiased; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: #2A292D; padding: 22px 24px; text-align: left; }
    .header-logo { display: inline-block; margin-bottom: 6px; }
    .header-logo img { display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; }
    .badge { display: inline-block; background: rgba(59,186,147,0.15); border: 1px solid rgba(59,186,147,0.3); color: #3BBA93; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 9999px; margin-top: 10px; }
    .title { margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 1.3; }
    .body { padding: 24px; }
    .meta-grid { margin-bottom: 20px; }
    .meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .meta-label { color: #6b7280; font-weight: 600; font-size: 12px; }
    .meta-value { color: #111827; font-weight: 600; text-align: right; word-break: break-all; }
    .message-box { background: #f9fafb; border-left: 3px solid #3BBA93; border-radius: 6px; padding: 14px; margin: 18px 0; }
    .message-text { margin: 0; font-size: 13px; line-height: 1.6; color: #374151; white-space: pre-wrap; }
    .btn-wrap { text-align: center; margin: 24px 0 10px 0; }
    .cta-btn { display: inline-block; background: #3BBA93; color: #ffffff !important; text-decoration: none; padding: 11px 22px; border-radius: 8px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 6px rgba(59,186,147,0.25); }
    .footer { padding: 16px 24px; background: #f9fafb; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <a href="${APP_URL}" target="_blank" class="header-logo" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_URL}" alt="AvadaPay" width="145" height="26" style="display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; text-decoration: none;" />
      </a>
      <div><span class="badge">${escapeHtml(countryLabel)} Hub</span></div>
      <h1 class="title">New Contact Inquiry</h1>
    </div>
    <div class="body">
      <div class="meta-grid">
        <div class="meta-row">
          <span class="meta-label">Full Name:</span>
          <span class="meta-value">${escapeHtml(inquiry.fullName)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Email:</span>
          <span class="meta-value"><a href="mailto:${escapeHtml(inquiry.email)}" style="color: #3BBA93; text-decoration: none;">${escapeHtml(inquiry.email)}</a></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Phone:</span>
          <span class="meta-value">${escapeHtml(inquiry.phone || 'N/A')}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Organization:</span>
          <span class="meta-value">${escapeHtml(inquiry.orgName || 'N/A')}${inquiry.roleTitle ? ` (${escapeHtml(inquiry.roleTitle)})` : ''}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Inquiry Type:</span>
          <span class="meta-value" style="color: #3BBA93; text-transform: uppercase;">${escapeHtml(inquiry.inquiryType)}</span>
        </div>
        <div class="meta-row" style="border-bottom: none;">
          <span class="meta-label">Routed To:</span>
          <span class="meta-value" style="font-size: 11px; color: #6b7280;">${escapeHtml(recipients.join(', '))}</span>
        </div>
      </div>

      <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
        Inquiry Message
      </div>
      <div class="message-box">
        <p class="message-text">${escapeHtml(inquiry.message)}</p>
      </div>

      <div class="btn-wrap">
        <a href="https://avadapay.com/admin/inquiries" class="cta-btn">View in AvadaPay Admin</a>
      </div>
    </div>
    <div class="footer">
      Automated routing for ${escapeHtml(countryLabel)} regional operations.
    </div>
  </div>
</body>
</html>
`.trim();

    const { transporter, fromAddress } = await this.getTransporter();

    if (!transporter) {
      console.log(`[EmailService] (Local/Mock) Notification would be sent to [${recipients.join(', ')}] with subject: "${subject}"`);
      return { primaryRoutedEmail, allRecipients: recipients };
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

    return { primaryRoutedEmail, allRecipients: recipients };
  }

  /**
   * Sends a compact branded team member invitation.
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

You have been invited to join the AvadaPay CMS & Regional Operations Platform.

Account Credentials:
- Role: ${roleLabel}
- Assigned Markets: ${hubsLabel}
- Corporate Email: ${data.email}
- Temporary Password: ${data.temporaryPassword}

Please sign in using your temporary password at:
${loginUrl}

Security Notice:
When you sign in with this temporary password, you will be prompted to set your secure permanent password immediately.
Do not share your temporary password with anyone.
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937; -webkit-font-smoothing: antialiased; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: #2A292D; padding: 22px 24px; text-align: left; }
    .header-logo { display: inline-block; margin-bottom: 6px; }
    .header-logo img { display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; }
    .badge { display: inline-block; background: rgba(59,186,147,0.15); border: 1px solid rgba(59,186,147,0.3); color: #3BBA93; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 9999px; margin-top: 10px; }
    .title { margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 1.3; }
    .body { padding: 24px; }
    .greeting { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .lead { font-size: 13px; line-height: 1.5; color: #4b5563; margin-bottom: 18px; }
    .creds-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 16px; margin-bottom: 18px; }
    .creds-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
    .creds-row:last-child { border-bottom: none; padding-bottom: 0; }
    .creds-label { color: #6b7280; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    .creds-value { color: #111827; font-weight: 600; font-size: 12px; }
    .temp-pass { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 3px 8px; border-radius: 6px; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; }
    .notice { background: #fdfdfd; border-left: 3px solid #3BBA93; padding: 10px 12px; border-radius: 4px; font-size: 11px; color: #4b5563; line-height: 1.4; margin-bottom: 20px; }
    .btn-wrap { text-align: center; margin: 20px 0 10px 0; }
    .cta-btn { display: inline-block; background: #3BBA93; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 6px rgba(59,186,147,0.25); }
    .url-hint { font-size: 11px; color: #9ca3af; text-align: center; margin-top: 14px; word-break: break-all; }
    .footer { padding: 16px 24px; background: #f9fafb; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <a href="${APP_URL}" target="_blank" class="header-logo" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_URL}" alt="AvadaPay" width="145" height="26" style="display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; text-decoration: none;" />
      </a>
      <div><span class="badge">Team Onboarding</span></div>
      <h1 class="title">You're Invited to AvadaPay CMS</h1>
    </div>
    <div class="body">
      <div class="greeting">Hello ${escapeHtml(data.name)},</div>
      <p class="lead">
        You have been granted administrative access to AvadaPay CMS. Here are your account credentials and market assignments:
      </p>

      <div class="creds-box">
        <div class="creds-row">
          <span class="creds-label">Role</span>
          <span class="creds-value" style="color: #3BBA93; font-weight: 700;">${escapeHtml(roleLabel)}</span>
        </div>
        <div class="creds-row">
          <span class="creds-label">Markets</span>
          <span class="creds-value">${escapeHtml(hubsLabel)}</span>
        </div>
        <div class="creds-row">
          <span class="creds-label">Email</span>
          <span class="creds-value">${escapeHtml(data.email)}</span>
        </div>
        <div class="creds-row">
          <span class="creds-label">Temp Password</span>
          <span class="creds-value temp-pass">${escapeHtml(data.temporaryPassword)}</span>
        </div>
      </div>

      <div class="notice">
        <strong>Mandatory First Login Setup:</strong><br>
        Sign in using this temporary password. The system will prompt you immediately to set your personal permanent password.
      </div>

      <div class="btn-wrap">
        <a href="${loginUrl}" class="cta-btn">Sign In to AvadaPay CMS</a>
      </div>

      <p class="url-hint">
        Direct link: <a href="${loginUrl}" style="color: #3BBA93;">${loginUrl}</a>
      </p>
    </div>
    <div class="footer">
      Automated invitation sent by AvadaPay CMS Platform.
    </div>
  </div>
</body>
</html>
`.trim();

    const { transporter, fromAddress } = await this.getTransporter();

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
   * Sends a compact branded password reset email.
   */
  public static async sendPasswordReset(data: PasswordResetData): Promise<boolean> {
    const subject = `Reset Your AvadaPay CMS Password`;
    const expireMinutes = data.expiresInMinutes || 60;

    const textContent = `
PASSWORD RESET REQUEST
======================================================
Hello ${data.name},

We received a request to reset your password for AvadaPay CMS.

Click the link below to set a new password:
${data.resetUrl}

This link is valid for ${expireMinutes} minutes. If you did not request this, you can safely ignore this email.
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937; -webkit-font-smoothing: antialiased; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: #2A292D; padding: 22px 24px; text-align: left; }
    .header-logo { display: inline-block; margin-bottom: 6px; }
    .header-logo img { display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; text-decoration: none; }
    .badge { display: inline-block; background: rgba(59,186,147,0.15); border: 1px solid rgba(59,186,147,0.3); color: #3BBA93; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 9999px; margin-top: 10px; }
    .title { margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 1.3; }
    .body { padding: 24px; }
    .greeting { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .lead { font-size: 13px; line-height: 1.5; color: #4b5563; margin-bottom: 18px; }
    .btn-wrap { text-align: center; margin: 22px 0 12px 0; }
    .cta-btn { display: inline-block; background: #3BBA93; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 6px rgba(59,186,147,0.25); }
    .notice { background: #fdfdfd; border-left: 3px solid #3BBA93; padding: 10px 12px; border-radius: 4px; font-size: 11px; color: #4b5563; line-height: 1.4; margin-bottom: 16px; }
    .url-hint { font-size: 11px; color: #9ca3af; text-align: center; margin-top: 14px; word-break: break-all; }
    .footer { padding: 16px 24px; background: #f9fafb; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <a href="${APP_URL}" target="_blank" class="header-logo" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_URL}" alt="AvadaPay" width="145" height="26" style="display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; text-decoration: none;" />
      </a>
      <div><span class="badge">Security Notification</span></div>
      <h1 class="title">Password Reset Request</h1>
    </div>
    <div class="body">
      <div class="greeting">Hello ${escapeHtml(data.name)},</div>
      <p class="lead">
        We received a request to reset your password for your AvadaPay CMS account (<strong>${escapeHtml(data.email)}</strong>).
      </p>

      <div class="btn-wrap">
        <a href="${data.resetUrl}" class="cta-btn">Reset My Password</a>
      </div>

      <div class="notice">
        <strong>Security Notice:</strong><br>
        This link expires in <strong>${expireMinutes} minutes</strong>. If you did not initiate this request, you can safely ignore this email; your credentials remain secure.
      </div>

      <p class="url-hint">
        Direct link: <a href="${data.resetUrl}" style="color: #3BBA93;">${data.resetUrl}</a>
      </p>
    </div>
    <div class="footer">
      Sent securely by AvadaPay CMS Platform.
    </div>
  </div>
</body>
</html>
`.trim();

    const { transporter, fromAddress } = await this.getTransporter();

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

  /**
   * Sends a two-factor authentication (2FA) verification code email.
   */
  public static async sendTwoFactorOtp(data: TwoFactorOtpData): Promise<boolean> {
    const subject = `[AvadaPay] Your Verification Code: ${data.otpCode}`;
    const expireMinutes = data.expiresInMinutes || 10;

    const textContent = `
AVADAPAY CMS VERIFICATION CODE
======================================================
Hello ${data.name},

Your two-factor authentication code is:
${data.otpCode}

This code is valid for ${expireMinutes} minutes.
Do not share this code with anyone. AvadaPay staff will never ask for your verification code.
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; color: #1f2937; -webkit-font-smoothing: antialiased; }
    .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .header { background: #2A292D; padding: 22px 24px; text-align: left; }
    .header-logo { display: inline-block; margin-bottom: 6px; }
    .header-logo img { display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; text-decoration: none; }
    .badge { display: inline-block; background: rgba(59,186,147,0.15); border: 1px solid rgba(59,186,147,0.3); color: #3BBA93; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 9999px; margin-top: 10px; }
    .title { margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #ffffff; line-height: 1.3; }
    .body { padding: 24px; }
    .greeting { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .lead { font-size: 13px; line-height: 1.5; color: #4b5563; margin-bottom: 20px; }
    .otp-box { background: #f9fafb; border: 2px dashed #a7f3d0; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 20px; }
    .otp-label { color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .otp-code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #3BBA93; }
    .notice { background: #fdfdfd; border-left: 3px solid #3BBA93; padding: 10px 12px; border-radius: 4px; font-size: 11px; color: #4b5563; line-height: 1.4; }
    .footer { padding: 16px 24px; background: #f9fafb; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <a href="${APP_URL}" target="_blank" class="header-logo" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_URL}" alt="AvadaPay" width="145" height="26" style="display: block; width: 145px; max-width: 145px; height: auto; border: 0; outline: none; text-decoration: none;" />
      </a>
      <div><span class="badge">Security Verification</span></div>
      <h1 class="title">Two-Factor Authentication</h1>
    </div>
    <div class="body">
      <div class="greeting">Hello ${escapeHtml(data.name)},</div>
      <p class="lead">
        A sign-in attempt was initiated for your AvadaPay CMS account. Use the verification code below to complete your sign-in:
      </p>

      <div class="otp-box">
        <div class="otp-label">Verification Code</div>
        <div class="otp-code">${escapeHtml(data.otpCode)}</div>
      </div>

      <div class="notice">
        <strong>Security Notice:</strong><br>
        This code is valid for <strong>${expireMinutes} minutes</strong>. If you did not attempt to sign in, please contact your administrator immediately.
      </div>
    </div>
    <div class="footer">
      Sent securely by AvadaPay CMS Platform.
    </div>
  </div>
</body>
</html>
`.trim();

    const { transporter, fromAddress } = await this.getTransporter();

    if (!transporter) {
      console.log(`[EmailService] (Local/Mock) 2FA OTP code would be sent to [${data.email}] with code "${data.otpCode}"`);
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
      console.log(`[EmailService] Successfully sent 2FA OTP email to [${data.email}]`);
      return true;
    } catch (err) {
      console.error('[EmailService] Failed to send 2FA OTP via SMTP:', err);
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
