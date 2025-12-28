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
  Alert
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
  const [downloading, setDownloading] = useState(null);

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
        en: 'Learn about dengue symptoms, prevention, and treatment. Dengue is a mosquito-borne viral disease that is common in tropical regions.',
        bn: 'ডেঙ্গুর উপসর্গ, প্রতিরোধ এবং চিকিৎসা সম্পর্কে জানুন। ডেঙ্গু একটি মশাবাহিত ভাইরাল রোগ যা গ্রীষ্মমণ্ডলীয় অঞ্চলে সাধারণ।'
      },
      size: '2.5 MB'
    },
    {
      id: 2,
      category: 'maternal',
      title: { en: 'Prenatal Care Essentials', bn: 'প্রসবপূর্ব যত্নের প্রয়োজনীয়তা' },
      description: {
        en: 'Important steps for a healthy pregnancy including nutrition, exercise, and regular checkups.',
        bn: 'পুষ্টি, ব্যায়াম এবং নিয়মিত চেকআপ সহ একটি স্বাস্থ্যকর গর্ভাবস্থার জন্য গুরুত্বপূর্ণ পদক্ষেপ।'
      },
      size: '3.1 MB'
    },
    {
      id: 3,
      category: 'child',
      title: { en: 'Child Vaccination Schedule', bn: 'শিশু টিকাকরণ তালিকা' },
      description: {
        en: 'Complete vaccination guide for children from birth to 5 years following Bangladesh EPI schedule.',
        bn: 'বাংলাদেশ ইপিআই সময়সূচী অনুসরণ করে জন্ম থেকে ৫ বছর পর্যন্ত শিশুদের জন্য সম্পূর্ণ টিকাকরণ নির্দেশিকা।'
      },
      size: '1.8 MB'
    },
    {
      id: 4,
      category: 'chronic',
      title: { en: 'Managing Diabetes', bn: 'ডায়াবেটিস পরিচালনা' },
      description: {
        en: 'Tips for controlling blood sugar levels through diet, exercise, and medication management.',
        bn: 'খাদ্য, ব্যায়াম এবং ওষুধ ব্যবস্থাপনার মাধ্যমে রক্তে শর্করার মাত্রা নিয়ন্ত্রণের টিপস।'
      },
      size: '2.2 MB'
    },
    {
      id: 5,
      category: 'nutrition',
      title: { en: 'Balanced Diet Guide', bn: 'সুষম খাদ্য নির্দেশিকা' },
      description: {
        en: 'Learn about nutritious eating habits with locally available foods in Bangladesh.',
        bn: 'বাংলাদেশে স্থানীয়ভাবে পাওয়া যায় এমন খাবার দিয়ে পুষ্টিকর খাদ্যাভ্যাস সম্পর্কে জানুন।'
      },
      size: '2.8 MB'
    },
    {
      id: 6,
      category: 'hygiene',
      title: { en: 'Hand Washing Techniques', bn: 'হাত ধোয়ার কৌশল' },
      description: {
        en: 'Proper hand hygiene to prevent infections - when and how to wash hands correctly.',
        bn: 'সংক্রমণ প্রতিরোধে সঠিক হাত স্বাস্থ্যবিধি - কখন এবং কীভাবে সঠিকভাবে হাত ধুতে হবে।'
      },
      size: '1.2 MB'
    },
    {
      id: 7,
      category: 'general',
      title: { en: 'Common Cold vs Flu', bn: 'সাধারণ সর্দি বনাম ফ্লু' },
      description: {
        en: 'Understanding the differences between common cold and influenza, and treatment options.',
        bn: 'সাধারণ সর্দি এবং ইনফ্লুয়েঞ্জার মধ্যে পার্থক্য এবং চিকিৎসার বিকল্পগুলি বোঝা।'
      },
      size: '1.9 MB'
    },
    {
      id: 8,
      category: 'chronic',
      title: { en: 'Hypertension Management', bn: 'উচ্চ রক্তচাপ ব্যবস্থাপনা' },
      description: {
        en: 'Control high blood pressure naturally through lifestyle changes and regular monitoring.',
        bn: 'জীবনধারা পরিবর্তন এবং নিয়মিত পর্যবেক্ষণের মাধ্যমে প্রাকৃতিকভাবে উচ্চ রক্তচাপ নিয়ন্ত্রণ করুন।'
      },
      size: '2.4 MB'
    },
    {
      id: 9,
      category: 'infectious',
      title: { en: 'Cholera Prevention', bn: 'কলেরা প্রতিরোধ' },
      description: {
        en: 'How to prevent cholera through safe water, sanitation, and ORS treatment.',
        bn: 'নিরাপদ পানি, স্যানিটেশন এবং ওআরএস চিকিৎসার মাধ্যমে কীভাবে কলেরা প্রতিরোধ করবেন।'
      },
      size: '1.5 MB'
    },
    {
      id: 10,
      category: 'maternal',
      title: { en: 'Breastfeeding Guide', bn: 'বুকের দুধ খাওয়ানোর নির্দেশিকা' },
      description: {
        en: 'Complete guide to breastfeeding - benefits, techniques, and common issues.',
        bn: 'বুকের দুধ খাওয়ানোর সম্পূর্ণ নির্দেশিকা - সুবিধা, কৌশল এবং সাধারণ সমস্যা।'
      },
      size: '2.0 MB'
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
        item.title[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description[language]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setContent(filtered);
  };

  const handleDownload = async (item) => {
    setDownloading(item.id);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save to IndexedDB
      await db.healthContent.add({
        ...item,
        downloaded: true,
        downloadedAt: new Date().toISOString()
      });

      addDownloadedContent(item);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
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
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name[language] || category.name.en}
            onClick={() => setSelectedCategory(category.id)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      {/* Content Grid */}
      {content.length > 0 ? (
        <Grid container spacing={3}>
          {content.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 120,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h3" color="white" sx={{ opacity: 0.8 }}>
                    {(item.title[language] || item.title.en).substring(0, 2).toUpperCase()}
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title[language] || item.title.en}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {item.description[language] || item.description.en}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={categories.find(c => c.id === item.category)?.name[language] || item.category}
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
                      {language === 'bn' ? 'ডাউনলোড হয়েছে' : 'Downloaded'}
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(item)}
                      disabled={downloading === item.id}
                    >
                      {downloading === item.id 
                        ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') 
                        : t('education.download')
                      }
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            {language === 'bn' 
              ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো কন্টেন্ট পাওয়া যায়নি'
              : 'No content found matching your search'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HealthEducation;
