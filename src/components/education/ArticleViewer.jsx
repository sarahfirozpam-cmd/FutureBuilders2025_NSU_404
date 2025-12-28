import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Divider,
  Button
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useAppStore } from '../../store/useAppStore';

const ArticleViewer = ({ article, onBack, onDownload, isDownloaded }) => {
  const { language } = useAppStore();

  if (!article) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title[language] || article.title.en,
          text: article.description[language] || article.description.en,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flex: 1 }}>
            {article.title[language] || article.title.en}
          </Typography>
          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Box>

        {/* Meta info */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={article.category} size="small" color="primary" variant="outlined" />
          {article.author && (
            <Chip label={article.author} size="small" variant="outlined" />
          )}
          {article.size && (
            <Chip label={article.size} size="small" variant="outlined" />
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Content */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              lineHeight: 1.8,
              '& p': { mb: 2 },
              '& ul, & ol': { pl: 3, mb: 2 },
              '& li': { mb: 1 }
            }}
            dangerouslySetInnerHTML={{
              __html: article.content?.[language] || article.content?.en || article.description[language] || article.description.en
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={isDownloaded ? 'outlined' : 'contained'}
            startIcon={<DownloadIcon />}
            onClick={() => onDownload && onDownload(article)}
            disabled={isDownloaded}
            fullWidth
          >
            {isDownloaded 
              ? (language === 'bn' ? 'ডাউনলোড হয়েছে' : 'Downloaded')
              : (language === 'bn' ? 'অফলাইনে সংরক্ষণ করুন' : 'Save for Offline')
            }
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArticleViewer;
