import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Trophy, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled(motion.div)`
  width: 100%;
  max-width: 400px;
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.lg} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  span {
    padding: 0 ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.textLight};
    font-size: 0.875rem;
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

const DemoCredentials = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@eventeye.com',
      password: 'demo123'
    });
  };

  return (
    <LoginContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo>
        <Trophy />
        EventEye
      </Logo>
      
      <Title>Welcome Back</Title>
      <Subtitle>Sign in to your EventEye account</Subtitle>

      <DemoCredentials>
        <strong>Demo Credentials:</strong><br />
        Email: demo@eventeye.com<br />
        Password: demo123<br />
        <button 
          onClick={fillDemoCredentials}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#2563eb', 
            cursor: 'pointer',
            textDecoration: 'underline',
            marginTop: '0.5rem'
          }}
        >
          Click to fill demo credentials
        </button>
      </DemoCredentials>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <InputIcon>
            <Mail size={20} />
          </InputIcon>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <InputIcon>
            <Lock size={20} />
          </InputIcon>
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
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

        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
          <ArrowRight size={20} />
        </Button>
      </Form>

      <Divider>
        <span>or</span>
      </Divider>

      <LinkText>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </LinkText>
    </LoginContainer>
  );
};

export default Login;
