import React from "react";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";

import { Paper, Typography } from "@mui/material";

export default function Topbar({ header }) {
  return (
    <Paper square elevation={3} sx={{ backgroundColor: "#6d3b79", color: "white", paddingY: "3%", textAlign: "center" }}>
      <Typography variant="h4">{header}</Typography>
    </Paper>
  );
}