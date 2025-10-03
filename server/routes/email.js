const express = require('express');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// @route   POST /api/email/test
// @desc    Send a test email to verify email configuration
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const result = await emailService.sendTestEmail(email);

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        data: {
          messageId: result.messageId,
          recipient: email
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

// @route   POST /api/email/bulk
// @desc    Send bulk emails (for testing purposes)
// @access  Private
router.post('/bulk', auth, async (req, res) => {
  try {
    const { recipients, subject, message } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients array is required'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    const results = [];
    const batchSize = 5; // Send in smaller batches for testing

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(async (email) => {
        try {
          const mailOptions = {
            from: {
              name: 'EventEye Test',
              address: process.env.EMAIL_USER || 'noreply@eventeye.com'
            },
            to: email,
            subject: subject,
            html: `
              <h2>${subject}</h2>
              <p>${message}</p>
              <p>This is a test email from EventEye Certificate System.</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            `
          };

          const result = await emailService.transporter.sendMail(mailOptions);
          return {
            email,
            success: true,
            messageId: result.messageId
          };
        } catch (error) {
          return {
            email,
            success: false,
            error: error.message
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Bulk email completed. ${successCount} sent, ${failureCount} failed.`,
      data: {
        total: recipients.length,
        sent: successCount,
        failed: failureCount,
        results
      }
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk emails',
      error: error.message
    });
  }
});

// @route   GET /api/email/status
// @desc    Get email service status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    // Check if email service is configured
    const isConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    let status = 'not_configured';
    let message = 'Email service is not configured';

    if (isConfigured) {
      try {
        // Try to verify the connection
        await emailService.transporter.verify();
        status = 'active';
        message = 'Email service is active and ready';
      } catch (error) {
        status = 'error';
        message = 'Email service configuration error: ' + error.message;
      }
    }

    res.json({
      success: true,
      data: {
        status,
        message,
        configured: isConfigured,
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER ? 'configured' : 'not_configured'
      }
    });
  } catch (error) {
    console.error('Email status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email service status',
      error: error.message
    });
  }
});

module.exports = router;
