import './Topbar.css';

import React from "react";
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

export default function Topbar({header}) {
    return (
        <div className='topbar-body'>
            <h1>{header}</h1>   
        </div>
    )
}