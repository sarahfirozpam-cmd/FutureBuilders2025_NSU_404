import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Card,
  CardContent,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Send as SendIcon, 
  Info as InfoIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const NORMAL_RANGES = {
  systolic: { min: 90, max: 120, warning: 140 },
  diastolic: { min: 60, max: 80, warning: 90 },
  pulse: { min: 60, max: 100, warning: 120 },
  temperature: { min: 36.1, max: 37.2, warning: 38 }
};

const VitalsForm = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    temperature: '',
    weight: '',
    age: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user types
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { systolic, diastolic, pulse, temperature, age } = formData;

    if (!systolic) newErrors.systolic = 'Required';
    else if (parseFloat(systolic) < 50 || parseFloat(systolic) > 250) {
      newErrors.systolic = '50-250 mmHg';
    }

    if (!diastolic) newErrors.diastolic = 'Required';
    else if (parseFloat(diastolic) < 30 || parseFloat(diastolic) > 150) {
      newErrors.diastolic = '30-150 mmHg';
    }

    if (!pulse) newErrors.pulse = 'Required';
    else if (parseFloat(pulse) < 30 || parseFloat(pulse) > 200) {
      newErrors.pulse = '30-200 bpm';
    }

    if (!temperature) newErrors.temperature = 'Required';
    else if (parseFloat(temperature) < 35 || parseFloat(temperature) > 43) {
      newErrors.temperature = '35-43°C';
    }

    if (!age) newErrors.age = 'Required';
    else if (parseFloat(age) < 0 || parseFloat(age) > 120) {
      newErrors.age = 'Invalid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        systolic: parseFloat(formData.systolic),
        diastolic: parseFloat(formData.diastolic),
        pulse: parseFloat(formData.pulse),
        temperature: parseFloat(formData.temperature),
        weight: formData.weight ? parseFloat(formData.weight) : null,
        age: parseFloat(formData.age)
      });
    }
  };

  const handleClear = () => {
    setFormData({
      systolic: '',
      diastolic: '',
      pulse: '',
      temperature: '',
      weight: '',
      age: ''
    });
    setErrors({});
  };

  const getFieldColor = (field, value) => {
    if (!value) return 'primary';
    const numValue = parseFloat(value);
    const range = NORMAL_RANGES[field];
    if (!range) return 'primary';
    
    if (numValue >= range.warning) return 'error';
    if (numValue > range.max || numValue < range.min) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('vitals.title')}
          </Typography>
          <IconButton size="small" onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {/* Blood Pressure */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('vitals.bloodPressure')}
              <Tooltip title="Normal: 90-120 / 60-80 mmHg">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('vitals.systolic')}
              value={formData.systolic}
              onChange={handleChange('systolic')}
              placeholder="120"
              error={!!errors.systolic}
              helperText={errors.systolic}
              color={getFieldColor('systolic', formData.systolic)}
              InputProps={{
                endAdornment: <InputAdornment position="end">mmHg</InputAdornment>
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
              error={!!errors.diastolic}
              helperText={errors.diastolic}
              color={getFieldColor('diastolic', formData.diastolic)}
              InputProps={{
                endAdornment: <InputAdornment position="end">mmHg</InputAdornment>
              }}
            />
          </Grid>

          {/* Pulse */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('vitals.pulse')}
              value={formData.pulse}
              onChange={handleChange('pulse')}
              placeholder="72"
              error={!!errors.pulse}
              helperText={errors.pulse}
              color={getFieldColor('pulse', formData.pulse)}
              InputProps={{
                endAdornment: <InputAdornment position="end">bpm</InputAdornment>
              }}
            />
          </Grid>

          {/* Temperature */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('vitals.temperature')}
              value={formData.temperature}
              onChange={handleChange('temperature')}
              placeholder="37.0"
              error={!!errors.temperature}
              helperText={errors.temperature}
              color={getFieldColor('temperature', formData.temperature)}
              InputProps={{
                endAdornment: <InputAdornment position="end">°C</InputAdornment>
              }}
            />
          </Grid>

          {/* Age and Weight */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('vitals.age')}
              value={formData.age}
              onChange={handleChange('age')}
              placeholder="30"
              error={!!errors.age}
              helperText={errors.age}
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('vitals.years')}</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('vitals.weight')}
              value={formData.weight}
              onChange={handleChange('weight')}
              placeholder="65"
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('vitals.kg')}</InputAdornment>
              }}
            />
          </Grid>
        </Grid>

        <Button
          fullWidth
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ mt: 3 }}
        >
          {isLoading ? 'Analyzing...' : t('vitals.submit')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VitalsForm;
