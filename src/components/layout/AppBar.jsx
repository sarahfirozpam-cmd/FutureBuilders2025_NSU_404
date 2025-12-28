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
    <MuiAppBar position="fixed" elevation={2}>
      <Toolbar>
        <HealthIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Rural Health AI
        </Typography>
        <LanguageSwitcher />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;