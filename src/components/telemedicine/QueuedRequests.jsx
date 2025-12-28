import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Divider,
  Box,
  Button
} from '@mui/material';
import { Refresh as SyncIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const QueuedRequests = ({ consultations, onSync }) => {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  const getStatusColor = (status) => {
    switch (status) {
      case 'synced':
        return 'success';
      case 'syncing':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'warning';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const pendingCount = consultations.filter(c => !c.synced).length;

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">
            {t('telemedicine.queuedRequests')}
            {pendingCount > 0 && (
              <Chip
                label={pendingCount}
                size="small"
                color="warning"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          {pendingCount > 0 && isOnline && (
            <Button
              size="small"
              startIcon={<SyncIcon />}
              onClick={onSync}
            >
              Sync Now
            </Button>
          )}
        </Stack>

        {consultations.length > 0 ? (
          <List disablePadding>
            {consultations.map((consultation, index) => (
              <React.Fragment key={consultation.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ px: 0 }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle2">
                          Request #{consultations.length - index}
                        </Typography>
                        <Chip
                          label={consultation.priority}
                          size="small"
                          color={getPriorityColor(consultation.priority)}
                        />
                        <Chip
                          label={t(`telemedicine.status.${consultation.status}`) || consultation.status}
                          size="small"
                          color={getStatusColor(consultation.status)}
                        />
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {consultation.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(consultation.timestamp), 'PPpp')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < consultations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ py: 4 }}
          >
            No consultation requests yet
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default QueuedRequests;
