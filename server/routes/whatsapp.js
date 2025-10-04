const express = require('express');
const router = express.Router();
const messagingService = require('../services/messagingService');

// Initialize WhatsApp service
router.post('/initialize', async (req, res) => {
    try {
        const result = await messagingService.initializeWhatsApp();
        res.json({
            success: result.success,
            message: result.message,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get WhatsApp QR code
router.get('/qr', async (req, res) => {
    try {
        const status = await messagingService.getServiceStatus();
        res.json({
            success: true,
            qrCode: status.whatsapp.qrCode,
            ready: status.whatsapp.ready
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get WhatsApp service status
router.get('/status', async (req, res) => {
    try {
        const status = await messagingService.getServiceStatus();
        const whatsappInfo = await messagingService.getWhatsAppInfo();
        
        res.json({
            success: true,
            whatsapp: {
                available: status.whatsapp.available,
                ready: status.whatsapp.ready,
                qrCode: status.whatsapp.qrCode,
                info: whatsappInfo
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send test WhatsApp message
router.post('/test', async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'Phone number is required'
            });
        }

        const result = await messagingService.sendTestMessage('whatsapp', phoneNumber, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Stop WhatsApp service
router.post('/stop', async (req, res) => {
    try {
        const result = await messagingService.stopWhatsApp();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send certificates via WhatsApp
router.post('/send-certificates/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { participants, options = {} } = req.body;

        if (!participants || !Array.isArray(participants)) {
            return res.status(400).json({
                success: false,
                error: 'Participants array is required'
            });
        }

        // This would typically fetch certificates from database
        // For now, we'll assume certificates are provided in the request
        const certificates = participants.map(participant => ({
            success: true,
            certificate: {
                filePath: `./certificates/${participant.id}_certificate.pdf` // Mock path
            }
        }));

        const eventData = {
            title: 'Event Title', // This should come from database
            organizerName: 'Event Organizer',
            eventDate: new Date(),
            location: 'Event Location'
        };

        const results = await messagingService.sendBulkCertificates(
            participants,
            certificates,
            eventData,
            { ...options, sendEmail: false, sendWhatsApp: true }
        );

        res.json({
            success: true,
            results: results,
            totalSent: results.filter(r => r.success).length,
            totalFailed: results.filter(r => !r.success).length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
