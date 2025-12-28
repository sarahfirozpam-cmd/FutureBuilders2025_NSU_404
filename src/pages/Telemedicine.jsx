import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import db from '../services/db';
import { syncService } from '../services/syncService';
import ConsultationRequest from '../components/telemedicine/ConsultationRequest';
import QueuedRequests from '../components/telemedicine/QueuedRequests';
import SyncStatus from '../components/telemedicine/SyncStatus';

const Telemedicine = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { queuedConsultations, addConsultation, language } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setSuccessMessage(null);

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

      // Reload consultations
      await loadConsultations();

      setSuccessMessage(
        language === 'bn'
          ? 'পরামর্শ অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!'
          : 'Consultation request submitted successfully!'
      );

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error submitting consultation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSync = async () => {
    if (!isOnline) {
      return;
    }

    await syncService.syncConsultations();
    await loadConsultations();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          {t('telemedicine.title')}
        </Typography>
        <SyncStatus />
      </Box>

      {!isOnline && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('telemedicine.offlineNote')}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Request Form */}
        <Grid item xs={12} md={6}>
          <ConsultationRequest 
            onSubmit={handleSubmit} 
            isLoading={submitting} 
          />
        </Grid>

        {/* Queued Requests */}
        <Grid item xs={12} md={6}>
          <QueuedRequests 
            consultations={consultations}
            onSync={handleSync}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Telemedicine;
