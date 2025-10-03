import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Mail,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Activity,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled(motion.div)`
  background: ${props => props.theme.colors.gradient};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
  font-weight: 500;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.875rem;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.error};
  font-weight: 600;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const RecentActivity = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const ActivityTime = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const ActivityStatus = styled.div`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.color || props.theme.colors.primary};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.textLight};
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 12,
    totalParticipants: 1247,
    certificatesSent: 1156,
    successRate: 98.5
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'certificate',
      title: 'Certificate sent to John Doe',
      time: '2 minutes ago',
      status: 'delivered',
      statusColor: '#10b981'
    },
    {
      id: 2,
      type: 'event',
      title: 'New event "Tech Conference 2024" created',
      time: '1 hour ago',
      status: 'active',
      statusColor: '#2563eb'
    },
    {
      id: 3,
      type: 'bulk',
      title: 'Bulk email sent to 150 participants',
      time: '3 hours ago',
      status: 'completed',
      statusColor: '#10b981'
    },
    {
      id: 4,
      type: 'certificate',
      title: 'Certificate generation failed for Jane Smith',
      time: '5 hours ago',
      status: 'failed',
      statusColor: '#ef4444'
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'certificate':
        return <Award size={20} />;
      case 'event':
        return <Calendar size={20} />;
      case 'bulk':
        return <Mail size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'certificate':
        return '#8b5cf6';
      case 'event':
        return '#2563eb';
      case 'bulk':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  return (
    <DashboardContainer>
      <WelcomeSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle>
            <Trophy size={48} />
            Welcome back, {user?.name}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Your certificate automation system is running smoothly. 
            Here's what's happening with your events today.
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeSection>

      <QuickStats>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <StatHeader>
            <StatIcon color="#2563eb">
              <Calendar size={24} />
            </StatIcon>
            <StatChange positive>
              <TrendingUp size={16} />
              +12%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalEvents}</StatValue>
          <StatLabel>Total Events</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <StatHeader>
            <StatIcon color="#10b981">
              <Users size={24} />
            </StatIcon>
            <StatChange positive>
              <TrendingUp size={16} />
              +8%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.totalParticipants.toLocaleString()}</StatValue>
          <StatLabel>Total Participants</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <StatHeader>
            <StatIcon color="#8b5cf6">
              <Award size={24} />
            </StatIcon>
            <StatChange positive>
              <TrendingUp size={16} />
              +15%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.certificatesSent.toLocaleString()}</StatValue>
          <StatLabel>Certificates Sent</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <StatHeader>
            <StatIcon color="#f59e0b">
              <CheckCircle size={24} />
            </StatIcon>
            <StatChange positive>
              <TrendingUp size={16} />
              +2%
            </StatChange>
          </StatHeader>
          <StatValue>{stats.successRate}%</StatValue>
          <StatLabel>Success Rate</StatLabel>
        </StatCard>
      </QuickStats>

      <ChartsSection>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <ChartHeader>
            <ChartTitle>
              <BarChart3 size={20} />
              Certificate Delivery Trends
            </ChartTitle>
          </ChartHeader>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            📊 Chart visualization would go here
            <br />
            <small>Integration with Recharts for beautiful data visualization</small>
          </div>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ChartHeader>
            <ChartTitle>
              <Activity size={20} />
              Recent Activity
            </ChartTitle>
          </ChartHeader>
          <RecentActivity>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <ActivityIcon color={getActivityColor(activity.type)}>
                    {getActivityIcon(activity.type)}
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                  <ActivityStatus color={activity.statusColor}>
                    {activity.status}
                  </ActivityStatus>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <Clock size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No recent activity</p>
              </EmptyState>
            )}
          </RecentActivity>
        </ChartCard>
      </ChartsSection>
    </DashboardContainer>
  );
};

export default Dashboard;
