import React from "react";

import { Paper, Stack, IconButton } from "@mui/material";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// Might change this icon
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import HomeIcon from "@mui/icons-material/Home";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import DeleteIcon from "@mui/icons-material/Delete";
import AddDialog from "../components/AddDialog";

export default function Bottombar({ status, setPage, getTasks }) {
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
      {status === "Home" && (
        <Stack
          direction="row"
          spacing={0}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ color: "white" }}>
            <SettingsIcon sx={{ fontSize: "170%" }} onClick={() => setPage("Settings")} />
          </IconButton>
          <AddDialog getTasks={getTasks} />
          <IconButton sx={{ color: "white" }} onClick={() => setPage("Completed")}>
            <ChecklistIcon sx={{ fontSize: "170%" }} />
          </IconButton>
        </Stack>
      )}
      {status === "Selected Home" && (
        <Stack
          direction="row"
          spacing={0}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ color: "white" }}>
            <DeleteIcon sx={{ fontSize: "170%" }} />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <CalendarMonthIcon sx={{ fontSize: "170%" }} />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <DoneAllIcon sx={{ fontSize: "170%" }} />
          </IconButton>
        </Stack>
      )}
      {status === "Completed" && (
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
        </Stack>
      )}
      {status === "Selected Completed" && (
        <Stack
          direction="row"
          spacing={0}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ color: "white" }}>
            <DeleteIcon sx={{ fontSize: "170%" }} />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <RemoveDoneIcon sx={{ fontSize: "170%" }} />
          </IconButton>
          <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
            <HomeIcon sx={{ fontSize: "170%" }} />
          </IconButton>
        </Stack>
      )}
      {status == "Settings" && (
        <Stack
          direction="row"
          spacing={0}
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
            <HomeIcon sx={{ fontSize: "170%" }} />
          </IconButton>
        </Stack>
      )}
    </Paper>
  );
}
