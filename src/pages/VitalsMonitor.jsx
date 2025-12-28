import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { vitalsPredictor } from '../ai/vitalsPredictor';
import { useAppStore } from '../store/useAppStore';
import { syncService } from '../services/syncService';
import VitalsChart from '../components/vitals/VitalsChart';
import RiskAssessment from '../components/vitals/RiskAssessment';
import db from '../services/db';

const VitalsMonitor = () => {
  const { t } = useTranslation();
  const { addVitalsRecord } = useAppStore();
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    temperature: '',
    weight: '',
    age: ''
  });
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

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const { systolic, diastolic, pulse, temperature, age } = formData;

    if (!systolic || !diastolic || !pulse || !temperature || !age) {
      setError('Please fill in all required fields');
      return false;
    }

    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    const pul = parseFloat(pulse);
    const temp = parseFloat(temperature);
    const ageNum = parseFloat(age);

    if (sys < 50 || sys > 250) {
      setError('Systolic BP should be between 50-250 mmHg');
      return false;
    }

    if (dia < 30 || dia > 150) {
      setError('Diastolic BP should be between 30-150 mmHg');
      return false;
    }

    if (pul < 30 || pul > 200) {
      setError('Pulse should be between 30-200 bpm');
      return false;
    }

    if (temp < 35 || temp > 43) {
      setError('Temperature should be between 35-43°C');
      return false;
    }

    if (ageNum < 0 || ageNum > 120) {
      setError('Please enter a valid age');
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateForm()) {
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const vitalsData = {
        systolic: parseFloat(formData.systolic),
        diastolic: parseFloat(formData.diastolic),
        pulse: parseFloat(formData.pulse),
        temperature: parseFloat(formData.temperature),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        age: parseFloat(formData.age)
      };

      const prediction = await vitalsPredictor.predictRisk(vitalsData);

      if (prediction.success) {
        const resultData = {
          ...vitalsData,
          ...prediction,
          createdAt: new Date().toISOString()
        };

        setResults(resultData);
        addVitalsRecord(resultData);
        await syncService.syncVitals(resultData);
        await loadHistory(); // Refresh history
      } else {
        setError(prediction.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Vitals analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('vitals.title')}
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enter Vital Signs
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('vitals.bloodPressure')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('vitals.systolic')}
                    value={formData.systolic}
                    onChange={handleChange('systolic')}
                    placeholder="120"
                    InputProps={{
                      endAdornment: <Typography variant="caption">mmHg</Typography>
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('vitals.diastolic')}
                    value={formData.diastolic}
                    onChange={handleChange('diastolic')}
                    placeholder="80"
                    InputProps={{
                      endAdornment: <Typography variant="caption">mmHg</Typography>
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('vitals.pulse')}
                    value={formData.pulse}
                    onChange={handleChange('pulse')}
                    placeholder="72"
                    InputProps={{
                      endAdornment: <Typography variant="caption">bpm</Typography>
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('vitals.temperature')}
                    value={formData.temperature}
                    onChange={handleChange('temperature')}
                    placeholder="37.0"
                    InputProps={{
                      endAdornment: <Typography variant="caption">°C</Typography>
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={t('vitals.age')}
                    value={formData.age}
                    onChange={handleChange('age')}
                    placeholder="30"
                    InputProps={{
                      endAdornment: <Typography variant="caption">years</Typography>
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={`${t('vitals.weight')} (Optional)`}
                    value={formData.weight}
                    onChange={handleChange('weight')}
                    placeholder="65"
                    InputProps={{
                      endAdornment: <Typography variant="caption">kg</Typography>
                    }}
                  />
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                startIcon={analyzing ? <CircularProgress size={20} /> : <SendIcon />}
                onClick={handleAnalyze}
                disabled={analyzing}
                sx={{ mt: 3 }}
              >
                {analyzing ? 'Analyzing...' : t('vitals.submit')}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          {results ? (
            <RiskAssessment results={results} />
          ) : (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  Enter your vital signs to get an AI-powered risk assessment
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