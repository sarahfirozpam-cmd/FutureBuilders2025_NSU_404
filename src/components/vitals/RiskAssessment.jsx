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
              label={results.riskLevel.toUpperCase()}
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
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Detected Risks */}
        {results.detectedRisks && results.detectedRisks.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Detected Issues:
            </Typography>
            {results.detectedRisks.map((risk, index) => (
              <Alert
                key={index}
                severity={risk.severity === 'critical' ? 'error' : 'warning'}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  <strong>{risk.type}:</strong> {risk.message.en || risk.message}
                </Typography>
              </Alert>
            ))}
          </Box>
        )}

        {/* Recommendations */}
        {results.recommendations && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('vitals.recommendations')}:
            </Typography>
            <List dense>
              {(results.recommendations.en || results.recommendations).map((rec, index) => (
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