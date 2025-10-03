# 🎓 EventEye - Certificate Automation Platform

EventEye is a comprehensive platform that automates the generation, distribution, and verification of event certificates. Built for event organizers who need to distribute thousands of participant certificates quickly, accurately, and without errors.

## ✨ Features

### 🏆 Certificate Generation
- **Automated Generation**: Generate personalized certificates with participant names, event details, dates, and organizer information
- **Custom Templates**: Beautiful, customizable certificate templates with multiple layouts (Classic, Modern, Minimal)
- **QR Code Integration**: Verifiable QR codes on every certificate for authenticity
- **Bulk Processing**: Generate certificates for thousands of participants in minutes

### 📧 Smart Distribution
- **Email Automation**: Send certificates via email with beautiful HTML templates
- **WhatsApp Integration**: Send certificates via WhatsApp (coming soon)
- **Bulk Sending**: Send certificates to hundreds of participants simultaneously
- **Delivery Tracking**: Real-time tracking of certificate delivery status

### 📊 Analytics Dashboard
- **Real-time Monitoring**: Track certificate generation and delivery status
- **Success Rates**: Monitor delivery success rates and identify failures
- **Participant Analytics**: View participant engagement and certificate statistics
- **Performance Metrics**: System performance and delivery speed analytics

### 🔐 Security & Verification
- **QR Code Verification**: Public verification system for certificate authenticity
- **Blockchain Integration**: Secure certificate storage and verification (coming soon)
- **Digital Signatures**: Cryptographically signed certificates
- **Anti-fraud Protection**: Multiple layers of security to prevent certificate forgery

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eventeye
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/eventeye
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend client (port 3000).

## 🎯 Demo Credentials

For testing purposes, use these demo credentials:
- **Email**: demo@eventeye.com
- **Password**: demo123

## 📱 Usage

### 1. Create an Event
- Sign up or log in to your EventEye account
- Click "Create Event" to set up a new event
- Configure event details, pricing, and certificate templates
- Upload custom backgrounds and logos

### 2. Add Participants
- Import participants via CSV or add them manually
- Participants can also register themselves (if enabled)
- View participant list and registration status

### 3. Generate Certificates
- Click "Generate Certificates" for your event
- Choose certificate template and customization options
- Certificates are generated automatically with QR codes
- Download individual certificates or bulk download

### 4. Send Certificates
- Use the bulk email feature to send certificates
- Customize email templates with your branding
- Track delivery status in real-time
- Resend failed deliveries automatically

### 5. Verify Certificates
- Share verification links with participants
- Use QR codes for instant verification
- Public verification system for authenticity

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Canvas** - Certificate generation
- **QRCode** - QR code generation

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization

## 📁 Project Structure

```
eventeye/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   └── config/            # Configuration
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - Get user events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Certificates
- `POST /api/certificates/generate/:eventId` - Generate certificates
- `POST /api/certificates/send/:eventId` - Send certificates
- `GET /api/certificates/verify/:certificateId` - Verify certificate
- `GET /api/certificates/download/:certificateId` - Download certificate

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/events/:eventId/analytics` - Event analytics

## 🎨 Customization

### Certificate Templates
- Modify colors, fonts, and layouts
- Upload custom backgrounds and logos
- Create multiple template variations
- Preview templates before generation

### Email Templates
- Customize email subject lines and content
- Add your organization branding
- Include event-specific information
- Responsive email design

## 🚀 Deployment

### Production Setup
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure email service (SendGrid, AWS SES, etc.)
3. Set up environment variables for production
4. Deploy backend to Heroku, AWS, or DigitalOcean
5. Deploy frontend to Netlify, Vercel, or AWS S3

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@eventeye.com or join our Discord community.

## 🎯 Roadmap

- [ ] WhatsApp integration
- [ ] Blockchain certificate storage
- [ ] Advanced analytics and reporting
- [ ] Mobile app for organizers
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] White-label solutions

---

**EventEye** - Making certificate distribution effortless and secure! 🎓✨
