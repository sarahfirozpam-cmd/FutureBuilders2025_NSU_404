import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as SyncIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import db from '../services/db';
import { syncService } from '../services/syncService';
import { format } from 'date-fns';

const Telemedicine = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { queuedConsultations, addConsultation } = useAppStore();
  const [formData, setFormData] = useState({
    description: '',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const allConsultations = await db.consultations
        .orderBy('timestamp')
        .reverse()
        .limit(20)
        .toArray();
      setConsultations(allConsultations);
    } catch (error) {
      console.error('Error loading consultations:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.description.trim()) {
      alert('Please describe your concern');
      return;
    }

    setSubmitting(true);

    try {
      const consultation = {
        id: Date.now().toString(),
        description: formData.description,
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        status: isOnline ? 'syncing' : 'queued',
        synced: false
      };

      // Save to IndexedDB
      await db.consultations.add(consultation);

      // Add to queue
      addConsultation(consultation);

      // Try to sync if online
      if (isOnline) {
        await syncService.syncConsultations();
      }

      // Reset form
      setFormData({ description: '', priority: 'medium' });

      // Reload consultations
      await loadConsultations();

      alert('Consultation request submitted successfully!');
    } catch (error) {
      console.error('Error submitting consultation:', error);
      alert('Failed to submit consultation request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      alert('You are offline. Please connect to the internet to sync.');
      return;
    }

    await syncService.syncConsultations();
    await loadConsultations();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced':
        return 'success';
      case 'syncing':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('telemedicine.title')}
      </Typography>

      {!isOnline && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('telemedicine.offlineNote')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Request Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('telemedicine.requestConsultation')}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                label={t('telemedicine.description')}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Please describe your symptoms or health concern in detail..."
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>{t('telemedicine.priority')}</InputLabel>
                <Select
                  value={formData.priority}
                  label={t('telemedicine.priority')}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
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
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Queued Requests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">
                  {t('telemedicine.queuedRequests')}
                </Typography>
                {queuedConsultations.length > 0 && isOnline && (
                  <Button
                    size="small"
                    startIcon={<SyncIcon />}
                    onClick={handleSync}
                  >
                    Sync Now
                  </Button>
                )}
              </Stack>

              {consultations.length > 0 ? (
                <List>
                  {consultations.map((consultation, index) => (
                    <React.Fragment key={consultation.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle2">
                                Request #{consultations.length - index}
                              </Typography>
                              <Chip
                                label={consultation.priority}
                                size="small"
                                color={getPriorityColor(consultation.priority)}
                              />
                              <Chip
                                label={consultation.status}
                                size="small"
                                color={getStatusColor(consultation.status)}
                              />
                            </Stack>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ mt: 1 }}
                              >
                                {consultation.description.substring(0, 100)}
                                {consultation.description.length > 100 ? '...' : ''}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(consultation.timestamp), 'PPpp')}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < consultations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No consultation requests yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Telemedicine;