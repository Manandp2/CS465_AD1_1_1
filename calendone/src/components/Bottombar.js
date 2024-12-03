import React from "react";

import { Paper, Typography } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import SettingsIcon from '@mui/icons-material/Settings';

export default function Bottombar() {
  return (
    <Paper square elevation={3} sx={{ backgroundColor: "#6d3b79", color: "white", paddingY: "3%", position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: "center" }}>
      <IconButton sx={{ color: "white" }}><SettingsIcon /></IconButton>
    </Paper>
  );
}