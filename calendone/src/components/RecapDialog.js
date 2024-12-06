import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Modal,
  Paper,
  IconButton,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
} from "@mui/material";

export default function RecapDialog({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  // Default tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", selected: true },
    { id: 2, name: "Task 2", selected: true },
    { id: 3, name: "Task 3", selected: true },
    { id: 4, name: "Task 4", selected: true },
  ]);

  // Toggle task selection
  const toggleTaskSelection = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, selected: !task.selected } : task))
    );
  };

  return (
    // <Modal open={open} onClose={onClose} aria-labelledby="recap-modal-title" aria-describedby="recap-modal-description">
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          // editTodoInFirestore();
          handleClose();
        },
      }}
    >
      <DialogTitle sx={{ paddingBottom: 1 }}>Overdue Recap</DialogTitle>

      <DialogContent>
        <DialogContentText>De-select incomplete tasks</DialogContentText>
        <FormGroup sx={{ paddingTop: 2 }}>
          {tasks.map((task) => (
            <FormControlLabel
              key={task.id}
              control={<Checkbox checked={task.selected} onChange={() => toggleTaskSelection(task.id)} />}
              label={task.name}
            />
          ))}
        </FormGroup>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions>
        <Button onClick={handleClose}>DONE</Button>
      </DialogActions>
    </Dialog>
  );
}
