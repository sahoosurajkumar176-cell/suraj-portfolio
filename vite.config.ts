import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { sendEnquiryEmails } from './server/emailService';

function resendApiPlugin(): Plugin {
  return {
    name: 'resend-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/send-enquiry', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const result = await sendEnquiryEmails(data);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, ...result }));
          } catch (err: any) {
            console.error('API Error in /api/send-enquiry:', err);
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: err.message || 'Internal server error',
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), resendApiPlugin()],
});

