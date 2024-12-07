import React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";

import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormControl from "@mui/material/FormControl";

import LogoutIcon from "@mui/icons-material/Logout";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { auth, db } from "../utils/firebase";

import { doc, updateDoc, collection, setDoc, getDoc } from "firebase/firestore";

function WorkTimesAccordion() {
    const [startTime, setStartTime] = React.useState(dayjs());
    const [endTime, setEndTime] = React.useState(dayjs());
    useEffect(() => {
        getDoc(
            doc(db, "users", auth.currentUser.uid)
          ).then((res) => {
            const data = res.data();
            setStartTime(dayjs(data.startTime.toDate()))
            setEndTime(dayjs(data.endTime.toDate()))
          }
        )
    }, [])

    const saveChanges = () => {
        // Save worktime to firebase
        const taskDocRef = doc(db, "users", auth.currentUser.uid);

        setDoc(taskDocRef, {
            startTime: startTime.toDate(),
            endTime: endTime.toDate()
        }, {merge:true})
        .then(() => {
            console.log("Worktime updated in Firestore");
        })
        .catch((error) => {
            console.error("Error updating worktime: ", error);
        });
    }

    return (
        <Accordion disableGutters>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-1-content" id="panel1-1-header">
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Work Time
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    {startTime.format('h:mmA') + " - " + endTime.format('h:mmA')}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{textAlign: "center"}}>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <TimePicker 
                            label="Start Time"
                            value={startTime}
                            onChange={(value) => setStartTime(value)}
                            maxTime={endTime}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <TimePicker 
                            label="End Time" 
                            value={endTime}
                            onChange={(value) => setEndTime(value)}
                            minTime={startTime}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Button 
                            variant="contained"
                            sx={{textTransform: "None", backgroundColor: "#6d3b79"}}
                            onClick={saveChanges}
                        >
                            <Typography>Save Changes</Typography>
                        </Button>
                    </FormControl>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

function BufferTimeAccordion() {
    const [bufferTime, setBufferTime] = React.useState(0);
    useEffect(() => {
        getDoc(
            doc(db, "users", auth.currentUser.uid)
          ).then((res) => {
            const data = res.data();
            setBufferTime(data.bufferTime)
          }
        )
    }, [])

    const saveChanges = () => {
        // Save worktime to firebase
        const taskDocRef = doc(db, "users", auth.currentUser.uid);

        setDoc(taskDocRef, {
            bufferTime: bufferTime
        }, {merge:true})
        .then(() => {
            console.log("Buffer time updated in Firestore");
        })
        .catch((error) => {
            console.error("Error updating buffer time: ", error);
        });
    }

    return (
        <Accordion disableGutters>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-1-content" id="panel1-1-header">
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    Buffer Time
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                    {bufferTime + " minutes"}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{textAlign: "center"}}>
                <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        id="outlined-number"
                        label="Buffer Time"
                        type="number"
                        value={bufferTime}
                        onChange={(event) => setBufferTime(Number(event.target.value))}
                        slotProps={{
                            inputLabel: {
                            shrink: true,
                            },
                        }}
                    />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <Button 
                            variant="contained"
                            sx={{textTransform: "None", backgroundColor: "#6d3b79"}}
                            onClick={saveChanges}
                        >
                            <Typography>Save Changes</Typography>
                        </Button>
                    </FormControl>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
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
                <WorkTimesAccordion />
                <BufferTimeAccordion />
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