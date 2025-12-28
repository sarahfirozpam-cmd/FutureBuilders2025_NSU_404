import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { vitalsPredictor } from '../ai/vitalsPredictor';
import { useAppStore } from '../store/useAppStore';
import { syncService } from '../services/syncService';
import VitalsForm from '../components/vitals/VitalsForm';
import VitalsChart from '../components/vitals/VitalsChart';
import RiskAssessment from '../components/vitals/RiskAssessment';
import db from '../services/db';

const VitalsMonitor = () => {
  const { t } = useTranslation();
  const { addVitalsRecord, language } = useAppStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const vitalsHistory = await db.vitals
        .orderBy('createdAt')
        .reverse()
        .limit(10)
        .toArray();
      setHistory(vitalsHistory);
    } catch (err) {
      console.error('Error loading vitals history:', err);
    }
  };

  const handleAnalyze = async (vitalsData) => {
    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const prediction = await vitalsPredictor.predictRisk(vitalsData);

      if (prediction.success) {
        const resultData = {
          ...vitalsData,
          ...prediction,
          createdAt: new Date().toISOString()
        };

        setResults(resultData);
        addVitalsRecord(resultData);
        await syncService.syncVitalsRecord(resultData);
        await loadHistory(); // Refresh history
      } else {
        setError(prediction.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Vitals analysis error:', err);
      setError(language === 'bn' 
        ? 'বিশ্লেষণের সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
        : 'An error occurred during analysis. Please try again.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('vitals.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <VitalsForm onSubmit={handleAnalyze} isLoading={analyzing} />
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          {results ? (
            <RiskAssessment results={results} />
          ) : (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="body1" color="text.secondary" align="center">
                  {language === 'bn' 
                    ? 'এআই-চালিত ঝুঁকি মূল্যায়ন পেতে আপনার ভাইটাল সাইন লিখুন'
                    : 'Enter your vital signs to get an AI-powered risk assessment'
                  }
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* History Chart */}
        {history.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('vitals.history')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <VitalsChart data={history} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default VitalsMonitor;
