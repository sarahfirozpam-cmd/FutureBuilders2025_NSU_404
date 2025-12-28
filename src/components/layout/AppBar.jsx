import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import { LocalHospital as HealthIcon } from '@mui/icons-material';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const AppBar = () => {
  const { t } = useTranslation();

  return (
    <MuiAppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
        borderBottom: '1px solid rgba(229, 215, 196, 0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
        <HealthIcon sx={{ mr: 2, fontSize: '2rem' }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.02em',
            fontSize: { xs: '1.1rem', sm: '1.3rem' }
          }}
        >
          GramSheba AI
        </Typography>
        <LanguageSwitcher />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;