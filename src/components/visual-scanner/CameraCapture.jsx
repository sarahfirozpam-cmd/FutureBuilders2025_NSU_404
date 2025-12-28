import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Stack,
  Alert,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  FlipCameraAndroid as FlipIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const CameraCapture = ({
  videoRef,
  isActive,
  error,
  hasPermission,
  facingMode,
  onStart,
  onStop,
  onCapture,
  onSwitch,
  isSupported
}) => {
  const { t } = useTranslation();

  if (!isSupported) {
    return (
      <Alert severity="error">
        {t('scanner.cameraNotSupported')}
      </Alert>
    );
  }

  if (hasPermission === false) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
            <Typography variant="h6" color="error">
              {t('scanner.permissionRequired')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {t('scanner.permissionMessage')}
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              {t('scanner.permissionInstructions')}
            </Typography>
            <Button variant="contained" onClick={onStart}>
              {t('scanner.retryCamera')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ position: 'relative', bgcolor: 'black' }}>
        {!isActive && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              bgcolor: 'rgba(0, 0, 0, 0.8)'
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress sx={{ color: 'white' }} />
              <Typography variant="body2" sx={{ color: 'white' }}>
                {t('scanner.initializingCamera')}
              </Typography>
            </Stack>
          </Box>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            display: 'block',
            minHeight: '400px'
          }}
        />

        {/* Frame Guide Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '60%',
            border: '3px dashed rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pb: 2
          }}
        >
          <Typography
            variant="caption"
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 1
            }}
          >
            {t('scanner.frameInstruction')}
          </Typography>
        </Box>

        {/* Camera Switch Button */}
        <IconButton
          onClick={onSwitch}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <FlipIcon />
        </IconButton>
      </Card>

      {/* Capture Controls */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<CameraIcon />}
          onClick={onCapture}
          sx={{ minWidth: 200 }}
        >
          {t('scanner.takePhoto')}
        </Button>
      </Stack>
    </Box>
  );
};

export default CameraCapture;
