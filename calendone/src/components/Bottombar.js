import React from "react";

import { Paper, Stack, IconButton } from "@mui/material";

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ChecklistIcon from '@mui/icons-material/Checklist';

import HomeIcon from '@mui/icons-material/Home';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Bottombar({status, setPage}) {
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
      {(status == "Home") &&
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
        <IconButton sx={{ color: "white" }} onClick={() => setPage("Completed")}>
          <ChecklistIcon sx={{ fontSize: "170%" }} />
        </IconButton>
      </Stack>}
      {(status == "Completed") &&
      <Stack
        direction="row"
        spacing={0}
        sx={{
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <IconButton disabled sx={{ color: "white" }}>
          <DeleteIcon sx={{ fontSize: "170%" }} />
        </IconButton>
        <IconButton disabled sx={{ color: "white" }}>
          <RemoveDoneIcon sx={{ fontSize: "170%" }} />
        </IconButton>
        <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
          <HomeIcon sx={{ fontSize: "170%" }} />
        </IconButton>
      </Stack>}
    </Paper>
  );
}