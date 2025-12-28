import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

// Pages
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import VitalsMonitor from './pages/VitalsMonitor';
import HealthEducation from './pages/HealthEducation';
import Telemedicine from './pages/Telemedicine';
import VisualScanner from './pages/VisualScanner';

// Services
import { syncService } from './services/syncService';
import { useAppStore } from './store/useAppStore';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// i18n
import './utils/i18n';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#354024', // KOMBU GREEN
      light: '#889063', // MOSS GREEN
      dark: '#4C3D19', // CAFÉ NOIR
      contrastText: '#E5D7C4' // BONE
    },
    secondary: {
      main: '#889063', // MOSS GREEN
      light: '#CFBB99', // TAN
      dark: '#354024', // KOMBU GREEN
      contrastText: '#fff'
    },
    error: {
      main: '#d32f2f'
    },
    warning: {
      main: '#f57c00'
    },
    success: {
      main: '#354024'
    },
    background: {
      default: '#E5D7C4', // BONE - warm cream background
      paper: '#CFBB99' // TAN - warmer card background
    },
    text: {
      primary: '#4C3D19', // CAFÉ NOIR - dark brown text
      secondary: '#354024' // KOMBU GREEN
    },
    divider: '#889063' // MOSS GREEN dividers
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Noto Sans Bengali", -apple-system, BlinkMacSystemFont, sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0em'
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em'
    }
  },
  shape: {
    borderRadius: 16
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 4px 8px rgba(76, 61, 25, 0.12)',
    '0px 8px 16px rgba(76, 61, 25, 0.16)',
    '0px 12px 24px rgba(76, 61, 25, 0.20)',
    '0px 16px 32px rgba(76, 61, 25, 0.24)',
    '0px 20px 40px rgba(76, 61, 25, 0.28)',
    '0px 24px 48px rgba(76, 61, 25, 0.32)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)',
    '0px 2px 4px rgba(76, 61, 25, 0.08)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(76, 61, 25, 0.15)',
            transform: 'translateY(-1px)'
          }
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(76, 61, 25, 0.2)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(76, 61, 25, 0.08)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 20px rgba(76, 61, 25, 0.12)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(76, 61, 25, 0.1)'
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(76, 61, 25, 0.12)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.8)'
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    }
  }
});

// ScrollToTop component - resets scroll on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

function App() {
  const isOnline = useOnlineStatus();
  const { setModelsLoaded } = useAppStore();

  useEffect(() => {
    // Initialize sync service
    syncService.startAutoSync();

    // Preload AI models
    const loadModels = async () => {
      try {
        const { modelLoader } = await import('./ai/modelLoader');
        const { skinAnalyzer } = await import('./ai/skinAnalyzer');
        
        await Promise.all([
          modelLoader.loadSymptomCheckerModel(),
          modelLoader.loadVitalsPredictor(),
          skinAnalyzer.loadModel()
        ]);
        
        setModelsLoaded(true);
        console.log('All AI models loaded successfully');
      } catch (error) {
        console.error('Error loading AI models:', error);
      }
    };

    loadModels();
  }, [setModelsLoaded]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/vitals" element={<VitalsMonitor />} />
              <Route path="/visual-scanner" element={<VisualScanner />} />
              <Route path="/education" element={<HealthEducation />} />
              <Route path="/telemedicine" element={<Telemedicine />} />
            </Routes>
          </Layout>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;