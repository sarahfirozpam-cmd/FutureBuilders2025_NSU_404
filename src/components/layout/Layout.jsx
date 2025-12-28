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
        pb: 0,
        position: 'relative'
      }}
    >
      <AppBar />
      <OfflineIndicator />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          pt: { xs: 9, sm: 10 },
          pb: { xs: 9, sm: 10 },
          px: { xs: 2, sm: 3 },
          overflowX: 'hidden',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Container>
      <Navigation />
    </Box>
  );
};

export default Layout;