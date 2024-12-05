import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";

export default function RecapDialog() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: false },
    { id: 3, name: "Task 3", completed: false },
    { id: 4, name: "Task 4", completed: false },
  ]);

  const toggleCompletion = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Open dialog on app load
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Completed Tasks Recap</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              Review your completed tasks below:
            </Typography>
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleCompletion(task.id)}
                      />
                    }
                    label={task.name}
                  />
                </ListItem>
              ))}
            </List>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}