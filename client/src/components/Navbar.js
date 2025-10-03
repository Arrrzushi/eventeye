import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Menu,
  X,
  Trophy,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.textLight};

  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }

  &.active {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.text};

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }

  &:first-child {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  padding: ${props => props.theme.spacing.sm};
  background: none;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    // Navigate to settings or show settings modal
    setShowUserMenu(false);
  };

  return (
    <NavbarContainer>
      <Logo
        onClick={() => navigate('/dashboard')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Trophy />
        EventEye
      </Logo>

      <NavItems>
        <NavItem
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy size={20} />
          Dashboard
        </NavItem>
        
        <NavItem
          onClick={() => navigate('/events')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy size={20} />
          Events
        </NavItem>
        
        <NavItem
          onClick={() => navigate('/certificates')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trophy size={20} />
          Certificates
        </NavItem>
      </NavItems>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <NavItem
          style={{ position: 'relative' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} />
          <NotificationBadge>3</NotificationBadge>
        </NavItem>

        <UserMenu>
          <UserButton
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={20} />
            {user?.name}
          </UserButton>

          {showUserMenu && (
            <DropdownMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownItem
                onClick={handleProfile}
                whileHover={{ x: 4 }}
              >
                <User size={16} />
                Profile
              </DropdownItem>
              
              <DropdownItem
                onClick={handleSettings}
                whileHover={{ x: 4 }}
              >
                <Settings size={16} />
                Settings
              </DropdownItem>
              
              <DropdownItem
                onClick={handleLogout}
                whileHover={{ x: 4 }}
                style={{ color: '#ef4444' }}
              >
                <LogOut size={16} />
                Logout
              </DropdownItem>
            </DropdownMenu>
          )}
        </UserMenu>

        <MobileMenuButton
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
