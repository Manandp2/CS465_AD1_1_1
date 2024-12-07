import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Topbar from "../components/Topbar";
import Bottombar from "../components/Bottombar";
import TaskList from "../components/TaskList";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Paper, Checkbox } from "@mui/material";

import { auth, db } from "../utils/firebase";
import {collection, doc, getDoc, getDocs, writeBatch} from "firebase/firestore";
import {gapi} from 'gapi-script';

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
export default function Completed({ setPage }) {
  const [completedChecked, setCompletedChecked] = React.useState([]);
  const [allCompletedChecked, setAllCompletedChecked] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    if (allCompletedChecked) {
      setCompletedChecked([]);
      completedTasks.forEach((task) => {
        setCompletedChecked((prev) => [...prev, task.id]);
      });
    } else {
      setCompletedChecked([]);
    }
  }, [allCompletedChecked]);

  const getTasks = async () => {
    const tasksCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");

    try {
      const querySnapshot = await getDocs(tasksCollectionRef);

      // Reset the tasks arrays
      setCompletedTasks([]);
      let localScheduledTasks = [];
      let promises = [];

      const docRef = doc(db, "users", auth.currentUser.uid);
      let calendarId;
      try {
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        calendarId = data.calendarId;
      } catch (error) {
      }


      querySnapshot.forEach((doc) => {
        const task = doc.data();
        let fullTask = {
          name: task.name,
          description: task.description,
          dueDate: task.dueDate.toDate(),
          duration: task.duration,
          isScheduled: task.isScheduled,
          isComplete: task.isComplete,
          id: doc.id,
          gCalId: task.gCalId,
        };

        if (task.isScheduled && task.isComplete) {
          localScheduledTasks.push(fullTask);

          // Fetch the event end time from Google Calendar
          const promise = new Promise((resolve) => {
            const request = gapi.client.calendar.events.get({
              calendarId: calendarId,
              eventId: task.gCalId,
            });
//https://content.googleapis.com/calendar/v3/calendars//events/l8k6lpmuki4sln35m40lp9u1do?key=AIzaSyDZYd2i-rX4oN_7i2AeSwGeJ0Uq2jo_Rng
            request.execute((event) => {
              if (!event.error) {
                fullTask.endTime = new Date(event.end.dateTime);
                fullTask.startTime = new Date(event.start.dateTime);
                resolve(fullTask);
              } else {
                console.log(event.error);
                resolve(fullTask);
              }
            });
          });

          promises.push(promise);
        } else if (!task.isScheduled && task.isComplete) {
          // setCompletedTasks((prev) => [...prev, fullTask]);
          const promise = new Promise((resolve) => {
            resolve(fullTask);
          })
          promises.push(promise);
        }
      });
      const scheduledTasksWithEndTimes = await Promise.all(promises);
      console.log("scheduledTasksWithEndTimes", scheduledTasksWithEndTimes);
      setCompletedTasks(scheduledTasksWithEndTimes);
      return localScheduledTasks;
    } catch (error) {
      console.log(error);
    }
  };

  const unCompleteTasks = () => {
    const batch = writeBatch(db); // Create a new batch instance
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    completedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.update(taskDocRef, { isComplete: false, isScheduled: false }); // Add the update operation to the batch
    });

    batch.commit().then(() => {
      setCompletedChecked([]);
      getTasks();
    });
  };

  const deleteTasksFromFirestore = () => {
    const batch = writeBatch(db); // Create a new batch instance
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    completedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.delete(taskDocRef); // Add the update operation to the batch
    });

    batch.commit().then(() => {
      setCompletedChecked([]);
      getTasks();
    });
  };

  useEffect(() => {
    getTasks();
  }, []);
  return (
    <div>
      <Paper square elevation={3} sx={{ backgroundColor: "white", color: "white", paddingY: "3%" }}>
        <Typography variant="h4">PLACEHOLDER</Typography>
      </Paper>
      <Paper sx={{ overflowY: "scroll" }}>
        <Accordion disableGutters expanded>
          <AccordionSummary
            // expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Checkbox
              edge="start"
              onClick={(e) => {
                e.stopPropagation();
                setAllCompletedChecked(!allCompletedChecked);
              }}
              checked={allCompletedChecked}
              disabled={completedTasks.length === 0}
            />
            <Typography Typography sx={{ display: "flex", alignItems: "center" }}>
              Completed Tasks
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList
                taskList={completedTasks}
                checked={completedChecked}
                setChecked={setCompletedChecked}
                getTasks={getTasks}
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Topbar header={"CalenDone"} />
      {completedChecked.length === 0 ? (
        <Bottombar status={"Completed"} setPage={setPage} />
      ) : (
        <Bottombar
          status={"Selected Completed"}
          setPage={setPage}
          unCompleteTasks={unCompleteTasks}
          deleteCompletedTasks={deleteTasksFromFirestore}
        />
      )}
    </div>
  );
}
