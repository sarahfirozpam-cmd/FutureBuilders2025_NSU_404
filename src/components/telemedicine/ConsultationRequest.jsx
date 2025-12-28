import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const ConsultationRequest = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const [formData, setFormData] = useState({
    description: '',
    priority: 'medium'
  });
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      setError(t('telemedicine.description') + ' is required');
      return;
    }

    setError(null);
    onSubmit(formData);
    setFormData({ description: '', priority: 'medium' });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('telemedicine.requestConsultation')}
        </Typography>

        {!isOnline && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {t('telemedicine.offlineNote')}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={6}
          label={t('telemedicine.description')}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Please describe your symptoms or health concern in detail..."
          sx={{ mb: 2 }}
          error={!!error}
          helperText={error}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t('telemedicine.priority')}</InputLabel>
          <Select
            value={formData.priority}
            label={t('telemedicine.priority')}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <MenuItem value="low">{t('telemedicine.priorities.low')}</MenuItem>
            <MenuItem value="medium">{t('telemedicine.priorities.medium')}</MenuItem>
            <MenuItem value="high">{t('telemedicine.priorities.high')}</MenuItem>
            <MenuItem value="urgent">{t('telemedicine.priorities.urgent')}</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsultationRequest;
