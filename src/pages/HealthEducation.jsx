import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardMedia,
  CardActions, Button, Chip, TextField, InputAdornment,
  Stack, CircularProgress, Dialog, AppBar, Toolbar, IconButton, 
  Slide, Container, Divider
} from '@mui/material';
import {
  Search as SearchIcon, Download as DownloadIcon,
  CheckCircle as CheckIcon, Close as CloseIcon,
  MenuBook as ReadIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import db from '../services/db';

// Animation for the article reader
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HealthEducation = () => {
  const { t } = useTranslation();
  const { language = 'en', downloadedContent = [], addDownloadedContent } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the article reader popup
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = [
    { id: 'all', name: { en: 'All', bn: 'সব' } },
    { id: 'general', name: { en: 'General', bn: 'সাধারণ' } },
    { id: 'maternal', name: { en: 'Maternal', bn: 'মাতৃ স্বাস্থ্য' } },
    { id: 'child', name: { en: 'Child Health', bn: 'শিশু স্বাস্থ্য' } },
    { id: 'infectious', name: { en: 'Infectious', bn: 'সংক্রামক' } }
  ];

  useEffect(() => {
    loadHealthContent();
  }, []);

  const loadHealthContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const contentLoader = (await import('../services/contentLoader')).default;
      
      // Load and Merge
      const en = await contentLoader.loadArticles('en');
      const bn = await contentLoader.loadArticles('bn');
      const merged = contentLoader.mergeArticles(en, bn);

      if (merged.length === 0) {
        throw new Error("No articles found in manifest.");
      }

      setAllContent(merged);
      setLoading(false);
    } catch (err) {
      console.error('Loader Error:', err);
      setError('Content not found. Please check your public/health-content/ folder.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = allContent.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.title[language]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description[language]?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setContent(filtered);
  }, [selectedCategory, searchQuery, allContent, language]);

  const handleDownload = async (e, item) => {
    e.stopPropagation(); // Prevents opening the reader when clicking download
    try {
      if (db && db.healthContent) {
        await db.healthContent.put({ ...item, downloaded: true, downloadedAt: new Date().toISOString() });
        addDownloadedContent(item);
      }
    } catch (err) {
      console.error('DB Error:', err);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
      <CircularProgress sx={{ mb: 2, color: '#354024' }} />
      <Typography sx={{ color: '#4C3D19', fontWeight: 600 }}>Loading Medical Resources...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography color="error" variant="h6">{error}</Typography>
      <Button onClick={loadHealthContent} sx={{ mt: 2 }} variant="outlined">Retry Loading</Button>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Health Education</Typography>

      <TextField
        fullWidth
        placeholder="Search for symptoms or diseases..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3, bgcolor: 'white' }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
      />

      <Stack direction="row" spacing={1} sx={{ mb: 4, overflowX: 'auto', pb: 1 }}>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name[language]}
            onClick={() => setSelectedCategory(cat.id)}
            color={selectedCategory === cat.id ? "primary" : "default"}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {content.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              onClick={() => setSelectedArticle(item)}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={item.thumbnail || "/api/placeholder/400/200"}
                alt={item.title[language]}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{item.title[language]}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description[language]}
                </Typography>
                <Chip label={item.category} size="small" variant="outlined" />
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant={downloadedContent.some(d => d.id === item.id) ? "outlined" : "contained"}
                  color={downloadedContent.some(d => d.id === item.id) ? "success" : "primary"}
                  startIcon={downloadedContent.some(d => d.id === item.id) ? <CheckIcon /> : <DownloadIcon />}
                  onClick={(e) => handleDownload(e, item)}
                >
                  {downloadedContent.some(d => d.id === item.id) ? "Offline Ready" : "Download"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* --- ARTICLE READER DIALOG --- */}
      <Dialog 
        fullScreen 
        open={Boolean(selectedArticle)} 
        onClose={() => setSelectedArticle(null)} 
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', bgcolor: 'primary.main' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setSelectedArticle(null)}>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {selectedArticle?.title[language]}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            {selectedArticle?.title[language]}
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Chip icon={<ReadIcon />} label={selectedArticle?.category} color="primary" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              Published: {selectedArticle?.createdAt}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 4 }} />

          {/* Renders the actual HTML content from your JSON */}
          <Box 
            sx={{ 
              '& p': { lineHeight: 1.7, mb: 2, fontSize: '1.1rem' },
              '& h2': { mt: 4, mb: 2, color: 'primary.dark' },
              '& ul': { mb: 3 },
              '& li': { mb: 1 }
            }}
            dangerouslySetInnerHTML={{ __html: selectedArticle?.content[language] || '' }} 
          />
        </Container>
      </Dialog>
    </Box>
  );
};

export default HealthEducation;