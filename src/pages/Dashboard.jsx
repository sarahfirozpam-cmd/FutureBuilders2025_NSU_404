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
      color: '#1976d2',
      path: '/symptom-checker'
    },
    {
      title: t('dashboard.recordVitals'),
      description: 'Monitor your vital signs',
      icon: <VitalsIcon fontSize="large" />,
      color: '#d32f2f',
      path: '/vitals'
    },
    {
      title: t('dashboard.learnHealth'),
      description: 'Access health resources',
      icon: <EducationIcon fontSize="large" />,
      color: '#388e3c',
      path: '/education'
    },
    {
      title: t('dashboard.consultDoctor'),
      description: 'Request telemedicine consultation',
      icon: <TelemedicineIcon fontSize="large" />,
      color: '#f57c00',
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('dashboard.welcome')}
        </Typography>
        {modelsLoaded && (
          <Chip
            icon={<CheckIcon />}
            label="AI Models Ready"
            color="success"
            size="small"
          />
        )}
      </Box>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {t('dashboard.quickActions')}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Avatar
                  sx={{
                    bgcolor: action.color,
                    width: { xs: 40, sm: 56 },
                    height: { xs: 40, sm: 56 },
                    mb: { xs: 1, sm: 2 },
                    '& .MuiSvgIcon-root': {
                      fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                  {action.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'block' }
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