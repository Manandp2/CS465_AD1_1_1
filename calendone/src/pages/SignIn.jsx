import { useState } from "react";
// import Settings from './pages/settings/Settings';
import { auth, db } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { gapi } from "gapi-script";

function SignIn(props) {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");
    signInWithPopup(auth, provider)
      .then((result) => {
        const cred = GoogleAuthProvider.credentialFromResult(result);
        props.setUser(result.user);
        setDoc(
          doc(db, "users", result.user.uid),
          {
            accessToken: cred.accessToken,
          },
          { merge: true }
        ).then(() => {
          console.log("yay");
          sendEventToGoogleCalendar(cred.accessToken);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const sendEventToGoogleCalendar = (accessToken) => {
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
          const event = {
            summary: "Google I/O 2023",
            location: "800 Howard St., San Francisco, CA 94103",
            description: "A chance to hear more about Google's developer products.",
            start: {
              dateTime: "2024-12-4T09:00:00-07:00",
              timeZone: "America/Los_Angeles",
            },
            end: {
              dateTime: "2024-12-5T17:00:00-07:00",
              timeZone: "America/Los_Angeles",
            },
          };

          gapi.client.calendar.events
            .insert({
              calendarId: "primary",
              resource: event,
            })
            .then((response) => {
              console.log("Event created: ", response);
            })
            .catch((error) => {
              console.error("Error creating event: ", error);
            });
        });
    });
  };
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default SignIn;
