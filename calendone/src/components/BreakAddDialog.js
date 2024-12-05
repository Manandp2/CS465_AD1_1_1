import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import AddIcon from '@mui/icons-material/Add';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function BreakAddDialog({setBreakList}) {
  // Form validation
  const [isBreakNameInvalid, setIsBreakNameInvalid] = React.useState(false);
  const [isDaysInvalid, setIsDaysInvalid] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  // These time values are in DayJS so we might have to modify them to Date before sending them to firebase
  const [startTime, setStartTime] = React.useState(dayjs('2024-12-06T0:00'));
  const [endTime, setEndTime] = React.useState(dayjs('2024-12-06T23:59'));

  const [days, setDays] = React.useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Reset state values
    setIsBreakNameInvalid(false)
    setIsDaysInvalid(false);
    setName("")
    setStartTime(dayjs('2024-04-17T0:00'))
    setEndTime(dayjs('2024-04-17T23:59'))

    // Close the dialog window
    setOpen(false);
  };

  const handleAdd = () => {
    if (name === "") {
      setIsBreakNameInvalid(true)
    } else {
      const breakItem = {
        name: name,
        startTime: startTime,
        endTime: endTime
      }
      // Store new break item into breaklist
      setBreakList(prevBreakList => [...prevBreakList, breakItem]);

      // Reset state values
      setIsBreakNameInvalid(false)
      setIsDaysInvalid(false);
      setName("")
      setStartTime(dayjs('2024-04-17T0:00'))
      setEndTime(dayjs('2024-04-17T23:59'))

      // Close the dialog window
      setOpen(false);
    }
  }

  return (
    <div>
        <Button 
            variant="contained"
            startIcon={<AddIcon />}
            sx={{textTransform: "None", backgroundColor: "#6d3b79"}}
            onClick={handleClickOpen}
        >
            <Typography>Add Break</Typography>
        </Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Add Break</DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                  required
                  label="Break Name"
                  onChange={(event) => setName(event.target.value)}
                  error={isBreakNameInvalid}
                  helperText={isBreakNameInvalid && "The break must have a name"}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TimePicker 
                label="Start Time"
                defaultValue={startTime}
                onChange={(value) => setStartTime(value)}
                maxTime={endTime}
               />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TimePicker 
                label="End Time" 
                defaultValue={endTime}
                onChange={(value) => setEndTime(value)}
                minTime={startTime}
              />
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}