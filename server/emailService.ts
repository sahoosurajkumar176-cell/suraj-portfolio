import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

export interface SendEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  websiteOrInstagram?: string;
  services: string[];
  projectDetails: string;
  budget: string;
  wantsMeeting: boolean;
  meetingType?: string;
  meetingDate?: string;
  meetingTime?: string;
  estimatedRange?: {
    min: number;
    max: number;
  };
}

export function generateAdminEmailHtml(data: SendEnquiryPayload): string {
  const servicesList = data.services && data.services.length > 0
    ? data.services.map((s) => `<li style="margin-bottom: 6px; color: #ffffff;">${s}</li>`).join('')
    : '<li style="color: #888888;">None specified</li>';

  const rangeText = data.estimatedRange
    ? `₹${data.estimatedRange.min.toLocaleString()} – ₹${data.estimatedRange.max.toLocaleString()}`
    : 'Custom quote';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Project Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #d7e2ea;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0c0c; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141419; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18011F 0%, #B600A8 50%, #7621B0 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                🚀 New Project Enquiry
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                Received from portfolio contact form
              </p>
            </td>
          </tr>

          <!-- Client Overview -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                Client Information
              </h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px;">
                <tr>
                  <td width="38%" style="color: #8f9ca6;">Full Name:</td>
                  <td style="color: #ffffff; font-weight: 600;">${data.name}</td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Email Address:</td>
                  <td><a href="mailto:${data.email}" style="color: #d175ff; text-decoration: none;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">WhatsApp / Phone:</td>
                  <td><a href="tel:${data.phone}" style="color: #4ade80; text-decoration: none;">${data.phone}</a></td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Business / Brand:</td>
                  <td style="color: #ffffff; font-weight: 500;">${data.businessName}</td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Website / Social:</td>
                  <td style="color: #ffffff;">${data.websiteOrInstagram || '<span style="color: #666666;">Not provided</span>'}</td>
                </tr>
              </table>

              <!-- Project Scope -->
              <h2 style="margin: 28px 0 16px 0; color: #ffffff; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                Project Scope & Budget
              </h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px;">
                <tr>
                  <td width="38%" style="color: #8f9ca6; vertical-align: top;">Selected Services:</td>
                  <td style="color: #ffffff;">
                    <ul style="margin: 0; padding-left: 18px;">
                      ${servicesList}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Selected Budget:</td>
                  <td style="color: #ffffff; font-weight: 600;">${data.budget}</td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Estimated Range:</td>
                  <td style="color: #fbbf24; font-weight: 700;">${rangeText}</td>
                </tr>
              </table>

              <!-- Requirements -->
              <h2 style="margin: 28px 0 12px 0; color: #ffffff; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                Project Requirements & Ideas
              </h2>
              <div style="background-color: #0c0c0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                ${data.projectDetails}
              </div>

              <!-- Meeting Details -->
              <h2 style="margin: 28px 0 16px 0; color: #ffffff; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                Meeting & Discussion Call
              </h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px;">
                <tr>
                  <td width="38%" style="color: #8f9ca6;">Requested Call:</td>
                  <td style="color: #ffffff; font-weight: 600;">${data.wantsMeeting ? 'YES' : 'NO'}</td>
                </tr>
                ${data.wantsMeeting ? `
                <tr>
                  <td style="color: #8f9ca6;">Preferred Platform:</td>
                  <td style="color: #60a5fa; font-weight: 600;">${data.meetingType || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Preferred Date:</td>
                  <td style="color: #ffffff;">${data.meetingDate || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="color: #8f9ca6;">Preferred Time:</td>
                  <td style="color: #ffffff; font-weight: 600;">${data.meetingTime || 'N/A'}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Quick Action -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://wa.me/${data.phone.replace(/\\D/g, '')}" style="display: inline-block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 10px;">
                  💬 Reply on WhatsApp
                </a>
                <a href="mailto:${data.email}" style="display: inline-block; background-color: #7621B0; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  ✉️ Reply via Email
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0d; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: #64748b; font-size: 12px;">
              Suraj Portfolio • Automated Project Enquiry Delivery
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateClientEmailText(data: SendEnquiryPayload): string {
  const meetingInfo = data.wantsMeeting && data.meetingDate
    ? `${data.meetingDate} at ${data.meetingTime || 'N/A'} (${data.meetingType || 'Call'})`
    : 'Not requested';

  const servicesText = data.services && data.services.length > 0
    ? data.services.join(', ')
    : 'General Enquiry';

  return `Hi ${data.name},

Thank you for reaching out to Suraj.

I've received your project enquiry and will review the details shortly.

Project:
${data.projectDetails}

Selected Services:
${servicesText}

Estimated Budget:
${data.budget}

Preferred Meeting:
${meetingInfo}

I'll get back to you soon.

— Suraj`.trim();
}

export function generateClientEmailHtml(data: SendEnquiryPayload): string {
  const meetingInfo = data.wantsMeeting && data.meetingDate
    ? `${data.meetingDate} at ${data.meetingTime || 'N/A'} (${data.meetingType || 'Call'})`
    : 'Not requested';

  const servicesText = data.services && data.services.length > 0
    ? data.services.join(', ')
    : 'General Enquiry';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Enquiry Received — Suraj</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0c0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #d7e2ea;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0c0c0c; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #141419; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #18011F 0%, #B600A8 50%, #7621B0 100%); padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                Enquiry Received
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">
                Suraj • 3D Creator & Developer
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px; font-size: 15px; line-height: 1.6; color: #d7e2ea;">
              <p style="margin: 0 0 16px 0;">Hi <strong>${data.name}</strong>,</p>
              <p style="margin: 0 0 16px 0;">Thank you for reaching out to Suraj.</p>
              <p style="margin: 0 0 24px 0;">I've received your project enquiry and will review the details shortly.</p>

              <!-- Details Box -->
              <div style="background-color: #0c0c0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 4px 0; color: #8f9ca6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Project:</p>
                <p style="margin: 0 0 16px 0; color: #ffffff; white-space: pre-wrap;">${data.projectDetails}</p>

                <p style="margin: 0 0 4px 0; color: #8f9ca6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Selected Services:</p>
                <p style="margin: 0 0 16px 0; color: #ffffff; font-weight: 500;">${servicesText}</p>

                <p style="margin: 0 0 4px 0; color: #8f9ca6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Estimated Budget:</p>
                <p style="margin: 0 0 16px 0; color: #ffffff; font-weight: 600;">${data.budget}</p>

                <p style="margin: 0 0 4px 0; color: #8f9ca6; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Preferred Meeting:</p>
                <p style="margin: 0; color: #60a5fa; font-weight: 500;">${meetingInfo}</p>
              </div>

              <p style="margin: 20px 0 12px 0;">I'll get back to you soon.</p>
              <p style="margin: 0; color: #ffffff; font-weight: 600;">— Suraj</p>

              <!-- Direct WhatsApp Connect -->
              <div style="margin-top: 28px; padding: 16px; background: rgba(182, 0, 168, 0.08); border: 1px solid rgba(182, 0, 168, 0.25); border-radius: 12px; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #d7e2ea;">Need immediate assistance or want to send additional files?</p>
                <a href="https://wa.me/918260970300?text=Hi%20Suraj%2C%20I%20just%20submitted%20a%20project%20enquiry%20for%20${encodeURIComponent(data.businessName)}" style="display: inline-block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                  💬 Chat on WhatsApp (+91 8260970300)
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0d; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); color: #8f9ca6; font-size: 12px; line-height: 1.6;">
              <strong style="color: #ffffff;">Suraj</strong> • 3D Creator & Full-Stack Developer<br>
              <a href="mailto:sahoosurajkumar176@gmail.com" style="color: #d175ff; text-decoration: none;">sahoosurajkumar176@gmail.com</a> • +91 8260970300
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendEnquiryEmails(data: SendEnquiryPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_RESEND_API_KEY_HERE') {
    throw new Error(
      'RESEND_API_KEY is not set. Please add your real Resend API Key to the .env file (RESEND_API_KEY=re_...).'
    );
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Suraj Portfolio <onboarding@resend.dev>';
  const toAdminEmail = process.env.ADMIN_EMAIL || 'sahoosurajkumar176@gmail.com';
  const clientRecipient = data.email ? data.email.trim() : '';

  if (!clientRecipient) {
    throw new Error('Client email address is missing from form submission.');
  }

  console.log(`[Email Dispatch] Admin Notification -> ${toAdminEmail}`);
  console.log(`[Email Dispatch] Client Confirmation -> ${clientRecipient}`);

  const adminHtml = generateAdminEmailHtml(data);
  const clientText = generateClientEmailText(data);
  const clientHtml = generateClientEmailHtml(data);

  // 1. Send complete enquiry to Admin
  const adminResponse = await resend.emails.send({
    from: fromEmail,
    to: toAdminEmail,
    replyTo: clientRecipient,
    subject: `🚀 New Project Enquiry from ${data.name} (${data.businessName})`,
    html: adminHtml,
  });

  if (adminResponse.error) {
    console.error('Resend Admin Email Error:', adminResponse.error);
    throw new Error(`Failed to deliver enquiry: ${adminResponse.error.message}`);
  }

  // 2. Send confirmation email to Client
  let clientEmailId: string | null = null;
  let clientEmailError: string | null = null;

  try {
    const clientResponse = await resend.emails.send({
      from: fromEmail,
      to: clientRecipient,
      replyTo: toAdminEmail,
      subject: 'Enquiry Received — Suraj',
      text: clientText,
      html: clientHtml,
    });

    if (clientResponse.error) {
      clientEmailError = clientResponse.error.message;
      console.warn(`⚠️ Resend Client Confirmation Notice for ${clientRecipient}:`, clientResponse.error.message);
    } else {
      clientEmailId = clientResponse.data?.id || null;
      console.log(`✅ Client Confirmation Email Sent to ${clientRecipient}! ID:`, clientEmailId);
    }
  } catch (clientErr: any) {
    clientEmailError = clientErr.message || 'Failed to dispatch client confirmation';
    console.warn(`⚠️ Error sending client confirmation to ${clientRecipient}:`, clientEmailError);
  }

  return {
    success: true,
    adminEmail: {
      recipient: toAdminEmail,
      id: adminResponse.data?.id,
    },
    clientEmail: {
      recipient: clientRecipient,
      id: clientEmailId,
      error: clientEmailError,
    },
  };
}
