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
  Divider,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LocalHospital as HospitalIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AnalysisResult = ({ results, language }) => {
  const { t } = useTranslation();

  if (!results || !results.success) {
    return null;
  }

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

  const primary = results.primaryDiagnosis;

  return (
    <Stack spacing={3}>
      {/* Medical Disclaimer */}
      <Alert severity="error" icon={<WarningIcon />}>
        <Typography variant="subtitle2" gutterBottom>
          {t('scanner.disclaimer.title')}
        </Typography>
        <Typography variant="body2">
          {t('scanner.disclaimer.message')}
        </Typography>
      </Alert>

      {/* Primary Diagnosis */}
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            {getSeverityIcon(primary.severity)}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {primary.condition}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('scanner.confidence')}: {primary.confidence}%
              </Typography>
            </Box>
            <Chip
              label={primary.severity.toUpperCase()}
              color={getSeverityColor(primary.severity)}
            />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={primary.confidence}
            color={getSeverityColor(primary.severity)}
            sx={{ mb: 3, height: 8, borderRadius: 4 }}
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('scanner.about')}
            </Typography>
            <Typography variant="body2" paragraph>
              {primary.description[language] || primary.description.en}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('scanner.recommendations')}
            </Typography>
            <Typography variant="body2">
              {primary.advice[language] || primary.advice.en}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Other Possible Conditions */}
      {results.predictions && results.predictions.length > 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('scanner.otherPossibilities')}
            </Typography>
            <Typography variant="caption" color="text.secondary" paragraph>
              {t('scanner.otherPossibilitiesNote')}
            </Typography>

            <List>
              {results.predictions.slice(1).map((prediction, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {getSeverityIcon(prediction.severity)}
                    </ListItemIcon>
                    <ListItemText
                      primary={prediction.condition}
                      secondary={`${t('scanner.confidence')}: ${prediction.confidence}%`}
                    />
                  </ListItem>
                  {index < results.predictions.slice(1).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <InfoIcon color="info" />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('scanner.nextSteps.title')}
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary={t('scanner.nextSteps.step1')}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t('scanner.nextSteps.step2')}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t('scanner.nextSteps.step3')}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default AnalysisResult;
