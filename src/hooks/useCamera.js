import { useState, useRef, useCallback, useEffect } from 'react';

export const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [capturedImage, setCapturedImage] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if camera is supported
    setIsSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
  }, []);

  // Restart camera when facingMode changes
  useEffect(() => {
    if (isActive) {
      startCamera();
    }
  }, [facingMode]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays after setting srcObject
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.warn('Autoplay prevented, user interaction needed:', playError);
        }
      }
      
      setIsActive(true);
      setHasPermission(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message);
      setHasPermission(false);
      setIsActive(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) {
      setError('Camera not active');
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      
      return imageData;
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture photo');
      return null;
    }
  }, []);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  const clearImage = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return {
    videoRef,
    isActive,
    error,
    hasPermission,
    facingMode,
    capturedImage,
    isSupported,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    clearImage
  };
};
