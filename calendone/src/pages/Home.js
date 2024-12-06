import React, { useEffect, useState } from "react";

import Bottombar from "../components/Bottombar";
import TaskList from "../components/TaskList";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Paper } from "@mui/material";

import { signOut } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import {collection, doc, getDocs, writeBatch} from "firebase/firestore";
import RecapDialog from "../components/RecapDialog";
export default function Home({ setUser, setPage }) {
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

  const [unscheduledTasks, setUnscheduledTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [bottomBarStatus, setBottomBarStatus] = useState("Home");
  const [unschedChecked, setUnschedChecked] = React.useState([]);
  const [schedChecked, setSchedChecked] = React.useState([]);
  const [newCompletedExist, setNewCompletedExist] = React.useState(true);

  const scheduleTasksFromFirestore = () => {
    const batch = writeBatch(db);  // Create a new batch instance
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    unschedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.update(taskDocRef, { isScheduled: true }); // Add the update operation to the batch
    });

    batch.commit()
    .then(() => {
      setUnschedChecked([]);
      getTasks();
    })
  }

  const unscheduleTasksFromFirestore = () => {
    const batch = writeBatch(db);  // Create a new batch instance
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    schedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.update(taskDocRef, { isScheduled: false }); // Add the update operation to the batch
    });

    batch.commit()
    .then(() => {
      setSchedChecked([]);
      getTasks();
    })
  }

  const getTasks = () => {
    const tasksCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");
    getDocs(tasksCollectionRef)
      .then((querySnapshot) => {
        setUnscheduledTasks([]);
        setScheduledTasks([]);
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          const fullTask = {
            name: task.name,
            description: task.description,
            dueDate: task.dueDate.toDate(),
            duration: task.duration,
            isScheduled: task.isScheduled,
            isComplete: task.isComplete,
            id: doc.id,
            gCalId: task.gCalId,
          };
          if (task.isScheduled && !task.isComplete) {
            setScheduledTasks((prev) => [...prev, fullTask]);
          } else if (!task.isScheduled && !task.isComplete) {
            setUnscheduledTasks((prev) => [...prev, fullTask]);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const sLen = schedChecked.length;
    const uLen = unschedChecked.length;
    if (sLen === 0 && uLen === 0) {
      setBottomBarStatus("Home");
    } else if (sLen === 0) {
      setBottomBarStatus("HomeUnscheduled");
    } else if (uLen === 0) {
      setBottomBarStatus("HomeScheduled");
    } else {
      setBottomBarStatus("HomeMixed");
    }
    // console.log("BRUH", sLen, uLen);
  }, [schedChecked, unschedChecked]);

  return (
    <div>
      <RecapDialog open={newCompletedExist} setOpen={setNewCompletedExist} />
      <Paper square elevation={3} sx={{ backgroundColor: "white", color: "white", paddingY: "3%" }}>
        <Typography variant="h4">PLACEHOLDER</Typography>
      </Paper>
      <Paper sx={{ overflowY: "scroll" }}>
        <Button onClick={SignOut}>Sign Out</Button>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography>Unscheduled Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList
                taskList={unscheduledTasks}
                checked={unschedChecked}
                setChecked={setUnschedChecked}
                getTasks={getTasks}
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography>Scheduled Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList
                taskList={scheduledTasks}
                checked={schedChecked}
                setChecked={setSchedChecked}
                getTasks={getTasks}
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* TOPBAR */}
      <Paper
        square
        elevation={3}
        sx={{
          backgroundColor: "#6d3b79",
          color: "white",
          paddingY: "3%",
          position: "fixed",
          top: "0",
          left: 0,
          right: 0,
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          CalenDone
        </Typography>
      </Paper>
      {/* {unschedChecked.length === 0 && schedChecked.length === 0 ? (
        <Bottombar status={"Home"} setPage={setPage} getTasks={getTasks} />
      ) : (
        <Bottombar status={"Selected Home"} setPage={setPage} />
      )} */}
      <Bottombar status={bottomBarStatus} setPage={setPage} getTasks={getTasks} scheduleTasks={scheduleTasksFromFirestore} unscheduleTasks={unscheduleTasksFromFirestore}/>
    </div>
  );
}
