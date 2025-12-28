import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Stack,
  IconButton,
  CardMedia
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Close as CloseIcon,
  Refresh as RetryIcon,
  Save as SaveIcon,
  PhotoLibrary as GalleryIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useCamera } from '../hooks/useCamera';
import { skinAnalyzer } from '../ai/skinAnalyzer';
import { useAppStore } from '../store/useAppStore';
import CameraCapture from '../components/visual-scanner/CameraCapture';
import AnalysisResult from '../components/visual-scanner/AnalysisResult';
import db from '../services/db';

const VisualScanner = () => {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [step, setStep] = useState('intro'); // intro, camera, preview, analyzing, results
  const [capturedImageData, setCapturedImageData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const {
    videoRef,
    isActive,
    error: cameraError,
    hasPermission,
    facingMode,
    capturedImage,
    isSupported,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    clearImage
  } = useCamera();

  useEffect(() => {
    // Preload the model when component mounts
    skinAnalyzer.loadModel();

    return () => {
      // Cleanup camera on unmount
      stopCamera();
    };
  }, [stopCamera]);

  const handleStartScanning = () => {
    setStep('camera');
    startCamera();
  };

  const handleUploadFromGallery = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImageData(e.target.result);
        setStep('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    const imageData = capturePhoto();
    if (imageData) {
      setCapturedImageData(imageData);
      setStep('preview');
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImageData(null);
    clearImage();
    setStep('camera');
    startCamera();
  };

  const handleAnalyze = async () => {
    if (!capturedImageData) {
      setError('No image to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStep('analyzing');

    try {
      // Create an image element from the captured data
      const img = new Image();
      img.src = capturedImageData;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Analyze the image
      const analysisResults = await skinAnalyzer.analyzeImage(img);

      if (analysisResults.success) {
        setResults(analysisResults);
        setStep('results');

        // Save to database
        await db.predictions.add({
          type: 'skin_analysis',
          input: capturedImageData,
          output: analysisResults,
          timestamp: new Date().toISOString()
        });
      } else {
        setError(analysisResults.error || 'Analysis failed');
        setStep('preview');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis. Please try again.');
      setStep('preview');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep('intro');
    setCapturedImageData(null);
    setResults(null);
    setError(null);
    clearImage();
    stopCamera();
  };

  // Intro Screen
  if (step === 'intro') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {t('scanner.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('scanner.description')}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('scanner.howItWorks')}
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={2}>
                    <Typography
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      1
                    </Typography>
                    <Typography variant="body1">
                      {t('scanner.step1')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      2
                    </Typography>
                    <Typography variant="body1">
                      {t('scanner.step2')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      3
                    </Typography>
                    <Typography variant="body1">
                      {t('scanner.step3')}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Alert severity="warning">
                <Typography variant="body2">
                  {t('scanner.importantNote')}
                </Typography>
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<CameraIcon />}
                onClick={handleStartScanning}
                disabled={!isSupported}
              >
                {t('scanner.startScanning')}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GalleryIcon />}
                component="label"
              >
                {t('scanner.uploadFromGallery')}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUploadFromGallery}
                />
              </Button>

              {!isSupported && (
                <Alert severity="error">
                  {t('scanner.cameraNotSupported')}
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Alert severity="info">
          <Typography variant="body2">
            {t('scanner.privacyNote')}
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Camera Screen
  if (step === 'camera') {
    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">
            {t('scanner.takePhoto')}
          </Typography>
          <IconButton onClick={handleReset}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <CameraCapture
          videoRef={videoRef}
          isActive={isActive}
          error={cameraError}
          hasPermission={hasPermission}
          facingMode={facingMode}
          onStart={startCamera}
          onStop={stopCamera}
          onCapture={handleCapture}
          onSwitch={switchCamera}
          isSupported={isSupported}
        />
      </Box>
    );
  }

  // Preview Screen
  if (step === 'preview') {
    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">
            {t('scanner.reviewPhoto')}
          </Typography>
          <IconButton onClick={handleReset}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={capturedImageData}
                alt="Captured skin condition"
                sx={{
                  maxHeight: 500,
                  objectFit: 'contain',
                  bgcolor: 'black'
                }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('scanner.readyToAnalyze')}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('scanner.analyzeDescription')}
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {t('scanner.analyzeNow')}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RetryIcon />}
                    onClick={handleRetake}
                  >
                    {t('scanner.retakePhoto')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Analyzing Screen
  if (step === 'analyzing') {
    return (
      <Box>
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                {t('scanner.analyzing')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('scanner.analyzingMessage')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Results Screen
  if (step === 'results') {
    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">
            {t('scanner.results')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RetryIcon />}
            onClick={handleReset}
          >
            {t('scanner.scanAnother')}
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {/* Captured Image */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                image={capturedImageData}
                alt="Analyzed skin condition"
                sx={{
                  maxHeight: 400,
                  objectFit: 'contain',
                  bgcolor: 'black'
                }}
              />
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {t('scanner.capturedImage')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Analysis Results */}
          <Grid item xs={12} md={8}>
            <AnalysisResult results={results} language={language} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return null;
};

export default VisualScanner;
