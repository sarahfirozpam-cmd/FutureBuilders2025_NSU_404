import React from 'react';
import { Box, Container } from '@mui/material';
import AppBar from './AppBar';
import Navigation from './Navigation';
import OfflineIndicator from '../common/OfflineIndicator';

const Layout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        pb: 0 // Remove bottom padding from main container
      }}
    >
      <AppBar />
      <OfflineIndicator />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          pt: { xs: 9, sm: 10 }, // Top padding for AppBar (64px + margin)
          pb: { xs: 9, sm: 10 }, // Bottom padding for Navigation (56px + margin)
          px: { xs: 2, sm: 3 },
          overflowX: 'hidden',
          width: '100%'
        }}
      >
        {children}
      </Container>
      <Navigation />
    </Box>
  );
};

export default Layout;