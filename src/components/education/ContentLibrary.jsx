import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';

const ContentLibrary = ({ content, categories, onSelectContent, onSelectCategory }) => {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredContent, setFilteredContent] = useState(content);

  useEffect(() => {
    let filtered = content;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description[language]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContent(filtered);
  }, [content, selectedCategory, searchQuery, language]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  return (
    <Box>
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
            onClick={() => handleCategoryClick(category.id)}
            color={selectedCategory === category.id ? 'primary' : 'default'}
            variant={selectedCategory === category.id ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>

      {/* Content Grid */}
      {filteredContent.length > 0 ? (
        <Grid container spacing={3}>
          {filteredContent.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => onSelectContent && onSelectContent(item)}
              >
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
                  <Typography variant="h4" color="white" sx={{ opacity: 0.8 }}>
                    {(item.title[language] || item.title.en).substring(0, 2).toUpperCase()}
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {item.title[language] || item.title.en}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {item.description[language] || item.description.en}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={categories.find(c => c.id === item.category)?.name[language] || item.category}
                      size="small"
                      variant="outlined"
                    />
                    {item.size && (
                      <Chip label={item.size} size="small" variant="outlined" />
                    )}
                  </Stack>
                </CardContent>
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

export default ContentLibrary;
