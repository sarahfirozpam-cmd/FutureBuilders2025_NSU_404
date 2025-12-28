import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Layout
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';

// Pages
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import VitalsMonitor from './pages/VitalsMonitor';
import HealthEducation from './pages/HealthEducation';
import Telemedicine from './pages/Telemedicine';

// Services
import { syncService } from './services/syncService';
import { useAppStore } from './store/useAppStore';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// i18n
import './utils/i18n';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#388e3c',
      light: '#66bb6a',
      dark: '#2e7d32'
    },
    error: {
      main: '#d32f2f'
    },
    warning: {
      main: '#f57c00'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans Bengali", sans-serif',
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
});

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
        await Promise.all([
          modelLoader.loadSymptomCheckerModel(),
          modelLoader.loadVitalsPredictor()
        ]);
        setModelsLoaded(true);
        console.log('AI models loaded successfully');
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
        <Suspense fallback={<LoadingScreen />}>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/vitals" element={<VitalsMonitor />} />
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
