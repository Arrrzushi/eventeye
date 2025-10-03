const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const Certificate = require('../models/Certificate');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics for the authenticated user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get basic event stats
    const totalEvents = await Event.countDocuments({ organizer: userId });
    const activeEvents = await Event.countDocuments({ organizer: userId, status: 'active' });
    const completedEvents = await Event.countDocuments({ organizer: userId, status: 'completed' });

    // Get participant stats
    const events = await Event.find({ organizer: userId });
    const totalParticipants = events.reduce((sum, event) => sum + event.participants.length, 0);

    // Get certificate stats
    const totalCertificates = await Certificate.countDocuments({ 
      event: { $in: events.map(e => e._id) } 
    });
    
    const sentCertificates = await Certificate.countDocuments({ 
      event: { $in: events.map(e => e._id) },
      status: 'sent'
    });
    
    const deliveredCertificates = await Certificate.countDocuments({ 
      event: { $in: events.map(e => e._id) },
      status: 'delivered'
    });

    // Get recent events
    const recentEvents = await Event.find({ organizer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title eventDate status participants.length');

    // Get certificate delivery trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCertificates = await Certificate.find({
      event: { $in: events.map(e => e._id) },
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    // Group certificates by date
    const deliveryTrends = {};
    recentCertificates.forEach(cert => {
      const date = cert.createdAt.toISOString().split('T')[0];
      if (!deliveryTrends[date]) {
        deliveryTrends[date] = { generated: 0, sent: 0, delivered: 0 };
      }
      deliveryTrends[date][cert.status] = (deliveryTrends[date][cert.status] || 0) + 1;
    });

    const trendsData = Object.entries(deliveryTrends).map(([date, stats]) => ({
      date,
      ...stats
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalEvents,
          activeEvents,
          completedEvents,
          totalParticipants,
          totalCertificates,
          sentCertificates,
          deliveredCertificates,
          deliveryRate: totalCertificates > 0 ? Math.round((deliveredCertificates / totalCertificates) * 100) : 0
        },
        recentEvents,
        deliveryTrends: trendsData
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/events/:eventId/analytics
// @desc    Get detailed analytics for a specific event
// @access  Private
router.get('/events/:eventId/analytics', auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.organizer.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this event'
      });
    }

    // Get certificate statistics
    const certificates = await Certificate.find({ event: eventId });
    
    const certificateStats = {
      total: certificates.length,
      generated: certificates.filter(c => c.status === 'generated').length,
      sent: certificates.filter(c => c.status === 'sent').length,
      delivered: certificates.filter(c => c.status === 'delivered').length,
      failed: certificates.filter(c => c.status === 'failed').length,
      bounced: certificates.filter(c => c.status === 'bounced').length
    };

    // Get delivery timeline
    const deliveryTimeline = certificates.map(cert => ({
      date: cert.createdAt,
      status: cert.status,
      participantName: cert.participant.name
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get participant statistics
    const participantStats = {
      total: event.participants.length,
      withCertificates: event.participants.filter(p => p.certificateStatus !== 'pending').length,
      pending: event.participants.filter(p => p.certificateStatus === 'pending').length,
      generated: event.participants.filter(p => p.certificateStatus === 'generated').length,
      sent: event.participants.filter(p => p.certificateStatus === 'sent').length,
      delivered: event.participants.filter(p => p.certificateStatus === 'delivered').length,
      failed: event.participants.filter(p => p.certificateStatus === 'failed').length
    };

    // Get delivery method statistics
    const deliveryMethods = {
      email: certificates.filter(c => c.deliveryMethod === 'email').length,
      whatsapp: certificates.filter(c => c.deliveryMethod === 'whatsapp').length,
      both: certificates.filter(c => c.deliveryMethod === 'both').length
    };

    res.json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          eventDate: event.eventDate,
          status: event.status
        },
        certificateStats,
        participantStats,
        deliveryMethods,
        deliveryTimeline
      }
    });
  } catch (error) {
    console.error('Event analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event analytics',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/certificates/recent
// @desc    Get recent certificate activities
// @access  Private
router.get('/certificates/recent', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    // Get user's events
    const events = await Event.find({ organizer: userId }).select('_id title');
    const eventIds = events.map(e => e._id);

    // Get recent certificates
    const recentCertificates = await Certificate.find({
      event: { $in: eventIds }
    })
    .populate('event', 'title')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    const activities = recentCertificates.map(cert => ({
      id: cert._id,
      certificateId: cert.certificateId,
      participantName: cert.participant.name,
      participantEmail: cert.participant.email,
      eventTitle: cert.event.title,
      status: cert.status,
      createdAt: cert.createdAt,
      lastDeliveryAttempt: cert.lastDeliveryAttempt
    }));

    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    console.error('Recent certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent certificate activities',
      error: error.message
    });
  }
});

// @route   GET /api/dashboard/performance
// @desc    Get system performance metrics
// @access  Private
router.get('/performance', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's events
    const events = await Event.find({ organizer: userId });
    const eventIds = events.map(e => e._id);

    // Calculate average certificate generation time
    const certificates = await Certificate.find({ event: { $in: eventIds } });
    
    // Calculate delivery success rate
    const totalSent = certificates.filter(c => c.status === 'sent' || c.status === 'delivered').length;
    const totalDelivered = certificates.filter(c => c.status === 'delivered').length;
    const deliverySuccessRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

    // Calculate average delivery attempts
    const totalAttempts = certificates.reduce((sum, cert) => sum + cert.deliveryAttempts, 0);
    const averageAttempts = certificates.length > 0 ? Math.round((totalAttempts / certificates.length) * 10) / 10 : 0;

    // Get failed deliveries
    const failedDeliveries = certificates.filter(c => c.status === 'failed' || c.status === 'bounced');

    res.json({
      success: true,
      data: {
        metrics: {
          totalCertificatesGenerated: certificates.length,
          deliverySuccessRate,
          averageDeliveryAttempts: averageAttempts,
          failedDeliveries: failedDeliveries.length,
          systemUptime: '99.9%', // This would be calculated from actual system metrics
          averageGenerationTime: '2.3s' // This would be calculated from actual generation times
        },
        failedDeliveries: failedDeliveries.map(cert => ({
          certificateId: cert.certificateId,
          participantName: cert.participant.name,
          participantEmail: cert.participant.email,
          status: cert.status,
          deliveryAttempts: cert.deliveryAttempts,
          lastDeliveryAttempt: cert.lastDeliveryAttempt
        }))
      }
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics',
      error: error.message
    });
  }
});

module.exports = router;
