import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Certificates from './pages/Certificates';
import CertificateVerification from './pages/CertificateVerification';
import Profile from './pages/Profile';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Theme
const theme = {
  colors: {
    primary: '#2563eb',
    primaryDark: '#1e40af',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientPrimary: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  margin-left: ${props => props.isAuthenticated ? '280px' : '0'};
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: ${props => props.theme.spacing.md};
  }
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.gradient};
  padding: ${props => props.theme.spacing.lg};
`;

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthContainer>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:certificateId" element={<CertificateVerification />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthContainer>
    );
  }

  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Sidebar />
        <ContentArea isAuthenticated={isAuthenticated}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify/:certificateId" element={<CertificateVerification />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
