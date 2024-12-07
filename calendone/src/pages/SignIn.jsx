import React from "react";
import {Box, Button, Paper, Typography} from "@mui/material";
import {auth, db} from "../utils/firebase";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {doc, runTransaction, setDoc} from "firebase/firestore";
import {gapi} from "gapi-script";

import dayjs from 'dayjs';

function generateSparkles(numSparkles) {
  const sparkles = [];
  for (let i = 0; i < numSparkles; i++) {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomSize = Math.random() * 5 + 3;
    const randomDuration = Math.random() * 3 + 2;

    sparkles.push({
      left: `${randomX}%`,
      top: `${randomY}%`,
      width: `${randomSize}px`,
      height: `${randomSize}px`,
      animationDuration: `${randomDuration}s`,
      animationDelay: `${Math.random() * 2}s`,
    });
  }
  return sparkles;
}

function SignIn(props) {
  const sparkles = generateSparkles(50);

  const updateStartTimeIfNotExists = async (userId) => {
    const userDocRef = doc(db, "users", userId);

    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);

        if (!userDoc.exists()) {
          throw "Document does not exist!";
        }

        const data = userDoc.data();
        if (!data.bufferTime) {
          transaction.update(userDocRef, {
            bufferTime: 5,
          });
        }
        if (!data.startTime) {
          transaction.update(userDocRef, {
            startTime: dayjs('2024-12-06T10:00').toDate(),
            endTime: dayjs('2024-12-06T18:00').toDate(),
          });
          console.log("watchTime saved");
          props.setPage("Home");
        } else {
          props.setPage("Home");
        }
      });
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  const getGoogleCalendars = async (accessToken) => {
    await new Promise((resolve) =>
      gapi.load("client:auth2", resolve)
    );

    await gapi.client.init({
      apiKey: "AIzaSyDZYd2i-rX4oN_7i2AeSwGeJ0Uq2jo_Rng",
      clientId: "614127097265-pdklurnj0e83fnd2m6s797gq67c1u4aq.apps.googleusercontent.com",
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      scope: "https://www.googleapis.com/auth/calendar",
    });

    gapi.auth.setToken({ access_token: accessToken });

    try {
      const response = await gapi.client.calendar.calendarList.list();
      return response.result.items;
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  };




  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar");

    try {
      const result = await signInWithPopup(auth, provider);
      const cred = GoogleAuthProvider.credentialFromResult(result);
      props.setHasSignedIn(true);
      props.setPage("Loading");

      // Initialize gapi client

      // List and check for existing calendar
      const calendars = await getGoogleCalendars(cred.accessToken);
      const calendoneCalendar = calendars.find(calendar => calendar.summary === "CalenDone");

      let calendarId;
      if (!calendoneCalendar) {
        // Create a new CalenDone calendar since it doesn't exist
        const newCalendar = await gapi.client.calendar.calendars.insert({
          resource: {
            summary: "CalenDone"
          }
        });
        calendarId = newCalendar.result.id;
      } else {
        calendarId = calendoneCalendar.id;
      }

      // Save the calendarId and accessToken to Firestore
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          accessToken: cred.accessToken,
          calendarId: calendarId,
        },
        { merge: true }
      );
      console.log("calendarId and accessToken saved");

      // Update Firestore with start time if it does not exist
      await updateStartTimeIfNotExists(result.user.uid);
    } catch (error) {
      console.error("Error during signInWithGoogle", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6d3b79, #a64ca6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {sparkles.map((style, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            ...style,
            animation: `sparkleAnimation ${style.animationDuration} linear infinite`,
          }}
        />
      ))}

      <Paper
        elevation={3}
        sx={{
          width: "60%",
          padding: "2rem",
          textAlign: "center",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.83)",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "1rem", color: "#6d3b79", fontWeight: "bold" }}>
          CalenDone
        </Typography>
        <Typography variant="body1" fontStyle="italic" sx={{ marginBottom: "1.5rem", color: "#333" }}>
          Connect with your Google account to start!
        </Typography>
        <Button
          variant="contained"
          onClick={signInWithGoogle}
          sx={{
            backgroundColor: "#6d3b79",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            "&:hover": {
              backgroundColor: "#a64ca6",
            },
          }}
        >
          Sign in with Google
        </Button>
      </Paper>

      <style>
        {`
          @keyframes sparkleAnimation {
            0% {
              transform: translate(0, 0);
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: translate(-50px, -50px);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
}

export default SignIn;
