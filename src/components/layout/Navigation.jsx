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
        overflow: 'auto'
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
          width: 'max-content',
          minWidth: '100%',
          '& .MuiBottomNavigationAction-root': {
            minWidth: { xs: '70px', sm: 'auto' },
            maxWidth: { xs: '90px', sm: '168px' },
            padding: { xs: '6px 4px', sm: '6px 12px' },
            fontSize: { xs: '0.6rem', sm: '0.75rem' },
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.6rem', sm: '0.75rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&.Mui-selected': {
                fontSize: { xs: '0.65rem', sm: '0.8rem' }
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
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