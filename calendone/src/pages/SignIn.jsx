/* import { auth, db } from "../utils/firebase";
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
          console.log("accessToken saved");
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

export default SignIn; */


/*
import React from "react";
import { Button, Paper, Typography, Box } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
          console.log("accessToken saved");
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6d3b79, #a64ca6)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          textAlign: "center",
          borderRadius: "16px",
          background: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: "1rem", color: "#6d3b79", fontWeight: "bold" }}
        >
          Welcome to CalenDone
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "1.5rem", color: "#333" }}
        >
          Connect your account to get started!
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
    </Box>
  );
}

export default SignIn; */

import React from "react";
import { Button, Paper, Typography, Box } from "@mui/material";
import { auth, db } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function generateSparkles(numSparkles) {
  const sparkles = [];
  for (let i = 0; i < numSparkles; i++) {
    const randomX = Math.random() * 100; // Random position across width
    const randomY = Math.random() * 100; // Random position across height
    const randomSize = Math.random() * 5 + 3; // Random size between 3px and 8px
    const randomDuration = Math.random() * 3 + 2; // Random duration between 2s and 5s

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
          console.log("accessToken saved");
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
      {/* Sparkles */}
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

      {/* Modal */}
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          textAlign: "center",
          borderRadius: "16px",
          background: "white",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: "1rem", color: "#6d3b79", fontWeight: "bold" }}
        >
          Welcome to CalenDone
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: "1.5rem", color: "#333" }}
        >
          Connect your account to get started!
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

      {/* Inline Keyframes */}
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


