#!/bin/bash

echo "🎓 Starting EventEye - Certificate Automation Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Make sure you have MongoDB running or use MongoDB Atlas."
fi

echo "📦 Installing dependencies..."
npm run install-all

echo "🔧 Setting up environment..."
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file..."
    cat > server/.env << EOL
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/eventeye

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# WhatsApp API (Twilio example)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
EOL
    echo "✅ .env file created. Please update with your actual credentials."
fi

echo "🚀 Starting EventEye..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Demo credentials: demo@eventeye.com / demo123"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

npm run dev
