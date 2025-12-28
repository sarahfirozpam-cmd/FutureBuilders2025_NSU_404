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
  School as EducationIcon,
  Videocam as TelemedicineIcon,
  CameraAlt as ScannerIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navigationItems = [
    { label: t('nav.dashboard'), value: '/', icon: <DashboardIcon /> },
    { label: t('nav.symptomChecker'), value: '/symptom-checker', icon: <SymptomIcon /> },
    { label: t('nav.vitalsMonitor'), value: '/vitals', icon: <VitalsIcon /> },
    { label: t('nav.healthEducation'), value: '/education', icon: <EducationIcon /> },
    { label: t('nav.visualScanner'), value: '/visual-scanner', icon: <ScannerIcon /> },
    { label: t('nav.telemedicine'), value: '/telemedicine', icon: <TelemedicineIcon /> }
  ];

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar': {
          height: '3px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.2)',
          borderRadius: '3px'
        }
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
        sx={{
          width: 'auto',
          display: 'flex',
          flexWrap: 'nowrap',
          '& .MuiBottomNavigationAction-root': {
            minWidth: '60px',
            maxWidth: '85px',
            padding: '6px 2px',
            flex: '0 0 auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.55rem',
              whiteSpace: 'nowrap',
              '&.Mui-selected': {
                fontSize: '0.6rem'
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.1rem'
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