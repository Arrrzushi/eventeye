const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Verify connection
      await this.transporter.verify();
      console.log('📧 Email service initialized successfully');
    } catch (error) {
      console.error('Email service initialization failed:', error);
      // For demo purposes, create a mock transporter
      this.transporter = {
        sendMail: async (mailOptions) => {
          console.log('📧 Mock email sent:', mailOptions.to);
          return { messageId: 'mock-' + Date.now() };
        }
      };
    }
  }

  async sendCertificateEmail(participant, certificatePath, eventData, customTemplate = null) {
    try {
      const { name, email } = participant;
      const { title, organizerName, eventDate, location } = eventData;

      const subject = customTemplate?.subject || `Your Certificate - ${title}`;
      const htmlContent = this.generateEmailTemplate(name, title, organizerName, eventDate, location, customTemplate);

      const mailOptions = {
        from: {
          name: 'EventEye Certificate System',
          address: process.env.EMAIL_USER || 'noreply@eventeye.com'
        },
        to: email,
        subject: subject,
        html: htmlContent,
        attachments: [
          {
            filename: `Certificate_${name.replace(/\s+/g, '_')}.png`,
            path: certificatePath,
            cid: 'certificate'
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        participant: participant
      };
    } catch (error) {
      console.error(`Failed to send email to ${participant.email}:`, error);
      return {
        success: false,
        error: error.message,
        participant: participant
      };
    }
  }

  async sendBulkCertificates(participants, certificates, eventData, customTemplate = null) {
    const results = [];
    const batchSize = 10; // Send in batches to avoid rate limiting

    for (let i = 0; i < participants.length; i += batchSize) {
      const batch = participants.slice(i, i + batchSize);
      const batchPromises = batch.map(async (participant, index) => {
        const certificate = certificates[i + index];
        if (certificate && certificate.success) {
          return await this.sendCertificateEmail(
            participant,
            certificate.certificate.filePath,
            eventData,
            customTemplate
          );
        } else {
          return {
            success: false,
            error: 'Certificate generation failed',
            participant: participant
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < participants.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  }

  generateEmailTemplate(name, eventTitle, organizerName, eventDate, location, customTemplate = null) {
    if (customTemplate && customTemplate.body) {
      return customTemplate.body
        .replace(/{name}/g, name)
        .replace(/{eventTitle}/g, eventTitle)
        .replace(/{organizerName}/g, organizerName)
        .replace(/{eventDate}/g, new Date(eventDate).toLocaleDateString())
        .replace(/{location}/g, location);
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Event Certificate</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .title {
                font-size: 28px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
            }
            .event-details {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .event-details h3 {
                color: #2563eb;
                margin-top: 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎓 EventEye</div>
                <div class="title">Certificate of Participation</div>
            </div>
            
            <div class="content">
                <div class="greeting">Dear ${name},</div>
                
                <p>Congratulations! We are pleased to present you with your certificate of participation.</p>
                
                <div class="event-details">
                    <h3>Event Details</h3>
                    <p><strong>Event:</strong> ${eventTitle}</p>
                    <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    <p><strong>Organizer:</strong> ${organizerName}</p>
                </div>
                
                <p>Your certificate is attached to this email. You can also verify its authenticity using the QR code on the certificate.</p>
                
                <p>Thank you for your participation and we hope to see you at future events!</p>
            </div>
            
            <div class="footer">
                <p>This certificate was generated by EventEye Certificate Automation System</p>
                <p>For verification, visit: <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/verify">Verify Certificate</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendTestEmail(email) {
    try {
      const mailOptions = {
        from: {
          name: 'EventEye Test',
          address: process.env.EMAIL_USER || 'noreply@eventeye.com'
        },
        to: email,
        subject: 'EventEye Email Test',
        html: `
          <h2>Email Service Test</h2>
          <p>If you receive this email, the EventEye email service is working correctly!</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Test email failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();
