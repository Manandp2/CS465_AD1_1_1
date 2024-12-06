import React from "react";
import Box from "@mui/material/Box";

import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Paper from "@mui/material/Paper";

import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormControl from "@mui/material/FormControl";

import LogoutIcon from "@mui/icons-material/Logout";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { doc, collection, setDoc } from "firebase/firestore";

function WorkTimesAccordion({ workTime, setWorkTime }) {
  const [startTime, setStartTime] = React.useState(workTime.startTime);
  const [endTime, setEndTime] = React.useState(workTime.endTime);

  const saveChanges = () => {
    setWorkTime({ startTime: startTime, endTime: endTime });
  };

  return (
    <Accordion disableGutters defaultExpanded>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography sx={{ width: "33%", flexShrink: 0 }}>Work Time</Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {workTime.startTime.format("h:mmA") + " - " + workTime.endTime.format("h:mmA")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ textAlign: "center" }}>
        <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TimePicker
              label="Start Time"
              defaultValue={workTime.startTime}
              onChange={(value) => setStartTime(value)}
              maxTime={endTime}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TimePicker
              label="End Time"
              defaultValue={workTime.endTime}
              onChange={(value) => setEndTime(value)}
              minTime={startTime}
            />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <Button
              variant="contained"
              sx={{ textTransform: "None", backgroundColor: "#6d3b79" }}
              onClick={saveChanges}
            >
              <Typography>Save Changes</Typography>
            </Button>
          </FormControl>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function GoogleAccordion() {
  return (
    <Accordion disableGutters defaultExpanded>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
        <Typography>Google</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          href="https://calendar.google.com"
          target="_blank"
          startIcon={<CalendarTodayIcon />}
          color="primary"
          sx={{ textTransform: "None", color: "#6d3b79" }}
        >
          <Typography>Google Calendar</Typography>
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

function AccountAccordion({ SignOut }) {
  return (
    <Accordion disableGutters defaultExpanded>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel3-content" id="panel3-header">
        <Typography>Account</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          onClick={SignOut}
          startIcon={<LogoutIcon />}
          color="primary"
          sx={{ textTransform: "None", color: "#6d3b79" }}
        >
          <Typography>Sign Out</Typography>
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default function Settings({ setUser, setPage }) {
  // const [activeTabIndex, setActiveTabIndex] = useState(0);

  const addTodoToFirestore = () => {
    const tasksCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
    const taskDocRef = doc(tasksCollectionRef);
    setDoc(taskDocRef, { name: "Task 1", description: "Description 1", dueDate: "2022-12-31", isComplete: false })
      .then(() => {
        console.log("Task added to Firestore");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const SignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out");
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Contains:
  // startDate: dayjs
  // endDate: dayjs
  const [workTime, setWorkTime] = React.useState({
    startTime: dayjs("2024-12-06T8:00"),
    endTime: dayjs("2024-12-06T18:00"),
  });

  return (
    <div>
      <Paper square elevation={3} sx={{ backgroundColor: "white", color: "white", paddingY: "3%" }}>
        <Typography variant="h4">PLACEHOLDER</Typography>
      </Paper>
      <Paper sx={{ overflowY: "scroll" }}>
        <Accordion disableGutters defaultExpanded>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography>Preferences</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <WorkTimesAccordion workTime={workTime} setWorkTime={setWorkTime} />
          </AccordionDetails>
        </Accordion>

        <GoogleAccordion />
        <AccountAccordion SignOut={SignOut} />
      </Paper>

      <Topbar header={"Settings"} />
      <Bottombar status={"Settings"} setPage={setPage} />
    </div>
  );
}
