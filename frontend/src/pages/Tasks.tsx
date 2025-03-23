import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { taskApi } from '../services/api';
import { Task } from '../types';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().required('Priority is required'),
  dueDate: yup.string().required('Due date is required'),
});

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await taskApi.getTasks();
      setTasks(fetchedTasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingTask) {
          await taskApi.updateTask(editingTask.id, values);
          toast.success('Task updated successfully');
        } else {
          await taskApi.createTask(values);
          toast.success('Task created successfully');
        }
        setOpen(false);
        resetForm();
        setEditingTask(null);
        fetchTasks();
      } catch (error) {
        toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
      }
    },
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    formik.setValues({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await taskApi.deleteTask(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await taskApi.updateTask(task.id, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Fab
          color="primary"
          onClick={() => {
            setEditingTask(null);
            formik.resetForm();
            setOpen(true);
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography align="center" variant="h6">Loading tasks...</Typography>
          </Grid>
        ) : tasks.length === 0 ? (
          <Grid item xs={12}>
            <Typography align="center" variant="h6">No tasks found. Create your first task!</Typography>
          </Grid>
        ) : (
          tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  opacity: task.completed ? 0.7 : 1,
                }}
              >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(task)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, mb: 2 }}
                >
                  {task.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                  }}
                >
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority] as 'success' | 'warning' | 'error'}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleToggleComplete(task)}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
              </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              fullWidth
              margin="normal"
              name="priority"
              label="Priority"
              select
              value={formik.values.priority}
              onChange={formik.handleChange}
              error={formik.touched.priority && Boolean(formik.errors.priority)}
              helperText={formik.touched.priority && formik.errors.priority}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              name="dueDate"
              label="Due Date"
              type="date"
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
              helperText={formik.touched.dueDate && formik.errors.dueDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
