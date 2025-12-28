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
    { label: t('nav.visualScanner'), value: '/visual-scanner', icon: <ScannerIcon /> },
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
        overflowX: 'auto',
        overflowY: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: 3,
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
          height: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.3)',
          borderRadius: '4px'
        }
      }}
    >
      <BottomNavigation
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        showLabels
        sx={{
          minWidth: 'fit-content',
          width: 'max-content',
          display: 'flex',
          flexWrap: 'nowrap',
          '& .MuiBottomNavigationAction-root': {
            minWidth: '70px',
            maxWidth: '80px',
            padding: '6px 4px',
            flex: '0 0 auto',
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.6rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&.Mui-selected': {
                fontSize: '0.65rem'
              }
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.3rem'
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