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
  Stack
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

  // Sample health content
  const healthContent = [
    {
      id: 1,
      category: 'infectious',
      title: { en: 'Understanding Dengue Fever', bn: 'ডেঙ্গু জ্বর বোঝা' },
      description: {
        en: 'Learn about dengue symptoms, prevention, and treatment',
        bn: 'ডেঙ্গুর উপসর্গ, প্রতিরোধ এবং চিকিৎসা সম্পর্কে জানুন'
      },
      image: '/content/dengue.jpg',
      size: '2.5 MB'
    },
    {
      id: 2,
      category: 'maternal',
      title: { en: 'Prenatal Care Essentials', bn: 'প্রসবপূর্ব যত্নের প্রয়োজনীয়তা' },
      description: {
        en: 'Important steps for a healthy pregnancy',
        bn: 'একটি স্বাস্থ্যকর গর্ভাবস্থার জন্য গুরুত্বপূর্ণ পদক্ষেপ'
      },
      image: '/content/prenatal.jpg',
      size: '3.1 MB'
    },
    {
      id: 3,
      category: 'child',
      title: { en: 'Child Vaccination Schedule', bn: 'শিশু টিকাকরণ তালিকা' },
      description: {
        en: 'Complete vaccination guide for children',
        bn: 'শিশুদের জন্য সম্পূর্ণ টিকাকরণ নির্দেশিকা'
      },
      image: '/content/vaccination.jpg',
      size: '1.8 MB'
    },
    {
      id: 4,
      category: 'chronic',
      title: { en: 'Managing Diabetes', bn: 'ডায়াবেটিস পরিচালনা' },
      description: {
        en: 'Tips for controlling blood sugar levels',
        bn: 'রক্তে শর্করার মাত্রা নিয়ন্ত্রণের টিপস'
      },
      image: '/content/diabetes.jpg',
      size: '2.2 MB'
    },
    {
      id: 5,
      category: 'nutrition',
      title: { en: 'Balanced Diet Guide', bn: 'সুষম খাদ্য নির্দেশিকা' },
      description: {
        en: 'Learn about nutritious eating habits',
        bn: 'পুষ্টিকর খাদ্যাভ্যাস সম্পর্কে জানুন'
      },
      image: '/content/nutrition.jpg',
      size: '2.8 MB'
    },
    {
      id: 6,
      category: 'hygiene',
      title: { en: 'Hand Washing Techniques', bn: 'হাত ধোয়ার কৌশল' },
      description: {
        en: 'Proper hand hygiene to prevent infections',
        bn: 'সংক্রমণ প্রতিরোধে সঠিক হাত স্বাস্থ্যবিধি'
      },
      image: '/content/handwashing.jpg',
      size: '1.2 MB'
    },
    {
      id: 7,
      category: 'general',
      title: { en: 'Common Cold vs Flu', bn: 'সাধারণ সর্দি বনাম ফ্লু' },
      description: {
        en: 'Differences and treatment options',
        bn: 'পার্থক্য এবং চিকিৎসার বিকল্প'
      },
      image: '/content/cold-flu.jpg',
      size: '1.9 MB'
    },
    {
      id: 8,
      category: 'chronic',
      title: { en: 'Hypertension Management', bn: 'উচ্চ রক্তচাপ ব্যবস্থাপনা' },
      description: {
        en: 'Control high blood pressure naturally',
        bn: 'প্রাকৃতিকভাবে উচ্চ রক্তচাপ নিয়ন্ত্রণ করুন'
      },
      image: '/content/hypertension.jpg',
      size: '2.4 MB'
    }
  ];

  useEffect(() => {
    loadContent();
  }, [selectedCategory, searchQuery]);

  const loadContent = () => {
    let filtered = healthContent;

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
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save to IndexedDB
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
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" color="white">
                  {item.title[language].substring(0, 2).toUpperCase()}
                </Typography>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {item.title[language]}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description[language]}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={categories.find(c => c.id === item.category)?.name[language]}
                    size="small"
                    variant="outlined"
                  />
                  <Chip label={item.size} size="small" variant="outlined" />
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

      {content.length === 0 && (
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