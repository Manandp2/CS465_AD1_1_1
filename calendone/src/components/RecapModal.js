import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
} from "@mui/material";

export default function RecapModal({ open, onClose }) {
  // Default tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", selected: false },
    { id: 2, name: "Task 2", selected: false },
    { id: 3, name: "Task 3", selected: false },
    { id: 4, name: "Task 4", selected: false },
  ]);

  // Toggle task selection
  const toggleTaskSelection = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="recap-modal-title"
      aria-describedby="recap-modal-description"
    >
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          padding: 4,
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{ marginBottom: 1, textAlign: "center", fontSize: '18px'}}
          id="recap-modal-title"
        >
          Overdue Tasks Recap
        </Typography>
        <Typography variant="body1"
          sx={{ marginBottom: 3, textAlign: "center", fontSize: '12px' }}>
              Select incomplete tasks to send back to to-do list
        </Typography>

        {/* Task List */}
        <FormGroup>
          {tasks.map((task) => (
            <FormControlLabel
              key={task.id}
              control={
                <Checkbox
                  checked={task.selected}
                  onChange={() => toggleTaskSelection(task.id)}
                />
              }
              label={task.name}
            />
          ))}
        </FormGroup>

        {/* Footer Buttons */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ marginTop: 4 }}
        >
          <Button variant="contained" color="primary" onClick={onClose}>
            Done
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
}