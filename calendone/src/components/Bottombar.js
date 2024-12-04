import React from "react";

import { Paper, IconButton } from "@mui/material";

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChecklistIcon from '@mui/icons-material/Checklist';

import HomeIcon from '@mui/icons-material/Home';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Bottombar({status}) {
  return (
    <Paper
        square
        elevation={3}
        sx={{
          backgroundColor: "#6d3b79",
          color: "white",
          paddingY: "1%",
          position: "fixed",
          bottom: "0",
          left: 0,
          right: 0,
          textAlign: "center"
        }}
      >
        {
        (status == "Home") && 
        <>
            <IconButton sx={{ color: "white" }}><SettingsIcon fontSize="large" /></IconButton>
            <IconButton sx={{ color: "white" }}><AddCircleOutlineIcon fontSize="large" /></IconButton>
            <IconButton sx={{ color: "white" }}><ChecklistIcon fontSize="large" /></IconButton>
        </>
        }
        {
        (status == "Completed") && 
        <>
            <IconButton sx={{ color: "white" }}><DeleteIcon fontSize="large" /></IconButton>
            <IconButton sx={{ color: "white" }}><RemoveDoneIcon fontSize="large" /></IconButton>
            <IconButton sx={{ color: "white" }}><HomeIcon fontSize="large" /></IconButton>
        </>
        }
      </Paper>
  );
}