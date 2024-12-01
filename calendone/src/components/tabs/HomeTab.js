import React from "react";
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/secondary-tab.js';
import '@material/web/tabs/tabs.js';

export default function HomeTab({onSet}) {
    let tabs = document.getElementById("tabs");
    if (tabs) {
        tabs.addEventListener('change', (event) => {
            onSet(event.target.activeTabIndex)
        })
    }
    return (
        <div>
            <md-tabs id="tabs">
                <md-secondary-tab>Unscheduled</md-secondary-tab>
                <md-secondary-tab>Scheduled</md-secondary-tab>
                <md-secondary-tab>Completed</md-secondary-tab>
            </md-tabs>
        </div>
    )
}