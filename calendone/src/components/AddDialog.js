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
import { collection, doc, setDoc } from "firebase/firestore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function AddDialog({ getTasks }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [duration, setDuration] = React.useState(5);
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [taskName, setTaskName] = React.useState("");
  const [taskDescription, setTaskDescription] = React.useState("");

  const addTodoToFirestore = () => {
    const dueDateAsDate = dueDate.toDate();

    const tasksCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
    const taskDocRef = doc(tasksCollectionRef);

    setDoc(taskDocRef, {
      name: taskName,
      description: taskDescription,
      dueDate: dueDateAsDate,
      duration: Number(duration),
      isComplete: false,
      isScheduled: false,
    })
      .then(() => {
        console.log("Task added to Firestore");
        getTasks();
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
      });
  };

  return (
    <div>
      <IconButton onClick={handleOpen} sx={{ color: "white" }}>
        <AddCircleOutlineIcon sx={{ fontSize: "250%" }} />
      </IconButton>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            addTodoToFirestore();
            handleClose();
          },
        }}
      >
        {/* <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "70%",
            textAlign: "left",
            padding: 4,
            overflowY: "auto",
          }}
        > */}

        {/* Title */}
        <DialogTitle>Add To-Do</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            {/* Task Name */}
            <TextField
              id="task-name"
              label="Task Name"
              variant="outlined"
              fullWidth
              onChange={(e) => setTaskName(e.target.value)}
            />

            <MobileDateTimePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              sx={{ width: "100%" }}
            />
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Duration (mins)</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={duration}
                  label="Duration (mins)"
                  onChange={(e) => setDuration(e.target.value)}
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
              onChange={(e) => setTaskDescription(e.target.value)}
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
