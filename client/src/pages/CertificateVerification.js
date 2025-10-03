import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
  Mail,
  FileText,
  Shield,
  Download,
  Share2,
  Copy,
  QrCode
} from 'lucide-react';

const VerificationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing['2xl']};
`;

const VerificationCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  text-align: center;
`;

const StatusIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  background: ${props => props.valid ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.valid ? '#166534' : '#991b1b'};
`;

const StatusTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.valid ? props.theme.colors.success : props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatusMessage = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const CertificateDetails = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.primary};
  color: white;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: ${props => props.theme.colors.gradientPrimary};
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: ${props => props.theme.shadows.lg};
    }
  }

  &.secondary {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    border: 2px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => props.theme.colors.background};
      border-color: ${props => props.theme.colors.primary};
    }
  }
`;

const QRCodeSection = styled.div`
  margin-top: ${props => props.theme.spacing['2xl']};
  padding-top: ${props => props.theme.spacing['2xl']};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const QRCodeContainer = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textLight};
`;

const SecurityInfo = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
`;

const SecurityTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SecurityFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const SecurityFeature = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const CertificateVerification = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // Mock verification logic
    const verifyCertificate = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock certificate data
        const mockCertificate = {
          certificateId: certificateId,
          participantName: 'John Doe',
          participantEmail: 'john@example.com',
          eventTitle: 'Tech Conference 2024',
          eventDate: '2024-03-15',
          organizerName: 'Tech Events Inc.',
          location: 'San Francisco, CA',
          certificateNumber: 'CERT-ABC123-XYZ789',
          generatedAt: '2024-03-15T10:30:00',
          verificationUrl: window.location.href,
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(window.location.href)
        };
        
        setCertificate(mockCertificate);
        setValid(true);
      } catch (error) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId]);

  const handleDownload = () => {
    console.log('Download certificate:', certificateId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Certificate Verification',
        text: `Verify this certificate: ${certificate?.participantName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Verification link copied to clipboard!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Verification link copied to clipboard!');
  };

  if (loading) {
    return (
      <VerificationContainer>
        <VerificationCard>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p>Verifying certificate...</p>
          </div>
        </VerificationCard>
      </VerificationContainer>
    );
  }

  return (
    <VerificationContainer>
      <VerificationCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <StatusIcon valid={valid}>
          {valid ? <CheckCircle size={40} /> : <XCircle size={40} />}
        </StatusIcon>

        <StatusTitle valid={valid}>
          {valid ? 'Certificate Verified' : 'Certificate Invalid'}
        </StatusTitle>

        <StatusMessage>
          {valid 
            ? 'This certificate has been successfully verified and is authentic.'
            : 'This certificate could not be verified. It may be invalid or expired.'
          }
        </StatusMessage>

        {valid && certificate && (
          <>
            <CertificateDetails>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon>
                    <User size={20} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Participant</DetailLabel>
                    <DetailValue>{certificate.participantName}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <Mail size={20} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{certificate.participantEmail}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FileText size={20} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Event</DetailLabel>
                    <DetailValue>{certificate.eventTitle}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <Calendar size={20} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Date</DetailLabel>
                    <DetailValue>{new Date(certificate.eventDate).toLocaleDateString()}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <MapPin size={20} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Location</DetailLabel>
                    <DetailValue>{certificate.location}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <Award size={20} />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Certificate ID</DetailLabel>
                    <DetailValue>{certificate.certificateNumber}</DetailValue>
                  </DetailContent>
                </DetailItem>
              </DetailGrid>
            </CertificateDetails>

            <ActionButtons>
              <Button
                onClick={handleDownload}
                className="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
                Download Certificate
              </Button>

              <Button
                onClick={handleShare}
                className="secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={20} />
                Share
              </Button>

              <Button
                onClick={handleCopyLink}
                className="secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy size={20} />
                Copy Link
              </Button>
            </ActionButtons>

            <QRCodeSection>
              <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <QrCode size={20} />
                QR Code Verification
              </h3>
              
              <QRCodeContainer>
                <img 
                  src={certificate.qrCode} 
                  alt="QR Code" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </QRCodeContainer>

              <SecurityInfo>
                <SecurityTitle>
                  <Shield size={20} />
                  Security Features
                </SecurityTitle>
                <SecurityFeatures>
                  <SecurityFeature>
                    <CheckCircle size={16} />
                    Blockchain Verification
                  </SecurityFeature>
                  <SecurityFeature>
                    <CheckCircle size={16} />
                    Digital Signature
                  </SecurityFeature>
                  <SecurityFeature>
                    <CheckCircle size={16} />
                    QR Code Authentication
                  </SecurityFeature>
                  <SecurityFeature>
                    <CheckCircle size={16} />
                    Timestamp Validation
                  </SecurityFeature>
                </SecurityFeatures>
              </SecurityInfo>
            </QRCodeSection>
          </>
        )}
      </VerificationCard>
    </VerificationContainer>
  );
};

export default CertificateVerification;
