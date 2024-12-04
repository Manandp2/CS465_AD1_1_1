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

export default function Home({ setUser, setPage }) {
  // const [activeTabIndex, setActiveTabIndex] = useState(0);

  const unschedList = [];
  for (let i = 0; i < 5; i++) {
    unschedList.push("Unscheduled Task " + i);
  }

  const schedList = [];
  for (let i = 0; i < 10; i++) {
    schedList.push("Scheduled Task " + i);
  }

  // const [checkedUnsched, setCheckedUnsched] = React.useState([0]);
  const [unschedChecked, setUnschedChecked] = React.useState([]);
  const [schedChecked, setSchedChecked] = React.useState([]);

  return (
    <div>
      <Paper square elevation={3} sx={{ backgroundColor: "white", color: "white", paddingY: "3%" }}>
        <Typography variant="h4">PLACEHOLDER</Typography>
      </Paper>
      <Paper sx={{ overflowY: "scroll" }}>
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography>Unscheduled Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList taskList={unschedList} checked={unschedChecked} setChecked={setUnschedChecked} />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography>Scheduled Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList taskList={schedList} checked={schedChecked} setChecked={setSchedChecked} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Topbar header={"CalenDone"} />
      {unschedChecked.length === 0 ? (
        <Bottombar status={"Home"} setPage={setPage} />
      ) : (
        <Bottombar status={"Selected Home"} setPage={setPage} />
      )}
    </div>
  );
}
