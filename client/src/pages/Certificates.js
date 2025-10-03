import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Award,
  Search,
  Filter,
  Download,
  Mail,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Calendar,
  User,
  FileText
} from 'lucide-react';

const CertificatesContainer = styled.div`
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

const SearchAndFilters = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
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

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textLight};
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
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

const CertificatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const CertificateCard = styled(motion.div)`
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

const CertificateHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CertificateInfo = styled.div`
  flex: 1;
`;

const CertificateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  line-height: 1.4;
`;

const CertificateId = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textLight};
  font-family: monospace;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CertificateStatus = styled.div`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const CertificateDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textLight};
  font-size: 0.875rem;
`;

const CertificateActions = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.textLight};
`;

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    // Mock data for demo
    const mockCertificates = [
      {
        id: '1',
        certificateId: 'CERT-ABC123-XYZ789',
        participantName: 'John Doe',
        participantEmail: 'john@example.com',
        eventTitle: 'Tech Conference 2024',
        eventDate: '2024-03-15',
        status: 'delivered',
        generatedAt: '2024-03-15T10:30:00',
        deliveredAt: '2024-03-15T10:35:00'
      },
      {
        id: '2',
        certificateId: 'CERT-DEF456-UVW012',
        participantName: 'Jane Smith',
        participantEmail: 'jane@example.com',
        eventTitle: 'Digital Marketing Workshop',
        eventDate: '2024-02-20',
        status: 'sent',
        generatedAt: '2024-02-20T14:15:00',
        deliveredAt: null
      },
      {
        id: '3',
        certificateId: 'CERT-GHI789-RST345',
        participantName: 'Bob Johnson',
        participantEmail: 'bob@example.com',
        eventTitle: 'Data Science Bootcamp',
        eventDate: '2024-04-10',
        status: 'generated',
        generatedAt: '2024-04-10T09:45:00',
        deliveredAt: null
      },
      {
        id: '4',
        certificateId: 'CERT-JKL012-MNO678',
        participantName: 'Alice Brown',
        participantEmail: 'alice@example.com',
        eventTitle: 'Tech Conference 2024',
        eventDate: '2024-03-15',
        status: 'failed',
        generatedAt: '2024-03-15T11:20:00',
        deliveredAt: null
      }
    ];
    setCertificates(mockCertificates);
  }, []);

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

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownload = (certificateId) => {
    console.log('Download certificate:', certificateId);
  };

  const handleView = (certificateId) => {
    console.log('View certificate:', certificateId);
  };

  const handleResend = (certificateId) => {
    console.log('Resend certificate:', certificateId);
  };

  return (
    <CertificatesContainer>
      <Header>
        <Title>
          <Award size={32} />
          Certificates
        </Title>
      </Header>

      <SearchAndFilters>
        <SearchInput>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <Input
            type="text"
            placeholder="Search certificates by name, email, event, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterButton
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={16} />
          All Status
        </FilterButton>
        <FilterButton
          active={statusFilter === 'delivered'}
          onClick={() => setStatusFilter('delivered')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle size={16} />
          Delivered
        </FilterButton>
        <FilterButton
          active={statusFilter === 'sent'}
          onClick={() => setStatusFilter('sent')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mail size={16} />
          Sent
        </FilterButton>
        <FilterButton
          active={statusFilter === 'failed'}
          onClick={() => setStatusFilter('failed')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AlertCircle size={16} />
          Failed
        </FilterButton>
      </SearchAndFilters>

      {filteredCertificates.length > 0 ? (
        <CertificatesGrid>
          {filteredCertificates.map((certificate, index) => (
            <CertificateCard
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <CertificateHeader>
                <CertificateInfo>
                  <CertificateTitle>{certificate.participantName}</CertificateTitle>
                  <CertificateId>{certificate.certificateId}</CertificateId>
                  <CertificateStatus status={certificate.status}>
                    {getStatusIcon(certificate.status)}
                    {certificate.status}
                  </CertificateStatus>
                </CertificateInfo>
              </CertificateHeader>

              <CertificateDetails>
                <DetailItem>
                  <User size={16} />
                  {certificate.participantEmail}
                </DetailItem>
                <DetailItem>
                  <Calendar size={16} />
                  {new Date(certificate.eventDate).toLocaleDateString()}
                </DetailItem>
                <DetailItem>
                  <FileText size={16} />
                  {certificate.eventTitle}
                </DetailItem>
                <DetailItem>
                  <Clock size={16} />
                  {new Date(certificate.generatedAt).toLocaleDateString()}
                </DetailItem>
              </CertificateDetails>

              <CertificateActions>
                <ActionButton
                  onClick={() => handleView(certificate.certificateId)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} />
                  View
                </ActionButton>
                
                <ActionButton
                  onClick={() => handleDownload(certificate.certificateId)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  Download
                </ActionButton>
                
                {certificate.status === 'failed' && (
                  <ActionButton
                    onClick={() => handleResend(certificate.certificateId)}
                    className="primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail size={16} />
                    Resend
                  </ActionButton>
                )}
              </CertificateActions>
            </CertificateCard>
          ))}
        </CertificatesGrid>
      ) : (
        <EmptyState>
          <Award size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No certificates found</h3>
          <p>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Generate certificates for your events to see them here'
            }
          </p>
        </EmptyState>
      )}
    </CertificatesContainer>
  );
};

export default Certificates;
