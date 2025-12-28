import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import {
  Mic as MicIcon,
  Send as SendIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CameraAlt as CameraIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { symptomAnalyzer } from '../ai/symptomAnalyzer';
import { useAppStore } from '../store/useAppStore';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { syncService } from '../services/syncService';
import SymptomResults from '../components/symptom-checker/SymptomResults';

const SymptomChecker = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, addSymptomRecord } = useAppStore();
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    resetTranscript
  } = useVoiceInput(language);

  // Update text field when voice input is received
  React.useEffect(() => {
    if (transcript) {
      setSymptoms(prev => prev ? `${prev}, ${transcript}` : transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError(t('symptoms.inputPlaceholder'));
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const analysis = await symptomAnalyzer.analyzeSymptoms(symptoms, language);

      if (analysis.success) {
        setResults(analysis);
        
        // Save to store and sync
        addSymptomRecord(analysis);
        await syncService.syncSymptomAnalysis(analysis);
      } else {
        setError(analysis.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('symptoms.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('symptoms.description')}
      </Typography>

      {/* Visual Scanner Button */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {t('scanner.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('scanner.description')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CameraIcon />}
              onClick={() => navigate('/visual-scanner')}
              size="large"
              sx={{ whiteSpace: 'nowrap' }}
            >
              {t('scanner.startScanning')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label={t('symptoms.inputPlaceholder')}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={analyzing}
            placeholder="e.g., fever, cough, headache, body ache..."
          />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={analyzing ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={handleAnalyze}
              disabled={analyzing || !symptoms.trim()}
              fullWidth
            >
              {analyzing ? t('symptoms.analyzing') : t('common.submit')}
            </Button>

            {isSupported && (
              <IconButton
                color={isListening ? 'error' : 'primary'}
                onClick={startListening}
                disabled={analyzing}
                sx={{
                  border: 1,
                  borderColor: isListening ? 'error.main' : 'primary.main'
                }}
              >
                <MicIcon />
              </IconButton>
            )}
          </Stack>

          {isListening && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Listening... Speak now
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && <SymptomResults results={results} language={language} />}

      {/* Information Box */}
      <Paper sx={{ p: 2, bgcolor: 'info.light', mt: 3 }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <InfoIcon color="info" />
          <Box>
            <Typography variant="body2" color="text.primary">
              <strong>Note:</strong> This tool provides general health information and is not a 
              substitute for professional medical advice. Always consult with a healthcare provider 
              for accurate diagnosis and treatment.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SymptomChecker;