import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Palette,
  Save,
  ArrowLeft,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CreateEventContainer = styled.div`
  max-width: 800px;
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
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

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.theme.colors.surface};
  resize: vertical;
  min-height: 120px;

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

const ColorPicker = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
`;

const ColorInput = styled.input`
  width: 50px;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  background: none;
`;

const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.color};
  border: 2px solid ${props => props.theme.colors.border};
`;

const FileUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.background};
  }
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.textLight};
  margin-top: ${props => props.theme.spacing.sm};
`;

const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-top: ${props => props.theme.spacing.md};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};

  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing['2xl']};
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.secondary {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    border: 2px solid ${props => props.theme.colors.border};

    &:hover {
      background: ${props => props.theme.colors.background};
      border-color: ${props => props.theme.colors.primary};
    }
  }

  &.primary {
    background: ${props => props.theme.colors.gradientPrimary};
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: ${props => props.theme.shadows.lg};
    }
  }
`;

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    type: 'free',
    price: 0,
    maxParticipants: 100,
    certificateTemplate: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      fontFamily: 'Arial',
      layout: 'classic'
    }
  });
  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('certificateTemplate.')) {
      const templateKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        certificateTemplate: {
          ...prev.certificateTemplate,
          [templateKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const removeFile = (type) => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[type];
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Event data:', formData);
    console.log('Uploaded files:', uploadedFiles);
    
    // For demo purposes, just navigate back to events
    navigate('/events');
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <CreateEventContainer>
      <Header>
        <BackButton
          onClick={() => navigate('/events')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Events
        </BackButton>
        <Title>Create New Event</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>
            <Calendar size={20} />
            Event Details
          </SectionTitle>
          
          <FormRow>
            <InputGroup>
              <Label>Event Title *</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Event Date *</Label>
              <Input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormRow>

          <InputGroup>
            <Label>Description *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              required
            />
          </InputGroup>

          <FormRow>
            <InputGroup>
              <Label>Location *</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event location"
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Event Type *</Label>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="free">Free Event</option>
                <option value="paid">Paid Event</option>
              </Select>
            </InputGroup>
          </FormRow>

          {formData.type === 'paid' && (
            <FormRow>
              <InputGroup>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </InputGroup>
              
              <InputGroup>
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                />
              </InputGroup>
            </FormRow>
          )}
        </FormSection>

        <FormSection>
          <SectionTitle>
            <Palette size={20} />
            Certificate Template
          </SectionTitle>
          
          <FormRow>
            <InputGroup>
              <Label>Primary Color</Label>
              <ColorPicker>
                <ColorInput
                  type="color"
                  name="certificateTemplate.primaryColor"
                  value={formData.certificateTemplate.primaryColor}
                  onChange={handleChange}
                />
                <ColorPreview color={formData.certificateTemplate.primaryColor} />
              </ColorPicker>
            </InputGroup>
            
            <InputGroup>
              <Label>Secondary Color</Label>
              <ColorPicker>
                <ColorInput
                  type="color"
                  name="certificateTemplate.secondaryColor"
                  value={formData.certificateTemplate.secondaryColor}
                  onChange={handleChange}
                />
                <ColorPreview color={formData.certificateTemplate.secondaryColor} />
              </ColorPicker>
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <Label>Font Family</Label>
              <Select
                name="certificateTemplate.fontFamily"
                value={formData.certificateTemplate.fontFamily}
                onChange={handleChange}
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </Select>
            </InputGroup>
            
            <InputGroup>
              <Label>Layout Style</Label>
              <Select
                name="certificateTemplate.layout"
                value={formData.certificateTemplate.layout}
                onChange={handleChange}
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
              </Select>
            </InputGroup>
          </FormRow>

          <InputGroup>
            <Label>Background Image</Label>
            <FileUpload onClick={() => document.getElementById('background-upload').click()}>
              <Upload size={32} style={{ color: '#64748b', margin: '0 auto' }} />
              <UploadText>
                Click to upload background image
                <br />
                <small>PNG, JPG up to 5MB</small>
              </UploadText>
            </FileUpload>
            <input
              id="background-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'background')}
            />
            {uploadedFiles.background && (
              <UploadedFile>
                <span>{uploadedFiles.background.name}</span>
                <RemoveButton onClick={() => removeFile('background')}>
                  <X size={16} />
                </RemoveButton>
              </UploadedFile>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Logo</Label>
            <FileUpload onClick={() => document.getElementById('logo-upload').click()}>
              <Upload size={32} style={{ color: '#64748b', margin: '0 auto' }} />
              <UploadText>
                Click to upload logo
                <br />
                <small>PNG, JPG up to 2MB</small>
              </UploadText>
            </FileUpload>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'logo')}
            />
            {uploadedFiles.logo && (
              <UploadedFile>
                <span>{uploadedFiles.logo.name}</span>
                <RemoveButton onClick={() => removeFile('logo')}>
                  <X size={16} />
                </RemoveButton>
              </UploadedFile>
            )}
          </InputGroup>
        </FormSection>

        <ButtonGroup>
          <Button
            type="button"
            onClick={handleCancel}
            className="secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save size={20} />
            Create Event
          </Button>
        </ButtonGroup>
      </Form>
    </CreateEventContainer>
  );
};

export default CreateEvent;
