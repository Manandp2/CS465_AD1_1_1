import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";
import TaskList from "../components/TaskList";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CssBaseline, Paper } from "@mui/material";

import { signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { doc, updateDoc, collection, setDoc } from "firebase/firestore";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Completed({ setUser, setPage }) {
  const [isSelected, setIsSelected] = useState(false);
  // const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [completedChecked, setCompletedChecked] = React.useState([]);
  const [showRecapModal, setShowRecapModal] = useState(false);

  const completedList = [];
  for (let i = 0; i < 10; i++) {
    completedList.push("Completed Task " + i);
  }

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
            <Typography>Completed Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList taskList={completedList} checked={completedChecked} setChecked={setCompletedChecked} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Topbar header={"CalenDone"} />
      {completedChecked.length === 0 ? (
        <Bottombar status={"Completed"} setPage={setPage} />
      ) : (
        <Bottombar status={"Selected Completed"} setPage={setPage} />
      )}
    </div>
  );
}
