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

import { auth, db } from "../utils/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";

import { removeFromGoogleCalendar } from "../utils/calendoneAmogus";

export default function Bottombar({
  status,
  setPage,
  getTasks,
  scheduleTasks,
  unscheduleTasks,
  unSchedChecked,
  setUnschedChecked,
  schedChecked,
  setSchedChecked,
  unCompleteTasks,
  deleteCompletedTasks,
  completeTasks,
}) {
  let selectedList;
  switch (status) {
    case "HomeUnscheduled":
      selectedList = unSchedChecked;
      break;
    case "HomeScheduled":
      selectedList = schedChecked;
      break;
    case "HomeMixed":
      selectedList = unSchedChecked.concat(schedChecked);
  }

  const deleteToDoFromFirestore = (task_id) => {
    const taskDocRef = doc(db, "users", auth.currentUser.uid, "tasks", task_id);
    deleteDoc(taskDocRef);
  };

  const handleDelete = () => {
    // deleteToDoFromFirestore("OVDCAnvF3Re5LaCsbH1w")
    // Delete each listItem through firestore
    selectedList.map((task_id) => {
      // Get each task
      const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;
      const taskDocRef = doc(db, tasksCollectionPath, task_id)
      getDoc(taskDocRef)
        .then((docSnapshot) => {
          const task = docSnapshot.data();
          if (task.isScheduled) {
            removeFromGoogleCalendar(task.gCalId, task_id)
          } else {
            // Delete each list item here
            deleteToDoFromFirestore(task_id);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });

    // Reset the checkedlists to bring back the unselected bottom bar
    switch (status) {
      case "HomeUnscheduled":
        setUnschedChecked([]);
        break;
      case "HomeScheduled":
        setSchedChecked([]);
        break;
      case "HomeMixed":
        setUnschedChecked([]);
        setSchedChecked([]);
    }

    // Refresh and getTasks again
    getTasks();
  };
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
              <SettingsIcon sx={{ fontSize: "170%" }} onClick={() => setPage("Settings")} />
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
              <DeleteIcon sx={{ fontSize: "170%" }} onClick={handleDelete} />
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
            <IconButton sx={{ color: "white" }} onClick={completeTasks}>
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
            <IconButton sx={{ color: "white" }} onClick={deleteCompletedTasks}>
              <DeleteIcon sx={{ fontSize: "170%" }} />
            </IconButton>
            <IconButton sx={{ color: "white" }} onClick={unCompleteTasks}>
              <RemoveDoneIcon sx={{ fontSize: "250%" }} />
            </IconButton>
            <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
              <HomeIcon sx={{ fontSize: "170%" }} />
            </IconButton>
          </>
        )}
        {status === "Settings" && (
          <>
            <IconButton sx={{ color: "white" }} onClick={() => setPage("Home")}>
              <HomeIcon sx={{ fontSize: "250%" }} />
            </IconButton>
          </>
        )}
      </Stack>
    </Paper>
  );
}
