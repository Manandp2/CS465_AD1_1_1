import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from '@mui/icons-material/Add';
import { CssBaseline, IconButton, Paper } from "@mui/material";

import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { doc, updateDoc, collection, setDoc } from "firebase/firestore";

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
                <Accordion disableGutters>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-1-content" id="panel1-1-header">
                    <Typography>Breaks</Typography>
                </AccordionSummary>
                    <AccordionDetails>
                        <Button 
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{textTransform: "None", backgroundColor: "#6d3b79"}}
                        >
                            <Typography>Add Break</Typography>
                        </Button>
                    </AccordionDetails>
                </Accordion>

                {/* <Accordion disableGutters>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-2-content" id="panel1-2-header">
                    <Typography>Time limit per session</Typography>
                </AccordionSummary>
                    <AccordionDetails>
                        
                    </AccordionDetails>
                </Accordion> */}
            </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
                <Typography>Google</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Button 
                    href="https://calendar.google.com" 
                    target="_blank" 
                    startIcon={<CalendarTodayIcon />}
                    color="primary"
                    sx={{ textTransform: "None", color: "#6d3b79"}}
                >
                    <Typography>Google Calendar</Typography>
                </Button>
            </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel3-content" id="panel3-header">
                <Typography>Account</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Button 
                    onClick={SignOut} 
                    startIcon={<LogoutIcon />}
                    color="primary"
                    sx={{ textTransform: "None", color: "#6d3b79"}}
                >
                    <Typography>Sign Out</Typography>
                </Button>
            </AccordionDetails>
            </Accordion>
        </Paper>

        <Topbar header={"Settings"} />
        <Bottombar status={"Settings"} setPage={setPage} />
        </div>
    );
}