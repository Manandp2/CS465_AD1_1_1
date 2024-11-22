import { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import './App.css';

// Define your constants here
const google = window.google;

const CLIENT_ID = "614127097265-pdklurnj0e83fnd2m6s797gq67c1u4aq.apps.googleusercontent.com";
const API_KEY = "AIzaSyDZYd2i-rX4oN_7i2AeSwGeJ0Uq2jo_Rng";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";
let CalenDoneID = "";
let tokenClient;
let gapiInited = false;
let gisInited = false;

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [content, setContent] = useState('');
  const [contentCalendar, setContentCalendar] = useState('');

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    script2.onload = gisLoaded;
    document.body.appendChild(script2);
  }, []);

  const gapiLoaded = () => {
    gapi.load('client', initializeGapiClient);
  };

  const initializeGapiClient = async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  };

  const gisLoaded = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
  };

  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById('authorize_button').style.visibility = 'visible';
    }
  };

  const handleAuthClick = () => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      setIsAuthorized(true);
      document.getElementById('authorize_button').innerText = 'Refresh';

      await listUpcomingEvents();
      const isCalenDonePresent = await findCalenDoneCalendar();
      if (!isCalenDonePresent) {
        await createCalendar();
      }
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const handleSignoutClick = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      setContent('');
      document.getElementById('authorize_button').innerText = 'Authorize';
      setIsAuthorized(false);
    }
  };

  const listUpcomingEvents = async () => {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      setContent(err.message);
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      setContent('No events found.');
      return;
    }
    const output = events.reduce(
      (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
      'Events:\n'
    );
    setContent(output);
  };

  const findCalenDoneCalendar = async () => {
    let response;
    try {
      response = await gapi.client.calendar.calendarList.list();
    } catch (err) {
      setContentCalendar(err.message);
      return false;
    }

    const calendars = response.result.items;
    for (let i = 0; i < calendars.length; i++) {
      const calendar = calendars[i];
      if (calendar.summary === 'CalenDone') {
        CalenDoneID = calendar.id;
        return true;
      }
    }
    return false;
  };

  const createCalendar = async () => {
    let response;
    try {
      const request = {
        resource: {
          summary: 'CalenDone',
        },
      };
      response = await gapi.client.calendar.calendars.insert(request);
    } catch (err) {
      setContentCalendar(err.message);
      return;
    }
    CalenDoneID = response.result.id;
  };

  const exampleEvent = {
    summary: "sleep eternally",
    start: {
      dateTime: "2024-11-19T09:00:00-02:00",
      timeZone: "America/Chicago",
    },
    end: {
      dateTime: "2024-11-19T17:00:00-02:00",
      timeZone: "America/Chicago",
    }
  };

  const createNewEvent = async () => {
    let response;
    try {
      const request = {
        calendarId: CalenDoneID,
        resource: exampleEvent,
      };
      response = await gapi.client.calendar.events.insert(request);
    } catch (err) {
      setContentCalendar(err.message);
      return;
    }
  };

  return (
    <div>
      <p>Google Calendar API Quickstart</p>
      <div>
        <button id="authorize_button" onClick={handleAuthClick} style={{ visibility: 'hidden' }}>
          Authorize
        </button>
        <button id="signout_button" onClick={handleSignoutClick} style={{ visibility: isAuthorized ? 'visible' : 'hidden' }}>
          Sign Out
        </button>
      </div>
      <button id="event_create" onClick={createNewEvent}>
        Create an Event
      </button>
      <div>
        <pre id="content" style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
      </div>
      <div>
        <pre id="content_calendar" style={{ whiteSpace: 'pre-wrap' }}>{contentCalendar}</pre>
      </div>
    </div>
  );
}

export default App;