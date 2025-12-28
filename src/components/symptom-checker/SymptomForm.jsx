import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  InputAdornment
} from '@mui/material';
import { Send as SendIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import VoiceInput from './VoiceInput';

const QUICK_SYMPTOMS = {
  en: ['fever', 'cough', 'headache', 'diarrhea', 'vomiting', 'body ache', 'fatigue'],
  bn: ['জ্বর', 'কাশি', 'মাথাব্যথা', 'ডায়রিয়া', 'বমি', 'শরীর ব্যথা', 'ক্লান্তি']
};

const SymptomForm = ({ onSubmit, isLoading, language }) => {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const handleQuickSymptomClick = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleVoiceTranscript = (transcript) => {
    setSymptoms(prev => prev ? `${prev}, ${transcript}` : transcript);
  };

  const handleSubmit = () => {
    const allSymptoms = [
      ...selectedSymptoms,
      ...symptoms.split(',').map(s => s.trim()).filter(s => s)
    ];

    if (allSymptoms.length > 0) {
      onSubmit(allSymptoms.join(', '));
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setSelectedSymptoms([]);
  };

  const quickSymptoms = QUICK_SYMPTOMS[language] || QUICK_SYMPTOMS.en;

  return (
    <Box>
      {/* Quick symptom selection */}
      <Typography variant="subtitle2" gutterBottom>
        {language === 'bn' ? 'দ্রুত নির্বাচন:' : 'Quick Select:'}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        {quickSymptoms.map((symptom) => (
          <Chip
            key={symptom}
            label={symptom}
            onClick={() => handleQuickSymptomClick(symptom)}
            color={selectedSymptoms.includes(symptom) ? 'primary' : 'default'}
            variant={selectedSymptoms.includes(symptom) ? 'filled' : 'outlined'}
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      {/* Selected symptoms */}
      {selectedSymptoms.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {language === 'bn' ? 'নির্বাচিত:' : 'Selected:'}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedSymptoms.map((symptom) => (
              <Chip
                key={symptom}
                label={symptom}
                onDelete={() => handleRemoveSymptom(symptom)}
                color="primary"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Text input */}
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label={t('symptoms.inputPlaceholder')}
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        disabled={isLoading}
        placeholder={language === 'bn' 
          ? 'যেমন, জ্বর, কাশি, মাথাব্যথা...'
          : 'e.g., fever, cough, headache...'
        }
        InputProps={{
          endAdornment: symptoms && (
            <InputAdornment position="end">
              <Button
                size="small"
                onClick={handleClear}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />

      {/* Actions */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={isLoading || (symptoms.trim() === '' && selectedSymptoms.length === 0)}
          sx={{ flex: 1 }}
        >
          {isLoading 
            ? (language === 'bn' ? 'বিশ্লেষণ করা হচ্ছে...' : 'Analyzing...') 
            : t('common.submit')
          }
        </Button>

        <VoiceInput
          language={language}
          onTranscript={handleVoiceTranscript}
          disabled={isLoading}
        />
      </Stack>
    </Box>
  );
};

export default SymptomForm;
