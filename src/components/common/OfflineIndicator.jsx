import React from 'react';
import { Alert, Slide } from '@mui/material';
import { WifiOff as OfflineIcon } from '@mui/icons-material';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useTranslation } from 'react-i18next';

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  return (
    <Slide direction="down" in={!isOnline} mountOnEnter unmountOnExit>
      <Alert
        icon={<OfflineIcon />}
        severity="warning"
        sx={{
          position: 'fixed',
          top: { xs: 64, sm: 70 },
          left: 0,
          right: 0,
          zIndex: 1300,
          borderRadius: 0,
          background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
          color: '#fff',
          fontWeight: 600,
          '& .MuiAlert-icon': {
            color: '#fff'
          }
        }}
      >
        {t('common.offline')} - Data will sync when connection is restored
      </Alert>
    </Slide>
  );
};

export default OfflineIndicator;