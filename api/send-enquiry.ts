import { sendEnquiryEmails, type SendEnquiryPayload } from '../server/emailService';

export default async function handler(req: any, res: any) {
  // Set CORS headers for safe cross-origin API calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    let payload: SendEnquiryPayload;
    if (typeof req.body === 'string') {
      payload = JSON.parse(req.body);
    } else if (req.body && typeof req.body === 'object') {
      payload = req.body;
    } else {
      throw new Error('Empty or invalid enquiry payload.');
    }

    const result = await sendEnquiryEmails(payload);
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    console.error('Serverless Error in /api/send-enquiry:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
