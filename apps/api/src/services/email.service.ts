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
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
