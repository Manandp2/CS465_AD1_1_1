import React from "react";
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/secondary-tab.js';
import '@material/web/tabs/tabs.js';

// Icons
// import '@material-ui/icons/Settings';

export default function HomeBottombar() {
    return (
        <div>
            <md-tabs>
                <md-primary-tab>Settings</md-primary-tab>
                <md-primary-tab>Add</md-primary-tab>
                <md-primary-tab>Completed</md-primary-tab>
            </md-tabs>
        </div>
    )
}