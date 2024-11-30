import React from "react";
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/secondary-tab.js';
import '@material/web/tabs/tabs.js';

export default function HomeBottombar() {
    return (
        <div>
            <p>Insert bottom bar here</p>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=settings" />
            <md-tabs>
                <md-primary-tab>Settings</md-primary-tab>
                <md-primary-tab>Add</md-primary-tab>
                <md-primary-tab>Completed</md-primary-tab>
            </md-tabs>
        </div>
    )
}