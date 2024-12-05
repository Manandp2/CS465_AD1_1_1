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

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function BreakEdit({itemToEdit, breakList, setBreakList}) {
  // Form validation
  const [isBreakNameInvalid, setIsBreakNameInvalid] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(itemToEdit.name);
  // These time values are in DayJS so we might have to modify them to Date before sending them to firebase
  const [startTime, setStartTime] = React.useState(itemToEdit.startTime);
  const [endTime, setEndTime] = React.useState(itemToEdit.endTime);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Reset state values
    setIsBreakNameInvalid(false);
    setName(itemToEdit.name)
    setStartTime(itemToEdit.startTime)
    setEndTime(itemToEdit.endTime)

    setOpen(false);
  };
  const handleEdit = () => {
    if (name === "") {
      setIsBreakNameInvalid(true)
    } else {
      // Reset validation
      setIsBreakNameInvalid(false)

      // Insert edit functionality here
      const breakItem = {
        name: name,
        startTime: startTime,
        endTime: endTime
      }
      const updatedList = breakList.map(item => 
        item === itemToEdit ? breakItem : item // Replace the item if it matches itemToEdit
      );

      setBreakList(updatedList); // Update the state with the new list
      setOpen(false);
    }
  }

  return (
    <span>
      <IconButton onClick={handleClickOpen}>
          <EditIcon />
      </IconButton>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Edit Break</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                  required
                  id="outlined-required"
                  label="Break Name"
                  defaultValue={itemToEdit.name}
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
          <Button onClick={handleEdit}>Edit</Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}