import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Plus,
  Calendar,
  Users,
  Award,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const CreateButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
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
`;

const Filters = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const EventCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const EventHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  line-height: 1.4;
`;

const EventStatus = styled.div`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#dcfce7';
      case 'completed': return '#dbeafe';
      case 'draft': return '#fef3c7';
      case 'cancelled': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#166534';
      case 'completed': return '#1e40af';
      case 'draft': return '#92400e';
      case 'cancelled': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const EventDescription = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.lg};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
`;

const EventStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const EventActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }

  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};

    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
`;

const MoreButton = styled(motion.button)`
  padding: ${props => props.theme.spacing.sm};
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.textLight};
`;

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState([]);

  // Mock data for demo
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
        status: 'active',
        eventDate: '2024-03-15',
        location: 'San Francisco, CA',
        type: 'paid',
        price: 299,
        maxParticipants: 500,
        currentParticipants: 342,
        certificatesGenerated: 298,
        certificatesSent: 285
      },
      {
        id: '2',
        title: 'Digital Marketing Workshop',
        description: 'Learn the fundamentals of digital marketing and social media strategies.',
        status: 'completed',
        eventDate: '2024-02-20',
        location: 'New York, NY',
        type: 'free',
        price: 0,
        maxParticipants: 100,
        currentParticipants: 95,
        certificatesGenerated: 95,
        certificatesSent: 95
      },
      {
        id: '3',
        title: 'Data Science Bootcamp',
        description: 'Intensive 5-day bootcamp covering machine learning, data analysis, and visualization.',
        status: 'draft',
        eventDate: '2024-04-10',
        location: 'Austin, TX',
        type: 'paid',
        price: 599,
        maxParticipants: 50,
        currentParticipants: 0,
        certificatesGenerated: 0,
        certificatesSent: 0
      }
    ];
    setEvents(mockEvents);
  }, []);

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true;
    return event.status === activeFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'draft': return <Clock size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleGenerateCertificates = (eventId) => {
    // Navigate to certificate generation
    navigate(`/events/${eventId}/certificates`);
  };

  const handleSendCertificates = (eventId) => {
    // Navigate to certificate sending
    navigate(`/events/${eventId}/send`);
  };

  return (
    <EventsContainer>
      <Header>
        <Title>
          <Calendar size={32} />
          My Events
        </Title>
        <CreateButton
          onClick={handleCreateEvent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Create Event
        </CreateButton>
      </Header>

      <Filters>
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Events
        </FilterButton>
        <FilterButton
          active={activeFilter === 'active'}
          onClick={() => setActiveFilter('active')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Active
        </FilterButton>
        <FilterButton
          active={activeFilter === 'completed'}
          onClick={() => setActiveFilter('completed')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Completed
        </FilterButton>
        <FilterButton
          active={activeFilter === 'draft'}
          onClick={() => setActiveFilter('draft')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Drafts
        </FilterButton>
      </Filters>

      {filteredEvents.length > 0 ? (
        <EventsGrid>
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <EventHeader>
                <div>
                  <EventTitle>{event.title}</EventTitle>
                  <EventStatus status={event.status}>
                    {getStatusIcon(event.status)}
                    {event.status}
                  </EventStatus>
                </div>
                <MoreButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreVertical size={20} />
                </MoreButton>
              </EventHeader>

              <EventDescription>{event.description}</EventDescription>

              <EventDetails>
                <EventDetail>
                  <Calendar size={16} />
                  {new Date(event.eventDate).toLocaleDateString()}
                </EventDetail>
                <EventDetail>
                  <Users size={16} />
                  {event.location}
                </EventDetail>
                <EventDetail>
                  <Award size={16} />
                  {event.type === 'free' ? 'Free' : `$${event.price}`}
                </EventDetail>
                <EventDetail>
                  <Users size={16} />
                  {event.currentParticipants}/{event.maxParticipants}
                </EventDetail>
              </EventDetails>

              <EventStats>
                <Stat>
                  <StatValue>{event.certificatesGenerated}</StatValue>
                  <StatLabel>Generated</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{event.certificatesSent}</StatValue>
                  <StatLabel>Sent</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>
                    {event.certificatesGenerated > 0 
                      ? Math.round((event.certificatesSent / event.certificatesGenerated) * 100)
                      : 0}%
                  </StatValue>
                  <StatLabel>Success</StatLabel>
                </Stat>
              </EventStats>

              <EventActions>
                <ActionButton
                  onClick={() => handleViewEvent(event.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} />
                  View
                </ActionButton>
                
                {event.status === 'active' && (
                  <ActionButton
                    onClick={() => handleGenerateCertificates(event.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="primary"
                  >
                    <Award size={16} />
                    Generate
                  </ActionButton>
                )}
                
                {event.certificatesGenerated > 0 && (
                  <ActionButton
                    onClick={() => handleSendCertificates(event.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail size={16} />
                    Send
                  </ActionButton>
                )}
              </EventActions>
            </EventCard>
          ))}
        </EventsGrid>
      ) : (
        <EmptyState>
          <Calendar size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No events found</h3>
          <p>Create your first event to get started with certificate automation</p>
          <CreateButton
            onClick={handleCreateEvent}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={20} />
            Create Your First Event
          </CreateButton>
        </EmptyState>
      )}
    </EventsContainer>
  );
};

export default Events;
