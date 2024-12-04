import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { DateTimePicker } from "@mui/x-date-pickers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";

export default function AddModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [duration, setDuration] = React.useState("");

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
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
            <TextField id="task-name" label="Task Name" variant="outlined" fullWidth />

            <MobileDateTimePicker label="Due Date" sx={{ width: "100%" }} />
            <Box>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={duration}
                  label="Duration"
                  onChange={handleChange}
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
            />
          </Stack>
        </DialogContent>

        {/* </Paper> */}
        <DialogActions>
          <Button>CANCEL</Button>
          <Button>SUBMIT</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
