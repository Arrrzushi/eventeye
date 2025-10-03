@echo off
echo 🎓 Starting EventEye - Certificate Automation Platform
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) first.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm run install-all

echo 🔧 Setting up environment...
if not exist "server\.env" (
    echo 📝 Creating .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo CLIENT_URL=http://localhost:3000
        echo.
        echo # Database
        echo MONGODB_URI=mongodb://localhost:27017/eventeye
        echo.
        echo # JWT
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production
        echo JWT_EXPIRE=7d
        echo.
        echo # Email Configuration (Gmail example)
        echo EMAIL_HOST=smtp.gmail.com
        echo EMAIL_PORT=587
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-app-password
        echo.
        echo # WhatsApp API (Twilio example)
        echo TWILIO_ACCOUNT_SID=your-twilio-account-sid
        echo TWILIO_AUTH_TOKEN=your-twilio-auth-token
        echo TWILIO_PHONE_NUMBER=your-twilio-phone-number
        echo.
        echo # File Upload
        echo MAX_FILE_SIZE=10485760
        echo UPLOAD_PATH=./uploads
    ) > server\.env
    echo ✅ .env file created. Please update with your actual credentials.
)

echo 🚀 Starting EventEye...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo Demo credentials: demo@eventeye.com / demo123
echo.
echo Press Ctrl+C to stop the application
echo.

call npm run dev
pause
