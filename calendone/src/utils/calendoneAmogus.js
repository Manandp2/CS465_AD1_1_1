import {collection, doc, getDoc} from "firebase/firestore";
import {auth, db} from "./firebase";
import {gapi} from 'gapi-script';


const getGoogleCalendarEvents = (accessToken) => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
      .init({
        apiKey: "AIzaSyDZYd2i-rX4oN_7i2AeSwGeJ0Uq2jo_Rng",
        clientId: "614127097265-pdklurnj0e83fnd2m6s797gq67c1u4aq.apps.googleusercontent.com",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: "https://www.googleapis.com/auth/calendar",
      })
      .then(() => {
        gapi.auth.setToken({ access_token: accessToken });
        let eventsFromCalendar = [];
        gapi.client.calendar.calendarList
        .list()
        .then((response) => {
          const calendars = response.result.items;
          let promises = [];
          if (calendars.length > 0) {
            calendars.forEach((calendar) => {
              const calendarId = calendar.id;
              const fetchEventsPromise = gapi.client.calendar.events
              .list({
                calendarId: calendarId,
                timeMin: new Date().toISOString(),
                timeMax: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
                singleEvents: true,
                orderBy: "startTime",
              })
              .then((resp) => {
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
              })
              .catch((error) => {
                console.error(`Error fetching events from calendar ${calendar.summary}:`, error);
              });

              promises.push(fetchEventsPromise);
            });

            Promise.all(promises)
            .then(() => {
              resolve(eventsFromCalendar);
            })
            .catch(reject);
          } else {
            resolve(eventsFromCalendar); // Resolve with an empty array if no calendars
          }
        })
        .catch((error) => {
          console.error("Error fetching calendars:", error);
          reject(error);
        });
      });
    });
  });
};



export default function scheduleTodos(unscheduledTodos, accessToken) {
  // sort todos by deadline and length of duration
  if (unscheduledTodos.length === 0) {
    return;
  }
  getGoogleCalendarEvents(accessToken).then((result) => {
    let events = result;
    console.log("",events)
    console.log(`in schedule todos, unscheduledTodos ${unscheduledTodos}`)
    let todos = [];
    unscheduledTodos.forEach((id) => {
      const path = `users/${auth.currentUser.uid}/tasks`
      const docRef = doc(db, path, id);
      getDoc(docRef)
      .then((result) => {
        todos.push(result.data())
      })
    })

    console.log(todos)

    const sortedTodos = sortByDeadlineAndDuration(todos);

    //generate dates of today and next six days
    const weekDates = generateWeekDates();
    const slottedTodos = [];
    let unslottedTodos = [...sortedTodos];

    for (const date of weekDates) {
      // Initialize array for each day, with each index indicating the minute of that day in military time
      // ex. index 0 is 00:00, index 412 is 06:52, index 1440 is 24:00
      const occupiedMinutes = new Array(1440).fill(false);

      // occupy the times (array=True) for each specific day according to the preexisting GC events of that day
      const eventsForDay = filterEventsByDate(events, date);
      console.log("events for day: ", eventsForDay)
      markOccupiedTimeSlots(occupiedMinutes, eventsForDay);

      // create an array of timeslots unoccupied by events
      const availableSlots = createAvailableTimeSlots(occupiedMinutes);

      // sort the todos that can and cannot be slotted in by the greedy algo
      const {slotted, unslotted} = scheduleForDay(unslottedTodos, availableSlots, date);
      slottedTodos.push(...slotted);
      unslottedTodos = unslotted;
    }
    console.log("sloted", slottedTodos)
    console.log("unslkdjsiojdo", unslottedTodos)
    return {slottedTodos, unslottedTodos};
  });

}

// Fit Todo in earliest timeslot possible, push to slotted if it can, unslotted if not
function scheduleForDay(todos, availableSlots, date) {
  const slotted = [];
  const unslotted = [];

  for (const todo of todos) {
    let isSlotted = false;
    for (const slot of availableSlots) {
      if (canFitTodo(todo, slot)) {
        slotted.push(createScheduledTodo(todo, slot, date));
        updateAvailableSlot(availableSlots, slot, todo.duration);
        isSlotted = true;
        break;
      }
    }
    if (!isSlotted) {
      unslotted.push(todo);
    }
  }

  return {slotted, unslotted};
}

// Get today's date and the next six days
function generateWeekDates() {
  const today = new Date();
  return Array.from({length: 7}, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });
}

// separates all the GC events into their respective date
function filterEventsByDate(events, date) {
  return events.filter(event => {
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
async function markOccupiedTimeSlots(occupiedMinutes, googleCalendarEvents) {
  googleCalendarEvents.forEach(event => {
    const startMinute = getMinuteOfDay(event.start);
    const endMinute = getMinuteOfDay(event.end);
    console.log("Block out interval from: ", startMinute, " to ", endMinute);
    for (let i = startMinute; i < endMinute; i++) {
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
      availableSlots.push({startTime, endTime: i});
      startTime = null;
    }
  }

  if (startTime !== null) {
    availableSlots.push({startTime, endTime: occupiedMinutes.length});
  }
  console.log("Available Timeslots: ", availableSlots);
  return availableSlots;
}

function canFitTodo(todo, slot) {
  return slot.endTime - slot.startTime >= todo.duration;
}

function createScheduledTodo(todo, slot, date) {
  const startTime = new Date(date);
  startTime.setHours(0, 0, 0, 0);
  console.log("guys is this already at +6: ", startTime);
  startTime.setHours(0, slot.startTime, 0, 0);
  console.log("Set hours of ", slot.startTime, " / 60 = ", startTime);
  const endTime = new Date(startTime.getTime() + todo.duration * 60000);
  console.log("Setting Todo ", todo.title, " of timeslot [", slot.startTime, ", ", slot.endTime, "] to ", startTime, " -> ", endTime)
  return {
    ...todo,
    startTime,
    endTime,
    status: 'SCHEDULED'
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