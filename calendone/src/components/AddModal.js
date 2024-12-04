import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider, TimePicker, DateTimePicker } from '@mui/x-date-pickers';




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    height: "70%",
    textAlign: 'center'
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
  };

export default function AddModal(){
    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box> */}
        <Paper elevation={3} sx={{style, padding: 4}}>
            {/* Title */}
            <Typography variant="h6" sx={{ marginBottom: 3}}>
                Add To-Do
            </Typography>
            {/* Task Name */}
            <TextField
                id="task-name"
                label="Task Name"
                variant="outlined"
                sx={{ marginBottom: 2 }}

            />


            {/* Task Description */}
            <TextField
              id="task-description"
              label="Task Description"
              variant="outlined"
              multiline
              rows={4}
              sx={{ marginBottom: 2 }}
            />
           
        </Paper>

      </Modal>
    </div>
  );
}