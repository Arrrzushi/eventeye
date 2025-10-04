const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Certificate = require('../models/Certificate');
const certificateGenerator = require('../services/certificateGenerator');
const emailService = require('../services/emailService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @route   POST /api/certificates/generate/:eventId
// @desc    Generate certificates for all participants in an event
// @access  Private
router.post('/generate/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { template, customSettings } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate certificates for this event'
      });
    }

    if (!event.participants || event.participants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No participants found for this event'
      });
    }

    // Prepare event data for certificate generation
    const eventData = {
      title: event.title,
      eventDate: event.eventDate,
      organizerName: req.user.name,
      location: event.location,
      certificateTemplate: {
        ...event.certificateTemplate,
        layout: template || event.certificateTemplate?.layout || 'classic'
      }
    };

    // Generate certificates
    const certificateResults = await certificateGenerator.generateBulkCertificates(
      event.participants,
      eventData
    );

    // Save certificate records to database
    const savedCertificates = [];
    for (const result of certificateResults) {
      if (result.success) {
        const certificate = new Certificate({
          certificateId: result.certificate.certificateId,
          event: eventId,
          participant: {
            name: result.participant.name,
            email: result.participant.email,
            phone: result.participant.phone || ''
          },
          certificateData: {
            participantName: result.participant.name,
            eventTitle: event.title,
            eventDate: event.eventDate,
            organizerName: req.user.name,
            location: event.location,
            certificateNumber: result.certificate.certificateId
          },
          qrCode: {
            data: result.certificate.qrCodeData
          },
          filePath: result.certificate.filePath,
          verificationUrl: result.certificate.qrCodeData,
          metadata: {
            generatedBy: req.user._id,
            templateUsed: template || 'classic'
          }
        });

        await certificate.save();
        savedCertificates.push(certificate);

        // Update participant certificate status
        const participantIndex = event.participants.findIndex(
          p => p.email === result.participant.email
        );
        if (participantIndex !== -1) {
          event.participants[participantIndex].certificateStatus = 'generated';
          event.participants[participantIndex].certificateId = result.certificate.certificateId;
        }
      }
    }

    // Update event
    await event.save();

    res.json({
      success: true,
      message: `Generated ${savedCertificates.length} certificates successfully`,
      data: {
        totalParticipants: event.participants.length,
        certificatesGenerated: savedCertificates.length,
        failed: certificateResults.filter(r => !r.success).length,
        certificates: savedCertificates.map(cert => ({
          id: cert._id,
          certificateId: cert.certificateId,
          participantName: cert.participant.name,
          participantEmail: cert.participant.email,
          status: cert.status
        }))
      }
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificates',
      error: error.message
    });
  }
});

// @route   POST /api/certificates/send/:eventId
// @desc    Send certificates via email to all participants
// @access  Private
router.post('/send/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { customTemplate, deliveryMethod = 'email' } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send certificates for this event'
      });
    }

    // Find all certificates for this event
    const certificates = await Certificate.find({ event: eventId });
    if (certificates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No certificates found. Please generate certificates first.'
      });
    }

    // Prepare event data for email
    const eventData = {
      title: event.title,
      organizerName: req.user.name,
      eventDate: event.eventDate,
      location: event.location
    };

    // Send certificates
    const emailResults = await emailService.sendBulkCertificates(
      event.participants,
      certificates.map(cert => ({ success: true, certificate: { filePath: cert.filePath } })),
      eventData,
      customTemplate
    );

    // Update certificate statuses
    for (const result of emailResults) {
      const certificate = certificates.find(cert => cert.participant.email === result.participant.email);
      if (certificate) {
        certificate.status = result.success ? 'sent' : 'failed';
        certificate.deliveryAttempts += 1;
        certificate.lastDeliveryAttempt = new Date();
        certificate.deliveryMethod = deliveryMethod;
        await certificate.save();
      }

      // Update participant status in event
      const participantIndex = event.participants.findIndex(
        p => p.email === result.participant.email
      );
      if (participantIndex !== -1) {
        event.participants[participantIndex].certificateStatus = result.success ? 'sent' : 'failed';
      }
    }

    await event.save();

    const successCount = emailResults.filter(r => r.success).length;
    const failureCount = emailResults.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Sent ${successCount} certificates successfully`,
      data: {
        totalCertificates: certificates.length,
        sent: successCount,
        failed: failureCount,
        results: emailResults.map(result => ({
          participantName: result.participant.name,
          participantEmail: result.participant.email,
          success: result.success,
          error: result.error || null
        }))
      }
    });
  } catch (error) {
    console.error('Certificate sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send certificates',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/event/:eventId
// @desc    Get all certificates for an event
// @access  Private
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view certificates for this event'
      });
    }

    const certificates = await Certificate.find({ event: eventId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        certificates: certificates.map(cert => ({
          id: cert._id,
          certificateId: cert.certificateId,
          participant: cert.participant,
          status: cert.status,
          deliveryAttempts: cert.deliveryAttempts,
          lastDeliveryAttempt: cert.lastDeliveryAttempt,
          verificationUrl: cert.verificationUrl,
          createdAt: cert.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/verify/:certificateId
// @desc    Verify a certificate by ID
// @access  Public
router.get('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate('event', 'title eventDate location');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid'
      });
    }

    res.json({
      success: true,
      data: {
        certificate: {
          certificateId: certificate.certificateId,
          participant: certificate.participant,
          event: certificate.event,
          certificateData: certificate.certificateData,
          status: certificate.status,
          generatedAt: certificate.metadata.generatedAt,
          verificationUrl: certificate.verificationUrl
        }
      }
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
      error: error.message
    });
  }
});

// @route   GET /api/certificates/download/:certificateId
// @desc    Download a certificate file
// @access  Public
router.get('/download/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    // Check if file exists
    try {
      await fs.access(certificate.filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'Certificate file not found'
      });
    }

    res.download(certificate.filePath, `Certificate_${certificate.participant.name.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Certificate download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate',
      error: error.message
    });
  }
});

module.exports = router;
