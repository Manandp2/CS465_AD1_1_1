import './Home.css';
import React from "react";
import { useState } from "react";

import Topbar from '../../components/topbar/Topbar';
import Bottombar from "../../components/bottombar/Bottombar";
import HomeTab from '../../components/tabs/HomeTab';
import TaskList from '../../components/tasklist/TaskList';

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
    
    return (
        <div className='pagebody'>
            <div className='top'>
                <Topbar header={"CalenDone"} />
                <HomeTab onSet={(num) => setActiveTabIndex(num)} />
            </div>
            <div className='middle'>
                {(activeTabIndex === 0) && <TaskList taskList={unschedList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />}
                {(activeTabIndex === 1) && <TaskList taskList={schedList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />}
                {(activeTabIndex === 2) && <TaskList taskList={completeList} onShow={() => setIsSelected(true)} onHide={() => setIsSelected(false)} />}
            </div>
            <div className='bottom'>
                {isSelected && <Bottombar />}
            </div>
        </div>
    )
}