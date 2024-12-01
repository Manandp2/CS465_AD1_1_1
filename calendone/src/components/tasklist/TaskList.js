import './TaskList.css'

import React from "react";
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

export default function TaskList({taskList, onShow, onHide}) {
    return (
        <div>
            <p>Buttons are for testing purposes. Remove later...</p>
            <button onClick={onHide}>Unselect</button>
            <button onClick={onShow}>Select</button>
            <md-list>
                {taskList.map(task => (
                    <TaskItem task={task} />
                ))}
            </md-list>
        </div>
    )
}

function TaskItem({task}) {
    return (
        <md-list-item type="button">
            <div slot="start">{task}</div>
            <md-icon-button slot="end">
                <md-icon>edit</md-icon>
            </md-icon-button>
        </md-list-item>
    )
}