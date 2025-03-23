import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  DateRange,
  Flag,
} from '@mui/icons-material';
import { taskApi } from '../services/api';
import { TaskStats } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await taskApi.getTaskStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch task statistics:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <LinearProgress />;
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <Assignment color="primary" />,
      color: 'primary.main',
    },
    {
      title: 'Completed Tasks',
      value: stats.completed,
      icon: <CheckCircle color="success" />,
      color: 'success.main',
    },
    {
      title: 'Due Today',
      value: stats.dueToday,
      icon: <Schedule color="error" />,
      color: 'error.main',
    },
    {
      title: 'Due This Week',
      value: stats.dueThisWeek,
      icon: <DateRange color="warning" />,
      color: 'warning.main',
    },
  ];

  const priorityCards = [
    {
      title: 'High Priority',
      value: stats.byPriority.high,
      color: 'error.main',
    },
    {
      title: 'Medium Priority',
      value: stats.byPriority.medium,
      color: 'warning.main',
    },
    {
      title: 'Low Priority',
      value: stats.byPriority.low,
      color: 'success.main',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Typography color="text.secondary">{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
        Tasks by Priority
      </Typography>

      <Grid container spacing={3}>
        {priorityCards.map((priority) => (
          <Grid item xs={12} sm={4} key={priority.title}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Flag sx={{ color: priority.color, mr: 1 }} />
                    <Typography variant="h6">{priority.title}</Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ color: priority.color }}
                  >
                    {priority.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
