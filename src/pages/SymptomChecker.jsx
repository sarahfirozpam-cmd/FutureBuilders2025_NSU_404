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
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {t('symptoms.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('symptoms.description')}
        </Typography>
      </Box>

      {/* Visual Scanner Button */}
      <Card 
        sx={{ 
          mb: 3, 
          background: 'linear-gradient(135deg, #889063 0%, #CFBB99 100%)',
          border: '2px solid rgba(53, 64, 36, 0.12)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(76, 61, 25, 0.15)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: '#4C3D19',
                  fontWeight: 700
                }}
              >
                {t('scanner.title')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#354024' }}>
                {t('scanner.description')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CameraIcon />}
              onClick={() => navigate('/visual-scanner')}
              size="large"
              sx={{ 
                whiteSpace: 'nowrap',
                background: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
                color: '#E5D7C4',
                fontWeight: 600,
                px: 3,
                py: 1.5
              }}
            >
              {t('scanner.startScanning')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
                '& fieldset': {
                  borderColor: '#889063',
                  borderWidth: 2
                },
                '&:hover fieldset': {
                  borderColor: '#354024'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#354024'
                }
              }
            }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              startIcon={analyzing ? <CircularProgress size={20} sx={{ color: '#E5D7C4' }} /> : <SendIcon />}
              onClick={handleAnalyze}
              disabled={analyzing || !symptoms.trim()}
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
                color: '#E5D7C4'
              }}
            >
              {analyzing ? t('symptoms.analyzing') : t('common.submit')}
            </Button>

            {isSupported && (
              <IconButton
                color={isListening ? 'error' : 'primary'}
                onClick={startListening}
                disabled={analyzing}
                sx={{
                  border: 2,
                  borderColor: isListening ? 'error.main' : '#354024',
                  width: 56,
                  height: 56,
                  bgcolor: isListening ? 'rgba(211, 47, 47, 0.1)' : 'rgba(53, 64, 36, 0.08)',
                  '&:hover': {
                    bgcolor: isListening ? 'rgba(211, 47, 47, 0.2)' : 'rgba(53, 64, 36, 0.15)'
                  }
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
      <Paper 
        sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, rgba(136, 144, 99, 0.15) 0%, rgba(207, 187, 153, 0.2) 100%)',
          border: '2px solid rgba(53, 64, 36, 0.15)',
          mt: 3,
          borderRadius: 3
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <InfoIcon sx={{ color: '#354024', fontSize: '1.5rem' }} />
          <Box>
            <Typography variant="body2" sx={{ color: '#4C3D19', fontWeight: 500 }}>
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