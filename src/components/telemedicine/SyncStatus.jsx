import React from 'react';
import { Box, Chip, CircularProgress, Typography, Stack } from '@mui/material';
import {
  CloudDone as SyncedIcon,
  CloudOff as OfflineIcon,
  CloudSync as SyncingIcon
} from '@mui/icons-material';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useAppStore } from '../../store/useAppStore';
import { format } from 'date-fns';

const SyncStatus = () => {
  const isOnline = useOnlineStatus();
  const { isSyncing, lastSyncTime, queuedConsultations } = useAppStore();

  const pendingCount = queuedConsultations.filter(c => !c.synced).length;

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <OfflineIcon />,
        label: 'Offline',
        color: 'warning',
        description: 'Changes will sync when online'
      };
    }

    if (isSyncing) {
      return {
        icon: <CircularProgress size={16} />,
        label: 'Syncing...',
        color: 'info',
        description: 'Syncing data with server'
      };
    }

    if (pendingCount > 0) {
      return {
        icon: <SyncingIcon />,
        label: `${pendingCount} pending`,
        color: 'warning',
        description: 'Some data needs to be synced'
      };
    }

    return {
      icon: <SyncedIcon />,
      label: 'Synced',
      color: 'success',
      description: lastSyncTime 
        ? `Last synced: ${format(new Date(lastSyncTime), 'HH:mm')}`
        : 'All data is synced'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        variant="outlined"
      />
      <Typography variant="caption" color="text.secondary">
        {statusInfo.description}
      </Typography>
    </Box>
  );
};

export default SyncStatus;
