import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const VitalsChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      date: format(new Date(item.createdAt), isMobile ? 'dd/MM' : 'MMM dd'),
      systolic: item.systolic,
      diastolic: item.diastolic,
      pulse: item.pulse,
      temperature: item.temperature
    }));

  return (
    <Box sx={{ width: '100%', height: { xs: 300, sm: 400 } }}>
      <ResponsiveContainer>
        <LineChart 
          data={chartData}
          margin={{ 
            top: 5, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? 0 : 20, 
            bottom: 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          <YAxis 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 30 : 40}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
          />
          <Line
            type="monotone"
            dataKey="systolic"
            stroke="#d32f2f"
            name="Systolic BP"
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="diastolic"
            stroke="#f57c00"
            name="Diastolic BP"
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
          <Line
            type="monotone"
            dataKey="pulse"
            stroke="#1976d2"
            name="Pulse"
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VitalsChart;
