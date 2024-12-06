import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";

export default function EditDialog({
  name,
  description,
  dueDate,
  duration,
  isScheduled,
  isComplete,
  id,
  getTasks,
  gCalId,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewDuration(duration);
    setNewDueDate(dayjs(dueDate));
    setNewTaskName(name);
    setNewTaskDescription(description);
    setOpen(false);
  };

  const [newDuration, setNewDuration] = React.useState(duration);
  const [newDueDate, setNewDueDate] = React.useState(dayjs(dueDate));
  const [newTaskName, setNewTaskName] = React.useState(name);
  const [newTaskDescription, setNewTaskDescription] = React.useState(description);

  const editTodoInFirestore = () => {
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;
    const taskDocRef = doc(db, tasksCollectionPath, id); // 'id' is the document ID
    const dueDateAsDate = newDueDate.toDate();

    updateDoc(taskDocRef, {
      name: newTaskName,
      description: newTaskDescription,
      dueDate: dueDateAsDate,
      duration: Number(newDuration),
      isComplete: isComplete,
      isScheduled: isScheduled,
      gCalId: gCalId,
    })
      .then(() => {
        console.log("Task updated in Firestore");
        getTasks();
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
      });
  };

  return (
    <div>
      <IconButton onClick={handleOpen} edge="end" aria-label="comments" sx={{ paddingRight: 3 }}>
        <EditIcon />
      </IconButton>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            editTodoInFirestore();
            handleClose();
          },
        }}
      >
        {/* Title */}
        <DialogTitle>Edit {newTaskName}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ paddingTop: 1 }}>
            {/* Task Name */}
            <TextField
              id="task-name"
              label="Task Name"
              variant="outlined"
              fullWidth
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />

            <MobileDateTimePicker
              label="Due Date"
              value={newDueDate}
              onChange={(newValue) => setNewDueDate(newValue)}
              sx={{ width: "100%" }}
            />
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={newDuration}
                  label="Duration"
                  onChange={(e) => setNewDuration(e.target.value)}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={45}>45</MenuItem>
                  <MenuItem value={60}>60</MenuItem>
                  <MenuItem value={90}>90</MenuItem>
                  <MenuItem value={120}>120</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Task Description */}
            <TextField
              id="task-description"
              label="Task Description"
              variant="outlined"
              multiline
              rows={8}
              fullWidth
              sx={{ marginBottom: 2 }}
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>

        {/* </Paper> */}
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <Button type="submit">SUBMIT</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
