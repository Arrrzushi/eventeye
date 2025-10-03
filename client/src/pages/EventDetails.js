import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Award,
  Mail,
  Download,
  Eye,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  FileText
} from 'lucide-react';

const EventDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const EventHeader = styled.div`
  background: ${props => props.theme.colors.gradient};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: white;
  position: relative;
  overflow: hidden;
`;

const EventTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const EventMeta = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.125rem;
`;

const EventStatus = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing['2xl']};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing['2xl']};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${props => props.theme.spacing.md};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ParticipantsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParticipantName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ParticipantEmail = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const ParticipantStatus = styled.div`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return '#dcfce7';
      case 'sent': return '#dbeafe';
      case 'generated': return '#fef3c7';
      case 'pending': return '#f3f4f6';
      case 'failed': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'delivered': return '#166534';
      case 'sent': return '#1e40af';
      case 'generated': return '#92400e';
      case 'pending': return '#374151';
      case 'failed': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo
    const mockEvent = {
      id: id,
      title: 'Tech Conference 2024',
      description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Join industry leaders and innovators for a day of learning, networking, and inspiration.',
      status: 'active',
      eventDate: '2024-03-15T09:00:00',
      location: 'San Francisco Convention Center, CA',
      type: 'paid',
      price: 299,
      maxParticipants: 500,
      currentParticipants: 342,
      organizer: 'Tech Events Inc.',
      certificateTemplate: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        fontFamily: 'Arial',
        layout: 'classic'
      },
      participants: [
        { name: 'John Doe', email: 'john@example.com', status: 'delivered' },
        { name: 'Jane Smith', email: 'jane@example.com', status: 'sent' },
        { name: 'Bob Johnson', email: 'bob@example.com', status: 'generated' },
        { name: 'Alice Brown', email: 'alice@example.com', status: 'pending' },
        { name: 'Charlie Wilson', email: 'charlie@example.com', status: 'failed' }
      ],
      certificates: {
        generated: 298,
        sent: 285,
        delivered: 267,
        failed: 13
      }
    };
    
    setEvent(mockEvent);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'sent': return <Mail size={16} />;
      case 'generated': return <Award size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'failed': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleGenerateCertificates = () => {
    // Navigate to certificate generation
    console.log('Generate certificates for event:', event.id);
  };

  const handleSendCertificates = () => {
    // Navigate to certificate sending
    console.log('Send certificates for event:', event.id);
  };

  const handleAddParticipants = () => {
    // Navigate to add participants
    console.log('Add participants to event:', event.id);
  };

  return (
    <EventDetailsContainer>
      <Header>
        <BackButton
          onClick={() => navigate('/events')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Events
        </BackButton>
      </Header>

      <EventHeader>
        <EventTitle>{event.title}</EventTitle>
        <EventMeta>
          <MetaItem>
            <Calendar size={20} />
            {new Date(event.eventDate).toLocaleDateString()}
          </MetaItem>
          <MetaItem>
            <MapPin size={20} />
            {event.location}
          </MetaItem>
          <MetaItem>
            <Users size={20} />
            {event.currentParticipants}/{event.maxParticipants} participants
          </MetaItem>
          <MetaItem>
            <Award size={20} />
            {event.type === 'free' ? 'Free' : `$${event.price}`}
          </MetaItem>
        </EventMeta>
        <EventStatus>
          {getStatusIcon(event.status)}
          {event.status}
        </EventStatus>
      </EventHeader>

      <ContentGrid>
        <MainContent>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CardHeader>
              <CardTitle>
                <FileText size={20} />
                Event Description
              </CardTitle>
            </CardHeader>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              {event.description}
            </p>
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CardHeader>
              <CardTitle>
                <Users size={20} />
                Participants
              </CardTitle>
              <Button
                onClick={handleAddParticipants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
                Add Participants
              </Button>
            </CardHeader>
            <ParticipantsList>
              {event.participants.map((participant, index) => (
                <ParticipantItem key={index}>
                  <ParticipantInfo>
                    <ParticipantName>{participant.name}</ParticipantName>
                    <ParticipantEmail>{participant.email}</ParticipantEmail>
                  </ParticipantInfo>
                  <ParticipantStatus status={participant.status}>
                    {getStatusIcon(participant.status)}
                    {participant.status}
                  </ParticipantStatus>
                </ParticipantItem>
              ))}
            </ParticipantsList>
          </Card>
        </MainContent>

        <Sidebar>
          <Card
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CardHeader>
              <CardTitle>
                <BarChart3 size={20} />
                Certificate Stats
              </CardTitle>
            </CardHeader>
            <StatsGrid>
              <StatCard>
                <StatValue>{event.certificates.generated}</StatValue>
                <StatLabel>Generated</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{event.certificates.sent}</StatValue>
                <StatLabel>Sent</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{event.certificates.delivered}</StatValue>
                <StatLabel>Delivered</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{event.certificates.failed}</StatValue>
                <StatLabel>Failed</StatLabel>
              </StatCard>
            </StatsGrid>
          </Card>

          <Card
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <CardHeader>
              <CardTitle>
                <Award size={20} />
                Certificate Actions
              </CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button
                onClick={handleGenerateCertificates}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Award size={16} />
                Generate Certificates
              </Button>
              <Button
                onClick={handleSendCertificates}
                className="secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={16} />
                Send Certificates
              </Button>
              <Button
                className="secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                Download All
              </Button>
            </div>
          </Card>
        </Sidebar>
      </ContentGrid>
    </EventDetailsContainer>
  );
};

export default EventDetails;
