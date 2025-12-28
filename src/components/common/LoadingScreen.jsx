import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E5D7C4 0%, #CFBB99 100%)'
      }}
    >
      <CircularProgress 
        size={60} 
        sx={{ 
          color: '#354024',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round'
          }
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 3,
          color: '#4C3D19',
          fontWeight: 600,
          letterSpacing: '0.02em'
        }}
      >
        Loading GramSheba AI...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;