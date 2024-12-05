import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";
import BreakAddDialog from "../components/BreakAddDialog";
import BreakEditDialog from "../components/BreakEditDialog";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { CssBaseline, IconButton, Paper } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { doc, updateDoc, collection, setDoc } from "firebase/firestore";

function BreakList({ breakList, setBreakList }) {
  const deleteBreak = (valueToDelete) => {
    setBreakList((prevList) => prevList.filter(item => item !== valueToDelete));
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {breakList.map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
            <ListItem 
                key={value}
                secondaryAction={
                <Box edge="end">
                    <BreakEditDialog itemToEdit={value} breakList={breakList} setBreakList={setBreakList} />
                    <IconButton onClick={() => deleteBreak(value)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
                }
                dense
            >
                <ListItemText 
                    primary={value}
                    secondary={"Insert break times here"} />
            </ListItem>
        );
      })}
    </List>
  );
}

function BreaksAccordion({breakList, setBreakList}) {
    return (
        <Accordion disableGutters defaultExpanded>
            <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-1-content" id="panel1-1-header">
                <Typography>Breaks</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{textAlign: "center"}}>
                <BreakAddDialog setBreakList={setBreakList} />
                <BreakList breakList={breakList} setBreakList={setBreakList} />
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
                    sx={{ textTransform: "None", color: "#6d3b79"}}
                >
                    <Typography>Google Calendar</Typography>
                </Button>
            </AccordionDetails>
        </Accordion>
    )
}

function AccountAccordion({SignOut}) {
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
                    sx={{ textTransform: "None", color: "#6d3b79"}}
                >
                    <Typography>Sign Out</Typography>
                </Button>
            </AccordionDetails>
        </Accordion>
    )
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

    const [breakList, setBreakList] = React.useState([]);

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
                <BreaksAccordion breakList={breakList} setBreakList={setBreakList} />
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