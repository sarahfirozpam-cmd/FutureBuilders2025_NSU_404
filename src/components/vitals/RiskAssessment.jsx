import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const RiskAssessment = ({ results }) => {
  const { t } = useTranslation();
  const { language } = useTranslation().i18n;

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'moderate':
        return <WarningIcon color="warning" />;
      default:
        return <CheckIcon color="success" />;
    }
  };

  const getRiskLabel = (level) => {
    const labels = {
      high: { en: 'HIGH RISK', bn: 'উচ্চ ঝুঁকি' },
      moderate: { en: 'MODERATE RISK', bn: 'মাঝারি ঝুঁকি' },
      low: { en: 'LOW RISK', bn: 'কম ঝুঁকি' }
    };
    const lang = language === 'bn' ? 'bn' : 'en';
    return labels[level]?.[lang] || level.toUpperCase();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('vitals.riskAssessment')}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            {getRiskIcon(results.riskLevel)}
            <Typography variant="h5">
              {t('vitals.riskLevel')}: 
            </Typography>
            <Chip
              label={getRiskLabel(results.riskLevel)}
              color={getRiskColor(results.riskLevel)}
              size="medium"
            />
          </Stack>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Risk Score: {results.riskScore}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={results.riskScore}
            color={getRiskColor(results.riskLevel)}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {/* Detected Risks */}
        {results.detectedRisks && results.detectedRisks.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {language === 'bn' ? 'সনাক্ত সমস্যা:' : 'Detected Issues:'}
            </Typography>
            {results.detectedRisks.map((risk, index) => (
              <Alert
                key={index}
                severity={risk.severity === 'critical' || risk.severity === 'high' ? 'error' : 'warning'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  <strong>{risk.type}:</strong>{' '}
                  {risk.message[language === 'bn' ? 'bn' : 'en'] || risk.message.en}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}

        {/* No risks detected */}
        {(!results.detectedRisks || results.detectedRisks.length === 0) && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {language === 'bn' 
              ? 'আপনার ভাইটাল সাইন স্বাভাবিক সীমার মধ্যে রয়েছে।'
              : 'Your vital signs are within normal range.'
            }
          </Alert>
        )}

        {/* Recommendations */}
        {results.recommendations && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('vitals.recommendations')}:
            </Typography>
            <List dense>
              {(results.recommendations[language === 'bn' ? 'bn' : 'en'] || results.recommendations.en || []).map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <HeartIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
