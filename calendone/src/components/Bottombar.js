import React from "react";

import { Paper, Stack, IconButton } from "@mui/material";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import HomeIcon from "@mui/icons-material/Home";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import DeleteIcon from "@mui/icons-material/Delete";
import AddDialog from "../components/AddDialog";

import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Bottombar({ status, setPage, getTasks, scheduleTasks, unscheduleTasks }) {
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
        {status === "Home" && (
          <>
            <IconButton sx={{ color: "white" }}>
              <SettingsIcon sx={{ fontSize: "170%" }} />
            </IconButton>
            <AddDialog getTasks={getTasks} />
            <IconButton sx={{ color: "white" }} onClick={() => setPage("Completed")}>
              <ChecklistIcon sx={{ fontSize: "170%" }} />
            </IconButton>
          </>
        )}
        {(status === "HomeUnscheduled" || status === "HomeScheduled" || status === "HomeMixed") && (
          <>
            <IconButton sx={{ color: "white" }}>
              <DeleteIcon sx={{ fontSize: "170%" }} />
            </IconButton>

            {status === "HomeUnscheduled" && (
              <IconButton sx={{ color: "white" }} onClick={scheduleTasks}>
                <ScheduleSendIcon sx={{ fontSize: "250%" }} />
              </IconButton>
            )}
            {status === "HomeScheduled" && (
              <IconButton sx={{ color: "white" }} onClick={unscheduleTasks}>
                <EventBusyIcon sx={{ fontSize: "250%" }} />
              </IconButton>
            )}
            {status === "HomeMixed" && (
              <IconButton disabled sx={{ color: "white" }}>
                <CalendarTodayIcon disabled sx={{ fontSize: "250%" }} />
              </IconButton>
            )}
            <IconButton sx={{ color: "white" }}>
              <DoneAllIcon sx={{ fontSize: "170%" }} />
            </IconButton>
          </>
        )}
        {status === "Completed" && (
          <>
            <IconButton disabled sx={{ color: "white" }}>
              <DeleteIcon sx={{ fontSize: "170%" }} />
            </IconButton>
            <IconButton disabled sx={{ color: "white" }}>
              <RemoveDoneIcon sx={{ fontSize: "250%" }} />
            </IconButton>
            <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
              <HomeIcon sx={{ fontSize: "170%" }} />
            </IconButton>
          </>
        )}
        {status === "Selected Completed" && (
          <>
            <IconButton sx={{ color: "white" }}>
              <DeleteIcon sx={{ fontSize: "170%" }} />
            </IconButton>
            <IconButton sx={{ color: "white" }}>
              <RemoveDoneIcon sx={{ fontSize: "250%" }} />
            </IconButton>
            <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
              <HomeIcon sx={{ fontSize: "170%" }} />
            </IconButton>
          </>
        )}
      </Stack>
    </Paper>
  );
}
