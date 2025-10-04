const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const jsPDF = require('jspdf');

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
      
      // Create PDF document
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Set background
      this.setBackground(doc, pageWidth, pageHeight, template);

      // Generate QR code
      const qrCodeData = await this.generateQRCode(certificateData);
      
      // Draw certificate content
      await this.drawCertificateContent(doc, {
        participantName,
        eventTitle,
        eventDate,
        organizerName,
        location,
        certificateNumber,
        qrCodeData
      }, pageWidth, pageHeight, template);

      // Save certificate
      const certificateId = uuidv4();
      const fileName = `certificate_${certificateId}.pdf`;
      const filePath = path.join(__dirname, '../uploads/certificates', fileName);
      
      const pdfBuffer = doc.output('arraybuffer');
      await fs.writeFile(filePath, Buffer.from(pdfBuffer));

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

  setBackground(doc, pageWidth, pageHeight, template) {
    let bgColor;
    
    switch (template) {
      case 'modern':
        bgColor = '#667eea';
        break;
      case 'minimal':
        bgColor = '#f8fafc';
        break;
      default: // classic
        bgColor = '#1e3a8a';
    }
    
    // Set background color
    doc.setFillColor(bgColor);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Add border
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  }

  async drawCertificateContent(doc, data, pageWidth, pageHeight, template) {
    const { participantName, eventTitle, eventDate, organizerName, location, certificateNumber, qrCodeData } = data;
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('CERTIFICATE OF PARTICIPATION', pageWidth / 2, 40, { align: 'center' });

    // Participant name
    doc.setFontSize(16);
    doc.text(`This is to certify that`, pageWidth / 2, 70, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(251, 191, 36); // Gold color
    doc.text(participantName, pageWidth / 2, 90, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('has successfully participated in', pageWidth / 2, 110, { align: 'center' });

    // Event details
    doc.setFontSize(18);
    doc.setTextColor(251, 191, 36);
    doc.text(eventTitle, pageWidth / 2, 130, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`held on ${new Date(eventDate).toLocaleDateString()}`, pageWidth / 2, 150, { align: 'center' });
    doc.text(`at ${location}`, pageWidth / 2, 165, { align: 'center' });

    // Organizer
    doc.setFontSize(10);
    doc.text(`Organized by: ${organizerName}`, pageWidth / 2, 190, { align: 'center' });

    // Certificate number
    doc.setFontSize(8);
    doc.text(`Certificate No: ${certificateNumber}`, pageWidth / 2, 205, { align: 'center' });

    // Date
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 215, { align: 'center' });

    // QR Code
    if (qrCodeData) {
      await this.drawQRCode(doc, qrCodeData, 20, pageHeight - 40);
    }
  }

  async drawQRCode(doc, qrCodeData, x, y) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
        width: 50,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // Add QR code to PDF
      doc.addImage(qrCodeDataURL, 'PNG', x, y, 30, 30);
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
