import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Paper,
  Stack
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { symptomAnalyzer } from '../ai/symptomAnalyzer';
import { useAppStore } from '../store/useAppStore';
import { syncService } from '../services/syncService';
import SymptomForm from '../components/symptom-checker/SymptomForm';
import SymptomResults from '../components/symptom-checker/SymptomResults';

const SymptomChecker = () => {
  const { t } = useTranslation();
  const { language, addSymptomRecord } = useAppStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (symptomsText) => {
    if (!symptomsText.trim()) {
      setError(t('symptoms.inputPlaceholder'));
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const analysis = await symptomAnalyzer.analyzeSymptoms(symptomsText, language);

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
        {t('symptoms.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('symptoms.description')}
      </Typography>

      {/* Input Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <SymptomForm 
            onSubmit={handleAnalyze}
            isLoading={analyzing}
            language={language}
          />

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
              {language === 'bn' ? (
                <>
                  <strong>দ্রষ্টব্য:</strong> এই টুলটি সাধারণ স্বাস্থ্য তথ্য প্রদান করে এবং পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।
                  সঠিক রোগ নির্ণয় এবং চিকিৎসার জন্য সর্বদা একজন স্বাস্থ্যসেবা প্রদানকারীর সাথে পরামর্শ করুন।
                </>
              ) : (
                <>
                  <strong>Note:</strong> This tool provides general health information and is not a 
                  substitute for professional medical advice. Always consult with a healthcare provider 
                  for accurate diagnosis and treatment.
                </>
              )}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SymptomChecker;
