import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as SymptomIcon,
  FavoriteOutlined as VitalsIcon,
  CameraAlt as ScannerIcon,
  School as EducationIcon,
  Videocam as TelemedicineIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const navigationItems = [
    {
      label: t('nav.dashboard'),
      value: '/',
      icon: <DashboardIcon />
    },
    {
      label: t('nav.symptomChecker'),
      value: '/symptom-checker',
      icon: <SymptomIcon />
    },
    {
      label: t('nav.vitalsMonitor'),
      value: '/vitals',
      icon: <VitalsIcon />
    },
    {
      label: t('nav.visualScanner'),
      value: '/visual-scanner',
      icon: <ScannerIcon />
    },
    {
      label: t('nav.healthEducation'),
      value: '/education',
      icon: <EducationIcon />
    }
  ];

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        background: isDark
          ? 'rgba(30, 30, 30, 0.98)'
          : 'rgba(207, 187, 153, 0.98)',
        borderTop: isDark
          ? '2px solid rgba(136, 144, 99, 0.2)'
          : '2px solid rgba(53, 64, 36, 0.12)',
        boxShadow: isDark
          ? '0 -2px 12px rgba(0, 0, 0, 0.3)'
          : '0 -2px 12px rgba(76, 61, 25, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      elevation={0}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
        sx={{
          height: { xs: 64, sm: 72 },
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: { xs: 0, sm: 60 },
            maxWidth: { xs: 80, sm: 168 },
            padding: { xs: '6px 2px', sm: '10px 12px' },
            color: isDark ? '#CFBB99' : '#4C3D19',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: isDark
                ? 'rgba(136, 144, 99, 0.1)'
                : 'rgba(53, 64, 36, 0.06)'
            },
            '&.Mui-selected': {
              color: isDark ? '#889063' : '#354024',
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)'
              }
            }
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: { xs: '0.6rem', sm: '0.8rem' },
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '&.Mui-selected': {
              fontSize: { xs: '0.6rem', sm: '0.8rem' }
            }
          },
          '& .MuiSvgIcon-root': {
            fontSize: { xs: '1.3rem', sm: '1.7rem' },
            transition: 'transform 0.3s ease'
          }
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;