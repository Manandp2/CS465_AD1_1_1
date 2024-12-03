import React from "react";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";

import { Paper, Typography } from "@mui/material";

export default function Bottombar({ header }) {
  return (
    <Paper square elevation={3} sx={{ backgroundColor: "#6d3b79", color: "white", paddingY: "3%", position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <Typography variant="h4">{header}</Typography>
    </Paper>
  );
}