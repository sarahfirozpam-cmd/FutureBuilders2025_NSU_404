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
        zIndex: 1200,
        background: 'rgba(207, 187, 153, 0.98)',
        borderTop: '2px solid rgba(53, 64, 36, 0.12)',
        boxShadow: '0 -2px 12px rgba(76, 61, 25, 0.1)'
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
            minWidth: 0,
            padding: { xs: '8px 4px', sm: '10px 12px' },
            color: '#4C3D19',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(53, 64, 36, 0.06)'
            },
            '&.Mui-selected': {
              color: '#354024',
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.1)'
              }
            }
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            fontWeight: 600,
            '&.Mui-selected': {
              fontSize: { xs: '0.7rem', sm: '0.8rem' }
            }
          },
          '& .MuiSvgIcon-root': {
            fontSize: { xs: '1.5rem', sm: '1.7rem' },
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