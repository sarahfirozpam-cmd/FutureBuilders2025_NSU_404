import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon
} from '@mui/icons-material';
import { useVoiceInput } from '../../hooks/useVoiceInput';

const VoiceInput = ({ language, onTranscript, disabled = false }) => {
  const {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceInput(language);

  React.useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
      resetTranscript();
    }
  }, [transcript, onTranscript, resetTranscript]);

  if (!isSupported) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        color={isListening ? 'error' : 'primary'}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        sx={{
          border: 2,
          borderColor: isListening ? 'error.main' : 'primary.main',
          width: 56,
          height: 56,
          position: 'relative'
        }}
      >
        {isListening ? (
          <>
            <MicIcon />
            <CircularProgress
              size={56}
              sx={{
                position: 'absolute',
                color: 'error.main'
              }}
            />
          </>
        ) : (
          <MicIcon />
        )}
      </IconButton>

      {isListening && (
        <Paper
          elevation={2}
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'error.main',
              animation: 'pulse 1s infinite'
            }}
          />
          <Typography variant="body2">
            {language === 'bn' ? 'শুনছি...' : 'Listening...'}
          </Typography>
        </Paper>
      )}

      {error && (
        <Chip
          label={error}
          color="error"
          size="small"
          onDelete={resetTranscript}
        />
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Box>
  );
};

export default VoiceInput;
