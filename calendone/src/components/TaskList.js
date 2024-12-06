import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import EditDialog from "./EditDialog";

export default function TaskList({ taskList, checked, setChecked, getTasks }) {
  // const [checked, setChecked] = React.useState([0]);

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

  // const handleEdit = (value) => () => {

  // }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {taskList.map(({ name, description, dueDate, duration, isScheduled, isComplete, id, gCalId }, i) => {
        const labelId = `checkbox-list-label-${id}`;
        if (i === 0) {
          return (
            <ListItem
              key={id}
              secondaryAction={
                // <IconButton edge="end" aria-label="comments">
                //   <EditIcon/>
                // </IconButton>
                <EditDialog
                  name={name}
                  description={description}
                  dueDate={dueDate}
                  duration={duration}
                  isScheduled={isScheduled}
                  isComplete={isComplete}
                  id={id}
                  gCalId={gCalId}
                  getTasks={getTasks}
                />
              }
              // disablePadding
              sx={{ paddingY: 0, marginTop: -2 }}
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
                      ? "SHCELDUED TIME"
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
            secondaryAction={
              // <IconButton edge="end" aria-label="comments">
              //   <EditIcon/>
              // </IconButton>
              <EditDialog
                name={name}
                description={description}
                dueDate={dueDate}
                duration={duration}
                isScheduled={isScheduled}
                isComplete={isComplete}
                id={id}
                gCalId={gCalId}
                getTasks={getTasks}
              />
            }
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
                    ? "SHCELDUED TIME"
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
  );
}
