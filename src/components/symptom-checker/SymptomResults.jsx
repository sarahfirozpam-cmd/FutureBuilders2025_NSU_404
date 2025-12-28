import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const SymptomResults = ({ results, language }) => {
  const { t } = useTranslation();

  if (!results || !results.success) {
    return null;
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'severe':
        return <ErrorIcon color="error" />;
      case 'moderate':
        return <WarningIcon color="warning" />;
      default:
        return <CheckIcon color="success" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe':
        return 'error';
      case 'moderate':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getTriageAlert = (triage) => {
    switch (triage) {
      case 'urgent':
        return (
          <Alert severity="error" icon={<ErrorIcon />}>
            {t('symptoms.triage.urgent')}
          </Alert>
        );
      case 'soon':
        return (
          <Alert severity="warning" icon={<WarningIcon />}>
            {t('symptoms.triage.soon')}
          </Alert>
        );
      default:
        return (
          <Alert severity="info" icon={<CheckIcon />}>
            {t('symptoms.triage.self-care')}
          </Alert>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t('symptoms.results')}
      </Typography>

      {/* Triage Alert */}
      <Box sx={{ mb: 3 }}>
        {getTriageAlert(results.triage)}
      </Box>

      {/* Primary Diagnosis */}
      {results.primaryDiagnosis && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              {getSeverityIcon(results.primaryDiagnosis.severity)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">
                  {results.primaryDiagnosis.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('symptoms.confidence')}: {results.primaryDiagnosis.confidence}%
                </Typography>
              </Box>
              <Chip
                label={results.primaryDiagnosis.severity}
                color={getSeverityColor(results.primaryDiagnosis.severity)}
                size="small"
              />
            </Stack>

            <LinearProgress
              variant="determinate"
              value={results.primaryDiagnosis.confidence}
              color={getSeverityColor(results.primaryDiagnosis.severity)}
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              {t('symptoms.advice')}:
            </Typography>
            <Typography variant="body2" paragraph>
              {results.primaryDiagnosis.advice}
            </Typography>

            {results.primaryDiagnosis.matchedSymptoms && 
             results.primaryDiagnosis.matchedSymptoms.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Matched Symptoms:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {results.primaryDiagnosis.matchedSymptoms.map((symptom, index) => (
                    <Chip
                      key={index}
                      label={symptom}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Other Possible Conditions */}
      {results.possibleConditions && results.possibleConditions.length > 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('symptoms.possibleConditions')}
            </Typography>
            <List>
              {results.possibleConditions.slice(1, 4).map((condition, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {getSeverityIcon(condition.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={condition.name[language] || condition.name.en}
                      secondary={`Confidence: ${Math.round(condition.confidence * 100)}%`}
                    />
                  </ListItem>
                  {index < results.possibleConditions.slice(1, 4).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SymptomResults;
