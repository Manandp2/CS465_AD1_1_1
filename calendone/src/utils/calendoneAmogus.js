import {doc, getDoc, updateDoc} from "firebase/firestore";
import {auth, db} from "./firebase";
import {gapi} from 'gapi-script';


const getGoogleCalendarEvents = async (accessToken) => {
  await new Promise((resolve) => gapi.load("client:auth2", resolve));

  await gapi.client.init({
    apiKey: "AIzaSyDZYd2i-rX4oN_7i2AeSwGeJ0Uq2jo_Rng",
    clientId: "614127097265-pdklurnj0e83fnd2m6s797gq67c1u4aq.apps.googleusercontent.com",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: "https://www.googleapis.com/auth/calendar",
  });

  gapi.auth.setToken({ access_token: accessToken });

  let eventsFromCalendar = [];

  try {
    const response = await gapi.client.calendar.calendarList.list();
    const calendars = response.result.items;

    if (calendars.length > 0) {
      const fetchEventsPromises = calendars.map(async (calendar) => {
        try {
          const resp = await gapi.client.calendar.events.list({
            calendarId: calendar.id,
            timeMin: new Date().toISOString(),
            timeMax: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
            singleEvents: true,
            orderBy: "startTime",
          });

          const events = resp.result.items;
          events.forEach((event) => {
            if (event.start.dateTime && event.end.dateTime) {
              eventsFromCalendar.push({
                calendar: calendar.summary,
                start: new Date(event.start.dateTime),
                end: new Date(event.end.dateTime),
              });
            }
          });
        } catch (error) {
          console.error(`Error fetching events from calendar ${calendar.summary}:`, error);
        }
      });

      await Promise.all(fetchEventsPromises);
    }
  } catch (error) {
    console.error("Error fetching calendars:", error);
    throw error;
  }
  return eventsFromCalendar;
};

// Helper function to send a slotted Todo to Google Calendar
async function removeFromGoogleCalendar(calendarId, eventId) {
  try {
    const request = gapi.client.calendar.events.delete({
      calendarId: calendarId, // Use the user's primary calendar
      eventId: eventId
    });

    await request.execute((event) => {
      console.log(`Event deleted with Google Calendar ID: `, eventId);
    });
  } catch (error) {
    console.error("Error deleting todo in Google Calendar:", error);
  }
}

// Helper function to send a slotted Todo to Google Calendar
async function sendToGoogleCalendar(calendarId, todo) {
  try {
    const event = {
      summary: todo.name,
      start: {
        dateTime: todo.startTime,
        // timeZone: 'America/Chicago' // Change as needed
      },
      end: {
        dateTime: todo.endTime,
        // timeZone: 'America/Chicago' // Change as needed
      }
    };

    const request = gapi.client.calendar.events.insert({
      calendarId: calendarId, // Use the user's primary calendar
      resource: event
    });

    await request.execute((event) => {

      console.log(`Event created with Google Calendar ID: ${event.id}`);
    });
  } catch (error) {
    console.error("Error sending todo to Google Calendar:", error);
  }
}

export default async function scheduleTodos(unscheduledTodos, accessToken) {
  if (unscheduledTodos.length === 0) {
    return;
  }

  try {
    const events = await getGoogleCalendarEvents(accessToken);
    console.log("", events);
    console.log(`in schedule todos, unscheduledTodos ${unscheduledTodos}`);
    let todos = [];

    const fetchTodosPromises = unscheduledTodos.map(async (id) => {
      const path = `users/${auth.currentUser.uid}/tasks`;
      const docRef = doc(db, path, id);
      const result = await getDoc(docRef);
      todos.push({...result.data(), id: id});
    });

    await Promise.all(fetchTodosPromises);
    console.log(todos);

    const sortedTodos = sortByDeadlineAndDuration(todos);
    console.log("sorted todos:", sortedTodos);

    const weekDates = generateWeekDates();
    const slottedTodos = [];
    let unslottedTodos = [...sortedTodos];

    let calendarId = "primary"; // Default to primary if not found
    let bufferTime = 5; // Default to 5 if not found
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.calendarId) {
          calendarId = userData.calendarId;
        }
        if (userData.bufferTime) {
          bufferTime = userData.bufferTime;
        }
      }
    } catch (error) {
      console.error("Error getting calendarId from Firestore:", error);
    }

    for (const date of weekDates) {
      const occupiedMinutes = new Array(1440).fill(false);
      const eventsForDay = filterEventsByDate(events, date);
      console.log("events for day: ", eventsForDay);
      await markOccupiedTimeSlots(occupiedMinutes, eventsForDay, date, bufferTime);

      const availableSlots = createAvailableTimeSlots(occupiedMinutes);
      const { slotted, unslotted } = scheduleForDay(unslottedTodos, availableSlots, date, bufferTime);

      slottedTodos.push(...slotted);
      unslottedTodos = unslotted;
    }

    console.log("sloted", slottedTodos);
    console.log("unslkdjsiojdo", unslottedTodos);
    // Send slotted todos to Google Calendar after generating time slots
    if (slottedTodos.length > 0) {
      const sendToCalendarPromises = slottedTodos.map(async (todo) => {
        await sendToGoogleCalendar(calendarId, todo);
        const path = `users/${auth.currentUser.uid}/tasks`;
        const docRef = doc(db, path, todo.id);
        await updateDoc(docRef, {isScheduled: true});
      });

      const setAsScheduled = slottedTodos.map(async (todo) => {

        console.log("set as scheduled");
      })


      await Promise.all(sendToCalendarPromises);
    }

    await Promise.all(sendToCalendarPromises);
    return {slottedTodos, unslottedTodos};

  } catch (error) {
    console.error("Error in scheduling todos:", error);
  }
}

