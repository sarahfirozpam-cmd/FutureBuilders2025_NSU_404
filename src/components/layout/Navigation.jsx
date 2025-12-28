import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box
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
    { label: t('nav.telemedicine'), value: '/telemedicine', icon: <TelemedicineIcon /> }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'background.paper',
        boxShadow: 3
      }}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
        sx={{
          width: '100%',
          '& .MuiBottomNavigationAction-root': {
            minWidth: { xs: '64px', sm: '80px' },
            padding: { xs: '6px 0', sm: '6px 12px' },
            '& .MuiBottomNavigationAction-label': {
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              '&.Mui-selected': {
                fontSize: { xs: '0.7rem', sm: '0.8rem' }
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
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
    </Box>
  );
};

export default Navigation;