import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Assignment as SymptomIcon,
  FavoriteOutlined as VitalsIcon,
  School as EducationIcon,
  Videocam as TelemedicineIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import db from '../services/db';
import { useAppStore } from '../store/useAppStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { symptomsHistory, vitalsHistory, modelsLoaded } = useAppStore();
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [recentVitals, setRecentVitals] = useState([]);

  useEffect(() => {
    loadRecentData();
  }, []);

  const loadRecentData = async () => {
    try {
      const symptoms = await db.symptoms
        .orderBy('createdAt')
        .reverse()
        .limit(3)
        .toArray();
      setRecentSymptoms(symptoms);

      const vitals = await db.vitals
        .orderBy('createdAt')
        .reverse()
        .limit(3)
        .toArray();
      setRecentVitals(vitals);
    } catch (error) {
      console.error('Error loading recent data:', error);
    }
  };

  const quickActions = [
    {
      title: t('dashboard.checkSymptoms'),
      description: 'AI-powered symptom analysis',
      icon: <SymptomIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
      path: '/symptom-checker'
    },
    {
      title: t('dashboard.recordVitals'),
      description: 'Monitor your vital signs',
      icon: <VitalsIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #889063 0%, #354024 100%)',
      path: '/vitals'
    },
    {
      title: t('dashboard.learnHealth'),
      description: 'Access health resources',
      icon: <EducationIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #CFBB99 0%, #889063 100%)',
      path: '/education'
    },
    {
      title: t('dashboard.consultDoctor'),
      description: 'Request telemedicine consultation',
      icon: <TelemedicineIcon fontSize="large" />,
      gradient: 'linear-gradient(135deg, #4C3D19 0%, #354024 100%)',
      path: '/telemedicine'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe':
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box 
        sx={{ 
          mb: 4,
          p: { xs: 3, sm: 4 },
          background: 'rgba(53, 64, 36, 0.06)',
          borderRadius: 3
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          {t('dashboard.welcome')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Your health companion, powered by AI
        </Typography>
        {modelsLoaded && (
          <Chip
            icon={<CheckIcon />}
            label="AI Models Ready"
            color="success"
            size="medium"
            sx={{ 
              fontWeight: 600,
              px: 1,
              background: 'linear-gradient(135deg, #354024 0%, #4C3D19 100%)',
              color: '#E5D7C4'
            }}
          />
        )}
      </Box>

      {/* Quick Actions */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 3,
          fontWeight: 700,
          color: '#4C3D19'
        }}
      >
        {t('dashboard.quickActions')}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                background: action.gradient,
                color: '#E5D7C4',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 12px 28px rgba(76, 61, 25, 0.2)'
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    color: '#E5D7C4',
                    width: { xs: 48, sm: 64 },
                    height: { xs: 48, sm: 64 },
                    mb: { xs: 1.5, sm: 2 },
                    mx: 'auto',
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    fontWeight: 700,
                    color: '#E5D7C4'
                  }}
                >
                  {action.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'block' },
                    color: 'rgba(229, 215, 196, 0.8)'
                  }}
                >
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 3,
          mt: 2,
          fontWeight: 700,
          color: '#4C3D19'
        }}
      >
        Recent Activity
      </Typography>
      <Grid container spacing={3}>
        {/* Recent Symptom Checks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.recentSymptoms')}
              </Typography>
              {recentSymptoms.length > 0 ? (
                <List>
                  {recentSymptoms.map((symptom, index) => (
                    <ListItem key={index} divider={index < recentSymptoms.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getSeverityColor(symptom.severity) }}>
                          <SymptomIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={symptom.primaryDiagnosis?.name || 'Analysis completed'}
                        secondary={
                          symptom.createdAt
                            ? format(new Date(symptom.createdAt), 'MMM dd, yyyy - HH:mm')
                            : 'Recent'
                        }
                      />
                      {symptom.severity && (
                        <Chip
                          label={symptom.severity}
                          size="small"
                          color={getSeverityColor(symptom.severity)}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No recent symptom checks
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/symptom-checker')}>
                Check Symptoms
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Recent Vitals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('dashboard.recentVitals')}
              </Typography>
              {recentVitals.length > 0 ? (
                <List>
                  {recentVitals.map((vital, index) => (
                    <ListItem key={index} divider={index < recentVitals.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getSeverityColor(vital.riskLevel) }}>
                          <VitalsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`BP: ${vital.systolic}/${vital.diastolic} | Pulse: ${vital.pulse}`}
                        secondary={
                          vital.createdAt
                            ? format(new Date(vital.createdAt), 'MMM dd, yyyy - HH:mm')
                            : 'Recent'
                        }
                      />
                      {vital.riskLevel && (
                        <Chip
                          label={vital.riskLevel}
                          size="small"
                          color={getSeverityColor(vital.riskLevel)}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No recent vitals recorded
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/vitals')}>
                Record Vitals
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;