// Fit Todo in earliest timeslot possible, push to slotted if it can, unslotted if not
function scheduleForDay(todos, availableSlots, date, bufferTime) {
  const slotted = [];
  const unslotted = [];

  for (const todo of todos) {
    let isSlotted = false;
    for (const slot of availableSlots) {
      if (canFitTodo(todo, slot, bufferTime)) {
        slotted.push(createScheduledTodo(todo, slot, date));
        updateAvailableSlot(availableSlots, slot, todo.duration + bufferTime);
        isSlotted = true;
        break;
      }
    }
    if (!isSlotted) {
      unslotted.push(todo);
    }
  }

  return { slotted, unslotted };
}

// Get today's date and the next six days
function generateWeekDates() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
}

// separates all the GC events into their respective date
function filterEventsByDate(events, date) {
  return events.filter((event) => {
    const eventDate = event.start;
    return eventDate.toDateString() === date.toDateString();
  });
}

// Sort by deadline first, then longest duration
function sortByDeadlineAndDuration(todos) {
  return todos.sort((a, b) => {
    if (a.dueDate !== b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return b.duration - a.duration;
  });
}

// Mark array indices as occupied by existing events
async function markOccupiedTimeSlots(occupiedMinutes, googleCalendarEvents, date, bufferTime) {
  const currentDate = new Date();
  if (date.getDay() === currentDate.getDay()) {
    const currentTime = getMinuteOfDay(currentDate);
    for (let i = 0; i < currentTime; i++) {
      occupiedMinutes[i] = true;
    }
  }

  googleCalendarEvents.forEach((event) => {
    const startMinute = getMinuteOfDay(event.start);
    const endMinute = getMinuteOfDay(event.end);
    console.log("Block out interval from: ", startMinute, " to ", endMinute);
    for (let i = startMinute; i < endMinute + bufferTime; i++) {
      occupiedMinutes[i] = true;
    }
  });

  let dataStartTime;
  let dataEndTime;
  const docRef = doc(db, "users", auth.currentUser.uid);

  try {
    const docSnapshot = await getDoc(docRef);
    const data = docSnapshot.data();
    dataStartTime = data.startTime.toDate();
    dataEndTime = data.endTime.toDate();

    for (let i = 0; i < dataStartTime.getHours() * 60 + dataStartTime.getMinutes(); i++) {
      occupiedMinutes[i] = true;
    }
    console.log("Block out interval from: ", 0, " to ", dataStartTime.getHours() * 60 + dataStartTime.getMinutes());

    for (let i = dataEndTime.getHours() * 60 + dataEndTime.getMinutes(); i < 1440; i++) {
      occupiedMinutes[i] = true;
    }
    console.log("Block out interval from: ", dataEndTime.getHours() * 60 + dataEndTime.getMinutes(), " to ", 1440);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Mark slots outside working hours (e.g., before 9:00 and after 20:00)
}

// goes along the minutes array and outputs each timeslot that are not yet occupied by existing events
function createAvailableTimeSlots(occupiedMinutes) {
  const availableSlots = [];
  let startTime = null;

  for (let i = 0; i < occupiedMinutes.length; i++) {
    if (!occupiedMinutes[i] && startTime === null) {
      startTime = i;
    } else if (occupiedMinutes[i] && startTime !== null) {
      availableSlots.push({ startTime, endTime: i });
      startTime = null;
    }
  }

  if (startTime !== null) {
    availableSlots.push({ startTime, endTime: occupiedMinutes.length });
  }
  console.log("Available Timeslots: ", availableSlots);
  return availableSlots;
}

function canFitTodo(todo, slot, bufferTime) {
  return slot.endTime - slot.startTime >= todo.duration + bufferTime;
}

function createScheduledTodo(todo, slot, date) {
  const startTime = new Date(date);
  startTime.setHours(0, 0, 0, 0);
  console.log("guys is this already at +6: ", startTime);
  startTime.setHours(0, slot.startTime, 0, 0);
  console.log("Set hours of ", slot.startTime, " / 60 = ", startTime);
  const endTime = new Date(startTime.getTime() + todo.duration * 60000);
  console.log(
    "Setting Todo ",
    todo.title,
    " of timeslot [",
    slot.startTime,
    ", ",
    slot.endTime,
    "] to ",
    startTime,
    " -> ",
    endTime
  );
  return {
    ...todo,
    startTime,
    endTime,
    status: "SCHEDULED",
  };
}

function updateAvailableSlot(availableSlots, slot, duration) {
  slot.startTime += duration;
  if (slot.startTime >= slot.endTime) {
    const index = availableSlots.indexOf(slot);
    if (index > -1) {
      availableSlots.splice(index, 1);
    }
  }
}

function getMinuteOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

// const result = scheduleTodos(unscheduledTodos, googleCalendarEvents);
// console.log(result);
