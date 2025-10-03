const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/events/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      location,
      type,
      price,
      maxParticipants,
      certificateTemplate,
      settings
    } = req.body;

    const event = new Event({
      title,
      description,
      organizer: req.user._id,
      eventDate,
      location,
      type,
      price: type === 'free' ? 0 : price,
      maxParticipants,
      certificateTemplate: {
        backgroundImage: '',
        logo: '',
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        fontFamily: 'Arial',
        layout: 'classic',
        ...certificateTemplate
      },
      settings: {
        autoSendCertificates: true,
        includeQRCode: true,
        emailTemplate: {
          subject: `Your Event Certificate - ${title}`,
          body: 'Congratulations! Please find your certificate attached.'
        },
        ...settings
      }
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// @route   GET /api/events
// @desc    Get all events for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { organizer: req.user._id };
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('organizer', 'name email');

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get a specific event
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email organization');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns the event
    if (event.organizer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this event'
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// @route   POST /api/events/:id/participants
// @desc    Add participants to an event
// @access  Private
router.post('/:id/participants', auth, async (req, res) => {
  try {
    const { participants } = req.body;

    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        message: 'Participants array is required'
      });
    }

    const event = await Event.findById(req.params.id);

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
        message: 'Not authorized to add participants to this event'
      });
    }

    // Validate participants
    const validParticipants = participants.filter(p => p.name && p.email);
    if (validParticipants.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid participants found'
      });
    }

    // Add participants
    const newParticipants = validParticipants.map(participant => ({
      name: participant.name,
      email: participant.email,
      phone: participant.phone || '',
      registrationDate: new Date(),
      certificateStatus: 'pending'
    }));

    event.participants.push(...newParticipants);
    event.currentParticipants = event.participants.length;

    await event.save();

    res.json({
      success: true,
      message: `Added ${newParticipants.length} participants successfully`,
      data: {
        totalParticipants: event.participants.length,
        newParticipants: newParticipants.length
      }
    });
  } catch (error) {
    console.error('Add participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add participants',
      error: error.message
    });
  }
});

// @route   GET /api/events/:id/participants
// @desc    Get all participants for an event
// @access  Private
router.get('/:id/participants', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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
        message: 'Not authorized to view participants for this event'
      });
    }

    res.json({
      success: true,
      data: {
        participants: event.participants,
        totalParticipants: event.participants.length,
        certificateStats: {
          pending: event.participants.filter(p => p.certificateStatus === 'pending').length,
          generated: event.participants.filter(p => p.certificateStatus === 'generated').length,
          sent: event.participants.filter(p => p.certificateStatus === 'sent').length,
          delivered: event.participants.filter(p => p.certificateStatus === 'delivered').length,
          failed: event.participants.filter(p => p.certificateStatus === 'failed').length
        }
      }
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch participants',
      error: error.message
    });
  }
});

// @route   POST /api/events/:id/upload-template
// @desc    Upload certificate template files
// @access  Private
router.post('/:id/upload-template', auth, upload.fields([
  { name: 'backgroundImage', maxCount: 1 },
  { name: 'logo', maxCount: 1 }
]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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
        message: 'Not authorized to upload templates for this event'
      });
    }

    const updates = {};
    
    if (req.files.backgroundImage) {
      updates['certificateTemplate.backgroundImage'] = req.files.backgroundImage[0].path;
    }
    
    if (req.files.logo) {
      updates['certificateTemplate.logo'] = req.files.logo[0].path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Template uploaded successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Template upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload template',
      error: error.message
    });
  }
});

module.exports = router;
