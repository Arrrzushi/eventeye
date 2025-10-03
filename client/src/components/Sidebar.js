import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Award,
  BarChart3,
  Settings,
  Users,
  FileText,
  Mail,
  QrCode
} from 'lucide-react';

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 80px;
  width: 280px;
  height: calc(100vh - 80px);
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  z-index: 50;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const MenuItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.textLight};
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
  }

  &.active {
    background: ${props => props.theme.colors.gradientPrimary};
    color: white;
    box-shadow: ${props => props.theme.shadows.md};

    svg {
      color: white;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    transition: color 0.2s ease;
  }
`;

const QuickActions = styled.div`
  background: ${props => props.theme.colors.gradient};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  color: white;
`;

const QuickActionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const QuickActionButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: white;
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatsCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'Events', path: '/events' },
        { icon: Award, label: 'Certificates', path: '/certificates' }
      ]
    },
    {
      section: 'Analytics',
      items: [
        { icon: BarChart3, label: 'Reports', path: '/reports' },
        { icon: Users, label: 'Participants', path: '/participants' },
        { icon: FileText, label: 'Templates', path: '/templates' }
      ]
    },
    {
      section: 'Tools',
      items: [
        { icon: QrCode, label: 'QR Scanner', path: '/scanner' },
        { icon: Mail, label: 'Email Center', path: '/email' },
        { icon: Settings, label: 'Settings', path: '/settings' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-event':
        navigate('/events/create');
        break;
      case 'bulk-email':
        navigate('/email');
        break;
      case 'verify-certificate':
        navigate('/scanner');
        break;
      default:
        break;
    }
  };

  return (
    <SidebarContainer
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <QuickActions>
        <QuickActionTitle>Quick Actions</QuickActionTitle>
        <QuickActionButton
          onClick={() => handleQuickAction('create-event')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Create Event
        </QuickActionButton>
        <QuickActionButton
          onClick={() => handleQuickAction('bulk-email')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Mail size={18} />
          Send Emails
        </QuickActionButton>
        <QuickActionButton
          onClick={() => handleQuickAction('verify-certificate')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <QrCode size={18} />
          Verify Certificate
        </QuickActionButton>
      </QuickActions>

      {menuItems.map((section, sectionIndex) => (
        <SidebarSection key={sectionIndex}>
          <SectionTitle>{section.section}</SectionTitle>
          {section.items.map((item, itemIndex) => (
            <MenuItem
              key={itemIndex}
              className={isActive(item.path) ? 'active' : ''}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon />
              {item.label}
            </MenuItem>
          ))}
        </SidebarSection>
      ))}

      <StatsCard>
        <StatItem>
          <StatLabel>Total Events</StatLabel>
          <StatValue>12</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Certificates Sent</StatLabel>
          <StatValue>1,247</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Success Rate</StatLabel>
          <StatValue>98.5%</StatValue>
        </StatItem>
      </StatsCard>
    </SidebarContainer>
  );
};

export default Sidebar;
