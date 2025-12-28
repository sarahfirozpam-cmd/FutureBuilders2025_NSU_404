import React from 'react';
import { Box, Container } from '@mui/material';
import AppBar from './AppBar';
import Navigation from './Navigation';
import OfflineIndicator from '../common/OfflineIndicator';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar />
      <OfflineIndicator />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 3,
          mt: 8 // Account for AppBar height
        }}
      >
        {children}
      </Container>
      <Navigation />
    </Box>
  );
};

export default Layout;