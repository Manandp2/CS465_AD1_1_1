import React from "react";

import { Paper, Typography, IconButton, Stack } from "@mui/material";

import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChecklistIcon from "@mui/icons-material/Checklist";

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
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        spacing={0}
        sx={{
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <SettingsIcon sx={{ fontSize: "170%" }} />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <AddCircleOutlineIcon sx={{ fontSize: "170%" }} />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <ChecklistIcon sx={{ fontSize: "170%" }} />
        </IconButton>
      </Stack>
    </Paper>
  );
}
