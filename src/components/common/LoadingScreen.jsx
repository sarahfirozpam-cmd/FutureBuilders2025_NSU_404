import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { LocalHospital as HealthIcon } from '@mui/icons-material';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          gap: 3
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            mb: 2
          }}
        >
          <HealthIcon sx={{ fontSize: 40 }} />
        </Box>
        <CircularProgress size={48} thickness={4} />
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          Rural Health AI
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;
