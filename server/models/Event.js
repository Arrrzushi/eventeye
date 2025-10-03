const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Event title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Please provide an event date']
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
    trim: true
  },
  type: {
    type: String,
    enum: ['paid', 'free'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  maxParticipants: {
    type: Number,
    default: 1000
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  certificateTemplate: {
    backgroundImage: {
      type: String,
      default: ''
    },
    logo: {
      type: String,
      default: ''
    },
    primaryColor: {
      type: String,
      default: '#2563eb'
    },
    secondaryColor: {
      type: String,
      default: '#1e40af'
    },
    fontFamily: {
      type: String,
      default: 'Arial'
    },
    layout: {
      type: String,
      enum: ['classic', 'modern', 'minimal'],
      default: 'classic'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  participants: [{
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
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    certificateStatus: {
      type: String,
      enum: ['pending', 'generated', 'sent', 'delivered', 'failed'],
      default: 'pending'
    },
    certificateId: {
      type: String,
      default: ''
    },
    qrCode: {
      type: String,
      default: ''
    }
  }],
  settings: {
    autoSendCertificates: {
      type: Boolean,
      default: true
    },
    includeQRCode: {
      type: Boolean,
      default: true
    },
    emailTemplate: {
      subject: {
        type: String,
        default: 'Your Event Certificate - {eventTitle}'
      },
      body: {
        type: String,
        default: 'Congratulations! Please find your certificate attached.'
      }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ organizer: 1, status: 1 });
eventSchema.index({ eventDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
