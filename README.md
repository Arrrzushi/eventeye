# 🎓 EventEye - Certificate Automation Platform

**EventEye** is a modern certificate automation system that generates personalized certificates with QR codes and distributes them via email and WhatsApp for events.

## ✨ Features

- 🏆 **Automated Certificate Generation** - Create personalized certificates with participant details
- 📧 **Email Distribution** - Send certificates via Gmail with PDF attachments
- 📱 **WhatsApp Integration** - Bulk send certificates via WhatsApp
- 🔍 **QR Code Verification** - Verifiable QR codes for certificate authenticity
- 📊 **Real-time Dashboard** - Track delivery status and analytics
- 🎨 **Minimal UI** - Clean, modern interface for easy management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account with App Password
- WhatsApp Web access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arrrzushi/eventeye.git
   cd eventeye
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup environment**
   ```bash
   npm run setup
   ```
   Follow the prompts to configure your Gmail credentials.

4. **Start the application**
   ```bash
   npm run production
   ```

## 📋 Available Commands

```bash
npm run dev          # Start development server
npm run dashboard    # Open main dashboard
npm run create-event # Open event creator
npm run production   # Start full application
```

## 🎯 Usage

1. **Open Dashboard**: Navigate to `index.html` in your browser
2. **Create Event**: Use the event creator to add participants
3. **Generate Certificates**: Automatically create personalized certificates
4. **Send Certificates**: Distribute via email or WhatsApp
5. **Track Status**: Monitor delivery in real-time dashboard

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication
2. Generate App Password
3. Add credentials to `server/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### WhatsApp Setup
1. Open the dashboard
2. Go to Settings tab
3. Click "Initialize WhatsApp"
4. Scan QR code with WhatsApp mobile app

## 📁 Project Structure

```
eventeye/
├── index.html              # Main dashboard
├── create-event.html       # Event creator
├── server/                 # Backend API
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   └── config/            # Configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Email**: Nodemailer with Gmail
- **WhatsApp**: whatsapp-web.js
- **PDF Generation**: jsPDF
- **QR Codes**: qrcode library

## 📊 API Endpoints

- `GET /api/health` - Health check
- `POST /api/events` - Create event
- `POST /api/certificates/generate/:eventId` - Generate certificates
- `POST /api/certificates/send/:eventId` - Send certificates
- `GET /api/certificates/verify/:certificateId` - Verify certificate

## 🎉 Demo

The application is ready for hackathon demos with:
- ✅ Working certificate generation
- ✅ Email and WhatsApp integration
- ✅ Real-time status tracking
- ✅ Clean minimal interface
- ✅ QR code verification

## 📝 License

MIT License - feel free to use for your projects!

---

**Built with ❤️ for event organizers and certificate automation**