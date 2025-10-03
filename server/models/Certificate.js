const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participant: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    }
  },
  certificateData: {
    participantName: {
      type: String,
      required: true
    },
    eventTitle: {
      type: String,
      required: true
    },
    eventDate: {
      type: Date,
      required: true
    },
    organizerName: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    certificateNumber: {
      type: String,
      required: true
    }
  },
  qrCode: {
    data: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  filePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['generated', 'sent', 'delivered', 'failed', 'bounced'],
    default: 'generated'
  },
  deliveryAttempts: {
    type: Number,
    default: 0
  },
  lastDeliveryAttempt: {
    type: Date,
    default: null
  },
  deliveryMethod: {
    type: String,
    enum: ['email', 'whatsapp', 'both'],
    default: 'email'
  },
  verificationUrl: {
    type: String,
    required: true
  },
  metadata: {
    generatedAt: {
      type: Date,
      default: Date.now
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileSize: {
      type: Number,
      default: 0
    },
    templateUsed: {
      type: String,
      default: 'default'
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ event: 1, status: 1 });
certificateSchema.index({ 'participant.email': 1 });
certificateSchema.index({ verificationUrl: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
