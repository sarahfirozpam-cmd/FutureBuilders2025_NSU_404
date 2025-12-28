import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper
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
        zIndex: 1200, // Above content but below modals
        borderTop: 1,
        borderColor: 'divider'
      }} 
      elevation={8}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
        sx={{
          height: { xs: 56, sm: 64 },
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            padding: { xs: '6px 0', sm: '6px 12px' }
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: { xs: '0.625rem', sm: '0.75rem' },
            '&.Mui-selected': {
              fontSize: { xs: '0.625rem', sm: '0.75rem' }
            }
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