import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Slider,
  Stack
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  ArrowBack as BackIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as MuteIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';

const VideoPlayer = ({ video, onBack }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleSeek = (_, value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
      setProgress(value);
    }
  };

  const handleVolumeChange = (_, value) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!video) return null;

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            {video.title}
          </Typography>
        </Box>

        {/* Video container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            bgcolor: 'black',
            borderRadius: 1,
            overflow: 'hidden',
            mb: 2
          }}
        >
          <video
            ref={videoRef}
            src={video.src}
            style={{ width: '100%', display: 'block' }}
            onTimeUpdate={handleProgress}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play button overlay */}
          {!isPlaying && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                p: 2,
                cursor: 'pointer'
              }}
              onClick={togglePlay}
            >
              <PlayIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
          )}
        </Box>

        {/* Controls */}
        <Stack spacing={1}>
          {/* Progress bar */}
          <Slider
            value={progress}
            onChange={handleSeek}
            sx={{ color: 'primary.main' }}
          />

          {/* Control buttons */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={togglePlay}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>

            <IconButton onClick={toggleMute}>
              {isMuted ? <MuteIcon /> : <VolumeIcon />}
            </IconButton>

            <Slider
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.1}
              sx={{ width: 100 }}
            />

            <Box sx={{ flex: 1 }} />

            <IconButton onClick={handleFullscreen}>
              <FullscreenIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Description */}
        {video.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {video.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
