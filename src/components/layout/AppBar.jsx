import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { LocalHospital as HealthIcon } from '@mui/icons-material';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const AppBar = () => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  return (
    <MuiAppBar position="fixed" elevation={2}>
      <Toolbar>
        <HealthIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rural Health AI
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            size="small"
            label={isOnline ? t('common.online') : t('common.offline')}
            color={isOnline ? 'success' : 'warning'}
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              fontSize: '0.75rem'
            }}
          />
          <LanguageSwitcher />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
