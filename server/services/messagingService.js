const emailService = require('./emailService');
const whatsappService = require('./whatsappService');
const path = require('path');

class MessagingService {
    constructor() {
        this.emailService = emailService;
        this.whatsappService = whatsappService;
    }

    async sendCertificate(participant, certificatePath, eventData, options = {}) {
        const results = {
            email: null,
            whatsapp: null,
            success: false
        };

        const { name, email, phoneNumber } = participant;
        const { title, organizerName, eventDate, location } = eventData;

        // Send via Email if email is provided and enabled
        if (email && options.sendEmail !== false) {
            try {
                results.email = await this.emailService.sendCertificateEmail(
                    participant,
                    certificatePath,
                    eventData,
                    options.emailTemplate
                );
            } catch (error) {
                results.email = {
                    success: false,
                    error: error.message
                };
            }
        }

        // Send via WhatsApp if phone number is provided and enabled
        if (phoneNumber && options.sendWhatsApp !== false) {
            try {
                results.whatsapp = await this.whatsappService.sendCertificate(
                    phoneNumber,
                    certificatePath,
                    name,
                    title
                );
            } catch (error) {
                results.whatsapp = {
                    success: false,
                    error: error.message
                };
            }
        }

        // Determine overall success
        results.success = (results.email && results.email.success) || 
                         (results.whatsapp && results.whatsapp.success);

        return results;
    }

    async sendBulkCertificates(participants, certificates, eventData, options = {}) {
        const results = [];
        const batchSize = options.batchSize || 5; // Smaller batch for WhatsApp

        for (let i = 0; i < participants.length; i += batchSize) {
            const batch = participants.slice(i, i + batchSize);
            const batchPromises = batch.map(async (participant, index) => {
                const certificate = certificates[i + index];
                if (certificate && certificate.success) {
                    return await this.sendCertificate(
                        participant,
                        certificate.certificate.filePath,
                        eventData,
                        options
                    );
                } else {
                    return {
                        participant: participant,
                        success: false,
                        error: 'Certificate generation failed',
                        email: null,
                        whatsapp: null
                    };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Add delay between batches to avoid rate limiting
            if (i + batchSize < participants.length) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        return results;
    }

    async getServiceStatus() {
        const status = {
            email: {
                available: !!this.emailService.transporter,
                ready: true // Email service is always "ready" (even in demo mode)
            },
            whatsapp: {
                available: !!this.whatsappService.client,
                ready: this.whatsappService.isClientReady(),
                qrCode: this.whatsappService.getQRCode()
            }
        };

        return status;
    }

    async initializeWhatsApp() {
        try {
            const success = await this.whatsappService.start();
            return {
                success: success,
                message: success ? 'WhatsApp service started' : 'Failed to start WhatsApp service'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async stopWhatsApp() {
        try {
            await this.whatsappService.stop();
            return {
                success: true,
                message: 'WhatsApp service stopped'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getWhatsAppInfo() {
        return await this.whatsappService.getClientInfo();
    }

    async sendTestMessage(type, recipient, message = null) {
        const results = {
            success: false,
            message: '',
            error: null
        };

        try {
            if (type === 'email' && recipient.includes('@')) {
                const testResult = await this.emailService.sendTestEmail(recipient);
                results.success = testResult.success;
                results.message = testResult.success ? 'Test email sent successfully' : 'Failed to send test email';
                results.error = testResult.error;
            } else if (type === 'whatsapp') {
                if (!this.whatsappService.isClientReady()) {
                    results.error = 'WhatsApp client is not ready';
                    return results;
                }

                const testMessage = message || '🧪 Test message from EventEye Certificate Automation System';
                const formattedNumber = this.whatsappService.formatPhoneNumber(recipient);
                
                const isRegistered = await this.whatsappService.client.isRegisteredUser(formattedNumber);
                if (!isRegistered) {
                    results.error = 'Phone number is not registered on WhatsApp';
                    return results;
                }

                await this.whatsappService.client.sendMessage(formattedNumber, testMessage);
                results.success = true;
                results.message = 'Test WhatsApp message sent successfully';
            } else {
                results.error = 'Invalid message type or recipient format';
            }
        } catch (error) {
            results.error = error.message;
        }

        return results;
    }
}

module.exports = new MessagingService();
