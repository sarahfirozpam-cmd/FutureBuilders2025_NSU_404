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
import { Box } from '@mui/material';

const VitalsChart = ({ data }) => {
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      date: format(new Date(item.createdAt), 'MMM dd'),
      systolic: item.systolic,
      diastolic: item.diastolic,
      pulse: item.pulse,
      temperature: item.temperature
    }));

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="systolic"
            stroke="#d32f2f"
            name="Systolic BP"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="diastolic"
            stroke="#f57c00"
            name="Diastolic BP"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="pulse"
            stroke="#1976d2"
            name="Pulse"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VitalsChart;