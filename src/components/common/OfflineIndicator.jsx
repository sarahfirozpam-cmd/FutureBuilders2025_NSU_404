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
          top: 64,
          left: 0,
          right: 0,
          zIndex: 1300,
          borderRadius: 0
        }}
      >
        {t('common.offline')} - Data will sync when connection is restored
      </Alert>
    </Slide>
  );
};

export default OfflineIndicator;