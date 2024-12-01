import './Bottombar.css';

import React from "react";
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

export default function Bottombar() {
    return (
        <div className='bottombar-body'>
            <md-icon-button>
                <md-icon>
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                </md-icon>
            </md-icon-button>
            <md-icon-button>
            <md-icon>
                    <span class="material-symbols-outlined">
                        calendar_clock
                    </span>
                </md-icon>
            </md-icon-button>
            <md-icon-button>
                <md-icon>
                    <span class="material-symbols-outlined">
                        check
                    </span>
                </md-icon>
            </md-icon-button>
        </div>
    )
}