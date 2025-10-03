// Demo setup script for EventEye
// This script creates sample data for demonstration purposes

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const Event = require('./server/models/Event');

const demoSetup = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventeye');
    console.log('📊 Connected to MongoDB');

    // Create demo user
    const demoUser = new User({
      name: 'Demo Organizer',
      email: 'demo@eventeye.com',
      password: 'demo123',
      organization: 'EventEye Demo',
      phone: '+1-555-0123',
      role: 'organizer'
    });

    await demoUser.save();
    console.log('👤 Demo user created');

    // Create demo events
    const demoEvents = [
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
        organizer: demoUser._id,
        eventDate: new Date('2024-03-15'),
        location: 'San Francisco Convention Center, CA',
        type: 'paid',
        price: 299,
        maxParticipants: 500,
        currentParticipants: 342,
        status: 'active',
        participants: [
          { name: 'John Doe', email: 'john@example.com', phone: '+1-555-0001', certificateStatus: 'delivered' },
          { name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0002', certificateStatus: 'sent' },
          { name: 'Bob Johnson', email: 'bob@example.com', phone: '+1-555-0003', certificateStatus: 'generated' },
          { name: 'Alice Brown', email: 'alice@example.com', phone: '+1-555-0004', certificateStatus: 'pending' },
          { name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1-555-0005', certificateStatus: 'failed' }
        ]
      },
      {
        title: 'Digital Marketing Workshop',
        description: 'Learn the fundamentals of digital marketing and social media strategies.',
        organizer: demoUser._id,
        eventDate: new Date('2024-02-20'),
        location: 'New York, NY',
        type: 'free',
        price: 0,
        maxParticipants: 100,
        currentParticipants: 95,
        status: 'completed',
        participants: [
          { name: 'Sarah Davis', email: 'sarah@example.com', phone: '+1-555-0006', certificateStatus: 'delivered' },
          { name: 'Mike Wilson', email: 'mike@example.com', phone: '+1-555-0007', certificateStatus: 'delivered' },
          { name: 'Lisa Garcia', email: 'lisa@example.com', phone: '+1-555-0008', certificateStatus: 'delivered' }
        ]
      },
      {
        title: 'Data Science Bootcamp',
        description: 'Intensive 5-day bootcamp covering machine learning, data analysis, and visualization.',
        organizer: demoUser._id,
        eventDate: new Date('2024-04-10'),
        location: 'Austin, TX',
        type: 'paid',
        price: 599,
        maxParticipants: 50,
        currentParticipants: 0,
        status: 'draft',
        participants: []
      }
    ];

    for (const eventData of demoEvents) {
      const event = new Event(eventData);
      await event.save();
      console.log(`📅 Created event: ${eventData.title}`);
    }

    console.log('✅ Demo setup completed successfully!');
    console.log('🎯 You can now log in with:');
    console.log('   Email: demo@eventeye.com');
    console.log('   Password: demo123');
    
  } catch (error) {
    console.error('❌ Demo setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
};

// Run demo setup if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  demoSetup();
}

module.exports = demoSetup;
