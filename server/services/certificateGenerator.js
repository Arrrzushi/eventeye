const { createCanvas, loadImage, registerFont } = require('canvas');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

class CertificateGenerator {
  constructor() {
    this.ensureUploadDir();
  }

  async ensureUploadDir() {
    const uploadDir = path.join(__dirname, '../uploads/certificates');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
  }

  async generateCertificate(certificateData, template = 'classic') {
    try {
      const { participantName, eventTitle, eventDate, organizerName, location, certificateNumber } = certificateData;
      
      // Create canvas
      const canvas = createCanvas(1200, 800);
      const ctx = canvas.getContext('2d');

      // Set background
      await this.setBackground(ctx, canvas, template);

      // Generate QR code
      const qrCodeData = await this.generateQRCode(certificateData);
      
      // Draw certificate content
      await this.drawCertificateContent(ctx, {
        participantName,
        eventTitle,
        eventDate,
        organizerName,
        location,
        certificateNumber,
        qrCodeData
      }, template);

      // Save certificate
      const certificateId = uuidv4();
      const fileName = `certificate_${certificateId}.png`;
      const filePath = path.join(__dirname, '../uploads/certificates', fileName);
      
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(filePath, buffer);

      return {
        certificateId,
        filePath,
        fileName,
        qrCodeData
      };
    } catch (error) {
      console.error('Certificate generation error:', error);
      throw new Error('Failed to generate certificate');
    }
  }

  async setBackground(ctx, canvas, template) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    switch (template) {
      case 'modern':
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        break;
      case 'minimal':
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        break;
      default: // classic
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(1, '#3b82f6');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  }

  async drawCertificateContent(ctx, data, template) {
    const { participantName, eventTitle, eventDate, organizerName, location, certificateNumber, qrCodeData } = data;
    
    // Set text properties
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title
    ctx.font = 'bold 48px Arial';
    ctx.fillText('CERTIFICATE OF PARTICIPATION', 600, 120);

    // Participant name
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`This is to certify that`, 600, 200);
    
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(participantName, 600, 260);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('has successfully participated in', 600, 320);

    // Event details
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(eventTitle, 600, 380);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText(`held on ${new Date(eventDate).toLocaleDateString()}`, 600, 420);
    ctx.fillText(`at ${location}`, 600, 450);

    // Organizer
    ctx.font = '20px Arial';
    ctx.fillText(`Organized by: ${organizerName}`, 600, 520);

    // Certificate number
    ctx.font = '16px Arial';
    ctx.fillText(`Certificate No: ${certificateNumber}`, 600, 580);

    // Date
    ctx.fillText(`Issued on: ${new Date().toLocaleDateString()}`, 600, 610);

    // QR Code
    if (qrCodeData) {
      await this.drawQRCode(ctx, qrCodeData, 100, 650);
    }
  }

  async drawQRCode(ctx, qrCodeData, x, y) {
    try {
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, x, y, 100, 100);
      };
      img.src = qrCodeImage;
    } catch (error) {
      console.error('QR Code drawing error:', error);
    }
  }

  async generateQRCode(certificateData) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${certificateData.certificateNumber}`;
    return verificationUrl;
  }

  async generateQRCodeImage(certificateData) {
    try {
      const qrCodeData = await this.generateQRCode(certificateData);
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      return {
        data: qrCodeData,
        buffer: qrCodeBuffer
      };
    } catch (error) {
      console.error('QR Code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  async generateBulkCertificates(participants, eventData) {
    const results = [];
    
    for (const participant of participants) {
      try {
        const certificateData = {
          participantName: participant.name,
          eventTitle: eventData.title,
          eventDate: eventData.eventDate,
          organizerName: eventData.organizerName,
          location: eventData.location,
          certificateNumber: this.generateCertificateNumber()
        };

        const certificate = await this.generateCertificate(certificateData, eventData.certificateTemplate?.layout || 'classic');
        
        results.push({
          participant,
          certificate,
          success: true
        });
      } catch (error) {
        console.error(`Failed to generate certificate for ${participant.name}:`, error);
        results.push({
          participant,
          certificate: null,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  generateCertificateNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }
}

module.exports = new CertificateGenerator();
