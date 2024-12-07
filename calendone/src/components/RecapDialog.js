import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Checkbox,
  Button,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {doc, getDoc, writeBatch} from 'firebase/firestore';
import {auth, db} from '../utils/firebase';
import {removeFromGoogleCalendar} from '../utils/calendoneAmogus';

export default function RecapDialog({ open, setOpen, taskList, checked, setChecked, getTasks }) {
  const handleClose = () => setOpen(false);
  // Default tasks
  // const [tasks, setTasks] = useState([
  //   { id: 1, name: "Task 1", selected: true },
  //   { id: 2, name: "Task 2", selected: true },
  //   { id: 3, name: "Task 3", selected: true },
  //   { id: 4, name: "Task 4", selected: true },
  // ]);

  // Toggle task selection
  // const toggleTaskSelection = (taskId) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) => (task.id === taskId ? { ...task, selected: !task.selected } : task))
  //   );
  // };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log(newChecked);
  };

// Initial check for all tasks when component mounts
  React.useEffect(() => {
    const allTaskIds = taskList.map(task => task.id);
    setChecked(allTaskIds);
  }, [taskList]);


  const updateTasksInFirestore = async () => {
    const batch = writeBatch(db);
    const tasksCollectionPath = `users/${auth.currentUser.uid}/tasks`;

    const docRef = doc(db, "users", auth.currentUser.uid);
    let calendarId;
    try {
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      calendarId = data.calendarId;
    } catch (error) {
    }

    taskList.forEach((task) => {
      const taskDocRef = doc(db, tasksCollectionPath, task.id); // Create a reference to the document
      console.log(task.id);
      if (checked.indexOf(task.id) !== -1) {
        batch.update(taskDocRef, { isComplete: true }); // Add the update operation to the batch
      } else {

        removeFromGoogleCalendar(calendarId, task.gCalId)
        batch.update(taskDocRef, { isScheduled: false, gCalId: null }); // Add the update operation to the batch
      }
    });

    try {
      await batch.commit();
      console.log("Tasks successfully updated in Firestore");
    } catch (error) {
      console.error("Error updating tasks in Firestore: ", error);
    }
  };

  
  return (
    // <Modal open={open} onClose={onClose} aria-labelledby="recap-modal-title" aria-describedby="recap-modal-description">
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          // editTodoInFirestore();
          updateTasksInFirestore().then(() =>{
            getTasks();
            handleClose();
          });
        },
      }}
    >
      <DialogTitle sx={{ paddingBottom: 1 }}>Overdue Recap</DialogTitle>

      <DialogContent>
        <DialogContentText>De-select incomplete tasks</DialogContentText>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {taskList.map(({ name, description, dueDate, duration, isScheduled, isComplete, id, gCalId, endTime, startTime }, i) => {
            const labelId = `checkbox-list-label-${id}`;
            if (i === 0) {
              return (
                <ListItem
                  key={id}
                  // disablePadding
                  sx={{ paddingY: 0, marginTop: 0 }}
                >
                  <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.includes(id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={name}
                      secondary={
                        isScheduled
                          ? "Scheduled: " +
                          startTime.toLocaleDateString(undefined, {
                            month: "numeric",
                            day: "numeric"
                          })
                          + " at " +
                          startTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }) + " - " +
                          endTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "Due: " +
                            dueDate.toLocaleDateString() +
                            " at " +
                            dueDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            }
            return (
              <ListItem
                key={id}
                // disablePadding
                sx={{ paddingY: 0 }}
              >
                <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={name}
                    secondary={
                      isScheduled
                        ? "Scheduled: " +
                        startTime.toLocaleDateString(undefined, {
                          month: "numeric",
                          day: "numeric"
                        })
                        + " at " +
                        startTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }) + " - " +
                        endTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : "Due: " +
                          dueDate.toLocaleDateString() +
                          " at " +
                          dueDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions>
        <Button type={"submit"}>DONE</Button>
      </DialogActions>
    </Dialog>
  );
}
