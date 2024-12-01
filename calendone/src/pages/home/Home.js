import "./Home.css";
import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import Topbar from "../../components/topbar/Topbar";
import Bottombar from "../../components/bottombar/Bottombar";
// import HomeTab from "../../components/tabs/HomeTab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TaskList from "../../components/TaskList";

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
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const unschedList = [];
  for (let i = 0; i < 20; i++) {
    unschedList.push("Unscheduled Task " + i);
  }

  const schedList = [];
  for (let i = 0; i < 20; i++) {
    schedList.push("Scheduled Task " + i);
  }

  const completeList = [];
  for (let i = 0; i < 20; i++) {
    completeList.push("Completed Task " + i);
  }

  const [tab, setTab] = React.useState(0);

  return (
    <div className="pagebody">
      <div className="top">
        <Topbar header={"CalenDone"} />
        {/* <HomeTab onSet={(num) => setActiveTabIndex(num)} /> */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={(event, newValue) => {
                setTab(newValue);
              }}
              variant="fullWidth"
              aria-label="basic tabs example"
            >
              <Tab label="Unscheduled" {...a11yProps(0)} />
              <Tab label="Scheduled" {...a11yProps(1)} />
              <Tab label="Completed" {...a11yProps(2)} />
            </Tabs>
          </Box>
        </Box>
      </div>
      <div className="middle">
        {activeTabIndex === 0 && (
          <TaskList taskList={unschedList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />
        )}
        {activeTabIndex === 1 && (
          <TaskList taskList={schedList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />
        )}
        {activeTabIndex === 2 && (
          <TaskList taskList={completeList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />
        )}
      </div>
      <div className="bottom">{isSelected && <Bottombar />}</div>
    </div>
  );
}
