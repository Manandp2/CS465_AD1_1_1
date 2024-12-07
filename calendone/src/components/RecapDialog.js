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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditDialog from "./EditDialog";

export default function RecapDialog({ open, setOpen, taskList, checked, setChecked, getTasks }) {
  const handleClose = () => setOpen(false);
  // Default tasks
  // const [tasks, setTasks] = useState([
  //   { id: 1, name: "Task 1", selected: true },
  //   { id: 2, name: "Task 2", selected: true },
  //   { id: 3, name: "Task 3", selected: true },
  //   { id: 4, name: "Task 4", selected: true },
  // ]);

  // Toggle task selection
  // const toggleTaskSelection = (taskId) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) => (task.id === taskId ? { ...task, selected: !task.selected } : task))
  //   );
  // };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log(newChecked);
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
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {taskList.map(({ name, description, dueDate, duration, isScheduled, isComplete, id, gCalId }, i) => {
            const labelId = `checkbox-list-label-${id}`;
            if (i === 0) {
              return (
                <ListItem
                  key={id}
                  // disablePadding
                  sx={{ paddingY: 0, marginTop: -2 }}
                >
                  <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.includes(id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={name}
                      // secondary={
                      //   isScheduled
                      //     ? "SHCELDUED TIME"
                      //     : "Due: " +
                      //       dueDate.toLocaleDateString() +
                      //       " at " +
                      //       dueDate.toLocaleTimeString([], {
                      //         hour: "2-digit",
                      //         minute: "2-digit",
                      //         hour12: true,
                      //       })
                      // }
                    />
                  </ListItemButton>
                </ListItem>
              );
            }
            return (
              <ListItem
                key={id}
                // disablePadding
                sx={{ paddingY: 0 }}
              >
                <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={name}
                    secondary={
                      isScheduled
                        ? "SHCELDUED TIME"
                        : "Due: " +
                          dueDate.toLocaleDateString() +
                          " at " +
                          dueDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions>
        <Button onClick={handleClose}>DONE</Button>
      </DialogActions>
    </Dialog>
  );
}
