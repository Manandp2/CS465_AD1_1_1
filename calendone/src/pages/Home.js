import React, { useEffect, useState } from "react";

import Bottombar from "../components/Bottombar";
import TaskList from "../components/TaskList";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Checkbox, Paper } from "@mui/material";

import { auth, db } from "../utils/firebase";
import { collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import RecapDialog from "../components/RecapDialog";
import { gapi } from "gapi-script";
import scheduleTodos from "../utils/calendoneAmogus";

export default function Home({ setPage }) {
  const [unscheduledTasks, setUnscheduledTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [bottomBarStatus, setBottomBarStatus] = useState("Home");

  const [allUnschedChecked, setAllUnschedChecked] = useState(false);
  const [allSchedChecked, setAllSchedChecked] = useState(false);

  const [unschedChecked, setUnschedChecked] = React.useState([]);
  const [schedChecked, setSchedChecked] = React.useState([]);

  const [accessToken, setAccessToken] = useState("");
  const [calendarId, setCalendarId] = useState("");

  const [recapChecked, setRecapChecked] = React.useState([]);
  const [recapEvents, setRecapEvents] = useState([]);

  const [newCompletedExist, setNewCompletedExist] = React.useState(false);

  const checkEventsForRecap = async (scheduledTasks) => {
    const now = new Date();
    setRecapEvents([]);
    let ahdoahdo = false;
    scheduledTasks.forEach((eventEnd) => {
      if (eventEnd.endTime < now) {
        setRecapEvents((prevRecapEvents) => [...prevRecapEvents, eventEnd]);
        // setNewCompletedExist(true);
        ahdoahdo = true;
      }
    });
    setNewCompletedExist(ahdoahdo);
    // return eventEnds; // Return the array of event ends if needed
  };
  const unscheduleTasksFromFirestore = () => {
    const batch = writeBatch(db); // Create a new batch instance
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    schedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.update(taskDocRef, { isScheduled: false }); // Add the update operation to the batch
    });

    batch.commit().then(() => {
      setSchedChecked([]);
      setAllSchedChecked(false);
      getTasks();
    });
  };

  const completeTasksFromFirestore = () => {
    const batch = writeBatch(db); // Create a new batch instance
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    schedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.update(taskDocRef, { isComplete: true }); // Add the update operation to the batch
    });

    unschedChecked.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task); // Create a reference to the document
      batch.update(taskDocRef, { isComplete: true }); // Add the update operation to the batch
    });

    batch.commit().then(() => {
      setSchedChecked([]);
      setUnschedChecked([]);
      getTasks();
    });
  };

  const getTasks = async () => {
    const tasksCollectionRef = collection(db, "users", auth.currentUser.uid, "tasks");

    try {
      const querySnapshot = await getDocs(tasksCollectionRef);

      // Reset the tasks arrays
      setUnscheduledTasks([]);
      setScheduledTasks([]);
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

        if (task.isScheduled && !task.isComplete) {
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
        } else if (!task.isScheduled && !task.isComplete) {
          setUnscheduledTasks((prev) => [...prev, fullTask]);
        }
      });
      const scheduledTasksWithEndTimes = await Promise.all(promises);
      console.log("scheduledTasksWithEndTimes", scheduledTasksWithEndTimes);
      setScheduledTasks(scheduledTasksWithEndTimes);
      return localScheduledTasks;
    } catch (error) {
      console.log(error);
    }
  };

  const getAccessToken = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);

    try {
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      setAccessToken(data.accessToken);
      setCalendarId(data.calendarId);
      return data.calendarId;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const l = await getTasks();
      await getAccessToken();
      await checkEventsForRecap(l);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (allUnschedChecked) {
      setUnschedChecked([]);
      unscheduledTasks.forEach((task) => {
        setUnschedChecked((prev) => [...prev, task.id]);
      });
    } else {
      setUnschedChecked([]);
    }
  }, [allUnschedChecked]);

  useEffect(() => {
    if (allSchedChecked) {
      setSchedChecked([]);
      scheduledTasks.forEach((task) => {
        setSchedChecked((prev) => [...prev, task.id]);
      });
    } else {
      setSchedChecked([]);
    }
  }, [allSchedChecked]);

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
      <RecapDialog
        open={newCompletedExist}
        setOpen={setNewCompletedExist}
        taskList={recapEvents}
        checked={recapChecked}
        setChecked={setRecapChecked}
        getTasks={getTasks}
      />
      <Paper square elevation={3} sx={{ backgroundColor: "white", color: "white", paddingY: "3%" }}>
        <Typography variant="h4">PLACEHOLDER</Typography>
      </Paper>
      <Paper variant="outlined" square elevation={0} sx={{ overflowY: "scroll" }}>
        <Accordion disableGutters defaultExpanded>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
            <Checkbox
              edge="start"
              onClick={(e) => {
                e.stopPropagation();
                setAllUnschedChecked(!allUnschedChecked);
              }}
              checked={allUnschedChecked}
              disabled={unscheduledTasks.length === 0}
            />
            <Typography sx={{ display: "flex", alignItems: "center" }}>Unscheduled Tasks</Typography>
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
        <Accordion disableGutters defaultExpanded>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
            <Checkbox
              edge="start"
              onClick={(e) => {
                e.stopPropagation();
                setAllSchedChecked(!allSchedChecked);
              }}
              checked={allSchedChecked}
              disabled={scheduledTasks.length === 0}
            />
            <Typography sx={{ display: "flex", alignItems: "center" }}>Scheduled Tasks</Typography>
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
      <Bottombar
        status={bottomBarStatus}
        setPage={setPage}
        getTasks={getTasks}
        scheduleTasks={() => {
          scheduleTodos(unschedChecked, accessToken).then(() => getTasks());
        }}
        unscheduleTasks={unscheduleTasksFromFirestore}
        unSchedChecked={unschedChecked}
        setUnschedChecked={setUnschedChecked}
        schedChecked={schedChecked}
        setSchedChecked={setSchedChecked}
        completeTasks={completeTasksFromFirestore}
        calendarId={calendarId}
      />
    </div>
  );
}
