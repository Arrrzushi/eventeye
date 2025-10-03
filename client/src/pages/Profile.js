import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Building,
  Phone,
  Save,
  Camera,
  Bell,
  Shield,
  Palette,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: ${props => props.theme.colors.gradient};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.lg};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarIcon = styled.div`
  font-size: 3rem;
  color: white;
`;

const CameraIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
`;

const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const UserEmail = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
`;

const Form = styled.form`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.md};
`;

const FormSection = styled.div`
  margin-bottom: ${props => props.theme.spacing['2xl']};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.surface};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.surface};
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.colors.primary};
`;

const CheckboxLabel = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const CheckboxDescription = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  margin-left: ${props => props.theme.spacing.sm};
`;

const Button = styled(motion.button)`
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || '',
    phone: user?.phone || '',
    emailSettings: {
      notifications: true,
      deliveryReports: true
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('emailSettings.')) {
      const settingKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emailSettings: {
          ...prev.emailSettings,
          [settingKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        // Profile updated successfully
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <Header>
        <Avatar>
          <AvatarIcon>
            <User size={48} />
          </AvatarIcon>
          <CameraIcon>
            <Camera size={16} />
          </CameraIcon>
        </Avatar>
        <UserName>{user?.name}</UserName>
        <UserEmail>{user?.email}</UserEmail>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>
            <User size={20} />
            Personal Information
          </SectionTitle>
          
          <FormRow>
            <InputGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Email Address *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <Label>Organization</Label>
              <Input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your organization"
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </InputGroup>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <Bell size={20} />
            Email Preferences
          </SectionTitle>
          
          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="emailSettings.notifications"
                checked={formData.emailSettings.notifications}
                onChange={handleChange}
              />
              <CheckboxLabel>Event Notifications</CheckboxLabel>
              <CheckboxDescription>
                Receive notifications about your events and certificate status
              </CheckboxDescription>
            </CheckboxItem>
            
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="emailSettings.deliveryReports"
                checked={formData.emailSettings.deliveryReports}
                onChange={handleChange}
              />
              <CheckboxLabel>Delivery Reports</CheckboxLabel>
              <CheckboxDescription>
                Get reports on certificate delivery status and failures
              </CheckboxDescription>
            </CheckboxItem>
          </CheckboxGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <Shield size={20} />
            Account Security
          </SectionTitle>
          
          <FormRow>
            <InputGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
              />
            </InputGroup>
            
            <InputGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
              />
            </InputGroup>
          </FormRow>
        </FormSection>

        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </ProfileContainer>
  );
};

export default Profile;
