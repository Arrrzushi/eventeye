import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, ArrowRight, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};

  svg {
    width: 48px;
    height: 48px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  padding-left: 3rem;
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

const InputIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  color: ${props => props.theme.colors.textLight};
  cursor: pointer;
  z-index: 1;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.gradientPrimary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const LinkText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textLight};
  margin-top: ${props => props.theme.spacing.lg};

  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  line-height: 1.5;

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      organization: formData.organization,
      phone: formData.phone
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <RegisterContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo>
        <Trophy />
        EventEye
      </Logo>
      
      <Title>Create Account</Title>
      <Subtitle>Join EventEye and start automating your certificates</Subtitle>

      <Form onSubmit={handleSubmit}>
        <FormRow>
          <InputGroup>
            <InputIcon>
              <User size={20} />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormRow>

        <FormRow>
          <InputGroup>
            <InputIcon>
              <Building size={20} />
            </InputIcon>
            <Input
              type="text"
              name="organization"
              placeholder="Organization"
              value={formData.organization}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Phone size={20} />
            </InputIcon>
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </InputGroup>
        </FormRow>

        <InputGroup>
          <InputIcon>
            <Lock size={20} />
          </InputIcon>
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </PasswordToggle>
        </InputGroup>

        <InputGroup>
          <InputIcon>
            <Lock size={20} />
          </InputIcon>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <PasswordToggle
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </PasswordToggle>
        </InputGroup>

        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
          <ArrowRight size={20} />
        </Button>
      </Form>

      <TermsText>
        By creating an account, you agree to our{' '}
        <a href="#" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </TermsText>

      <LinkText>
        Already have an account? <Link to="/login">Sign in here</Link>
      </LinkText>
    </RegisterContainer>
  );
};

export default Register;
