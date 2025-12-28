import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import {
  LocalHospital as HealthIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';

const AppBar = () => {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={{
        background: darkMode
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
        borderBottom: darkMode
          ? '1px solid rgba(136, 144, 99, 0.2)'
          : '1px solid rgba(229, 215, 196, 0.1)'
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
        <Tooltip title={darkMode ? t('lightMode', 'Light Mode') : t('darkMode', 'Dark Mode')}>
          <IconButton
            onClick={toggleDarkMode}
            sx={{
              mr: 1,
              color: 'inherit',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(180deg)'
              }
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        <LanguageSwitcher />
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;