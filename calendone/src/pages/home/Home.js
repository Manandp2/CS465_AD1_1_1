import "./Home.css";
import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Topbar from "../../components/Topbar";
import Bottombar from "../../components/bottombar/Bottombar";
// import HomeTab from "../../components/tabs/HomeTab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TaskList from "../../components/TaskList";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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

export default function Home() {
  const [isSelected, setIsSelected] = useState(false);
  // const [activeTabIndex, setActiveTabIndex] = useState(0);

  const unschedList = [];
  for (let i = 0; i < 5; i++) {
    unschedList.push("Unscheduled Task " + i);
  }

  const schedList = [];
  for (let i = 0; i < 5; i++) {
    schedList.push("Scheduled Task " + i);
  }

  // const completeList = [];
  // for (let i = 0; i < 20; i++) {
  //   completeList.push("Completed Task " + i);
  // }
  // const [tab, setTab] = React.useState(0);

  return (
    <div className="pagebody">
      <div className="top">
        <Topbar header={"CalenDone"} />
        {/* <HomeTab onSet={(num) => setActiveTabIndex(num)} /> */}
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography>Unscheduled Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList taskList={unschedList} />
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography>Scheduled Tasks</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: "0" }}>
            <Typography>
              <TaskList taskList={schedList} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="middle">
        {/* {activeTabIndex === 2 && (
          <TaskList taskList={completeList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />
        )} */}
      </div>
      <div className="bottom">{isSelected && <Bottombar />}</div>
    </div>
  );
}
