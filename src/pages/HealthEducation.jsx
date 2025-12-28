import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import db from '../services/db';

const HealthEducation = () => {
  const { t } = useTranslation();
  const { language, downloadedContent, addDownloadedContent } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: { en: 'All', bn: 'সব' } },
    { id: 'general', name: { en: 'General Health', bn: 'সাধারণ স্বাস্থ্য' } },
    { id: 'maternal', name: { en: 'Maternal Health', bn: 'মাতৃ স্বাস্থ্য' } },
    { id: 'child', name: { en: 'Child Health', bn: 'শিশু স্বাস্থ্য' } },
    { id: 'infectious', name: { en: 'Infectious Diseases', bn: 'সংক্রামক রোগ' } },
    { id: 'chronic', name: { en: 'Chronic Conditions', bn: 'দীর্ঘস্থায়ী রোগ' } },
    { id: 'nutrition', name: { en: 'Nutrition', bn: 'পুষ্টি' } },
    { id: 'hygiene', name: { en: 'Hygiene', bn: 'স্বাস্থ্যবিধি' } }
  ];

  // Load content from JSON files
  useEffect(() => {
    loadHealthContent();
  }, []);

  const loadHealthContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Import the content loader service
      const contentLoader = (await import('../services/contentLoader')).default;

      // Load articles from both languages
      const enArticles = await contentLoader.loadArticles('en');
      const bnArticles = await contentLoader.loadArticles('bn');

      // Merge articles by id, creating bilingual content
      const mergedContent = contentLoader.mergeArticles(enArticles, bnArticles);

      setAllContent(mergedContent);
      setLoading(false);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load health content. Please ensure content files are in place.');
      setLoading(false);
    }
  };

  // Filter content based on category and search
  useEffect(() => {
    filterContent();
  }, [selectedCategory, searchQuery, allContent]);

  const filterContent = () => {
    let filtered = allContent;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description[language].toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setContent(filtered);
  };

  const handleDownload = async (item) => {
    try {
      // Save to IndexedDB for offline access
      await db.healthContent.add({
        ...item,
        downloaded: true,
        downloadedAt: new Date().toISOString()
      });

      addDownloadedContent(item);

      alert(`${item.title[language]} downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download content');
    }
  };

  const isDownloaded = (itemId) => {
    return downloadedContent.some(item => item.id === itemId);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={loadHealthContent}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('education.title')}
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('education.search')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />

      {/* Category Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name[language]}
            onClick={() => setSelectedCategory(category.id)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {content.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  bgcolor: item.image ? 'transparent' : 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: item.image ? `url(${item.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!item.image && (
                  <Typography variant="h6" color="white">
                    {item.title[language].substring(0, 2).toUpperCase()}
                  </Typography>
                )}
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {item.title[language]}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description[language]}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                  <Chip
                    label={categories.find(c => c.id === item.category)?.name[language]}
                    size="small"
                    variant="outlined"
                  />
                  <Chip label={item.size} size="small" variant="outlined" />
                  {item.author && (
                    <Chip label={item.author} size="small" variant="outlined" />
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                {isDownloaded(item.id) ? (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CheckIcon />}
                    color="success"
                    disabled
                  >
                    Downloaded
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(item)}
                  >
                    {t('education.download')}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {content.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No content found matching your search
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HealthEducation;