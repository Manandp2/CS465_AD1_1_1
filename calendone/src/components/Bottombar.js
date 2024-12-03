import React from "react";

import { Paper, Typography, IconButton } from "@mui/material";

import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChecklistIcon from '@mui/icons-material/Checklist';

export default function Bottombar() {
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
        <IconButton sx={{ color: "white" }}><SettingsIcon fontSize="large" /></IconButton>
        <IconButton sx={{ color: "white" }}><AddCircleOutlineIcon fontSize="large" /></IconButton>
        <IconButton sx={{ color: "white" }}><ChecklistIcon fontSize="large" /></IconButton>
      </Paper>
  );
}