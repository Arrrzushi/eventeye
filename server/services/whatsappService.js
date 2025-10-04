const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

class WhatsAppService {
    constructor() {
        this.client = null;
        this.isReady = false;
        this.qrCode = null;
        this.initializeClient();
    }

    initializeClient() {
        try {
            this.client = new Client({
                authStrategy: new LocalAuth({
                    clientId: "eventeye-whatsapp"
                }),
                puppeteer: {
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process',
                        '--disable-gpu'
                    ]
                }
            });

            this.setupEventHandlers();
            console.log('📱 WhatsApp service initialized');
        } catch (error) {
            console.error('❌ WhatsApp service initialization failed:', error.message);
        }
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            console.log('📱 WhatsApp QR Code generated');
            this.qrCode = qr;
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('✅ WhatsApp client is ready!');
            this.isReady = true;
        });

        this.client.on('authenticated', () => {
            console.log('🔐 WhatsApp client authenticated');
        });

        this.client.on('auth_failure', (msg) => {
            console.error('❌ WhatsApp authentication failed:', msg);
        });

        this.client.on('disconnected', (reason) => {
            console.log('📱 WhatsApp client disconnected:', reason);
            this.isReady = false;
        });
    }

    async start() {
        try {
            if (!this.client) {
                this.initializeClient();
            }
            await this.client.initialize();
            return true;
        } catch (error) {
            console.error('❌ Failed to start WhatsApp client:', error.message);
            return false;
        }
    }

    async stop() {
        try {
            if (this.client) {
                await this.client.destroy();
                this.isReady = false;
                console.log('📱 WhatsApp client stopped');
            }
        } catch (error) {
            console.error('❌ Error stopping WhatsApp client:', error.message);
        }
    }

    getQRCode() {
        return this.qrCode;
    }

    isClientReady() {
        return this.isReady;
    }

    async sendCertificate(phoneNumber, certificatePath, participantName, eventTitle) {
        try {
            if (!this.isReady) {
                throw new Error('WhatsApp client is not ready');
            }

            // Format phone number (remove any non-digits and add country code if needed)
            const formattedNumber = this.formatPhoneNumber(phoneNumber);
            
            // Check if number is registered on WhatsApp
            const isRegistered = await this.client.isRegisteredUser(formattedNumber);
            if (!isRegistered) {
                throw new Error(`Phone number ${formattedNumber} is not registered on WhatsApp`);
            }

            // Create message
            const message = `🎓 *Certificate of Participation*

Dear ${participantName},

Congratulations! You have successfully completed "${eventTitle}".

Please find your certificate attached.

Best regards,
EventEye Team

---
*This is an automated message from EventEye Certificate Automation System*`;

            // Send text message first
            await this.client.sendMessage(formattedNumber, message);

            // Send certificate as document
            const media = MessageMedia.fromFilePath(certificatePath);
            await this.client.sendMessage(formattedNumber, media, {
                caption: `Your certificate for ${eventTitle}`
            });

            console.log(`✅ Certificate sent via WhatsApp to ${formattedNumber}`);
            return { success: true, message: 'Certificate sent successfully' };

        } catch (error) {
            console.error(`❌ Failed to send WhatsApp message to ${phoneNumber}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    async sendBulkCertificates(certificates) {
        const results = [];
        
        for (const cert of certificates) {
            try {
                const result = await this.sendCertificate(
                    cert.phoneNumber,
                    cert.certificatePath,
                    cert.participantName,
                    cert.eventTitle
                );
                
                results.push({
                    participantName: cert.participantName,
                    phoneNumber: cert.phoneNumber,
                    success: result.success,
                    message: result.message || result.error
                });

                // Add delay between messages to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                results.push({
                    participantName: cert.participantName,
                    phoneNumber: cert.phoneNumber,
                    success: false,
                    message: error.message
                });
            }
        }

        return results;
    }

    formatPhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');
        
        // Add country code if not present (assuming +1 for US, adjust as needed)
        if (cleaned.length === 10) {
            cleaned = '1' + cleaned;
        }
        
        // Add WhatsApp format
        return cleaned + '@c.us';
    }

    async getClientInfo() {
        try {
            if (!this.isReady) {
                return { ready: false, message: 'WhatsApp client not ready' };
            }

            const info = await this.client.info;
            return {
                ready: true,
                name: info.pushname,
                phone: info.wid.user,
                platform: info.platform
            };
        } catch (error) {
            return { ready: false, error: error.message };
        }
    }
}

// Create singleton instance
const whatsappService = new WhatsAppService();

module.exports = whatsappService;
