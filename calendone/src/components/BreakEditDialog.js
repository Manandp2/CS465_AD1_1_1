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

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function BreakEdit({itemToEdit, breakList, setBreakList}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = () => {
    // Insert edit functionality here
    const updatedList = breakList.map(item => 
      item === itemToEdit ? name : item // Replace the item if it matches itemToEdit
    );

    setBreakList(updatedList); // Update the state with the new list
    setOpen(false);
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
                defaultValue={itemToEdit}
                onChange={(event) => setName(event.target.value)}
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