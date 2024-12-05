import React from "react";
import { Modal, Paper, Typography, List, ListItem, Checkbox, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  padding: "16px",
  textAlign: "center",
};

export default function RecapModal({ open, onClose }) {
  const tasks = [
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: false },
    { id: 3, name: "Task 3", completed: false },
    { id: 4, name: "Task 4", completed: false },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Paper elevation={3} sx={style}>
        <Typography variant="h6" sx={{ marginBottom: 3 }}>
          Completed Tasks Recap
        </Typography>
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <Checkbox checked={task.completed} />
              {task.name}
            </ListItem>
          ))}
        </List>
        <Button variant="contained" sx={{ marginTop: 3 }} onClick={onClose}>
          Done
        </Button>
      </Paper>
    </Modal>
  );
}