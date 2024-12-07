import { useState, useEffect } from "react";
import Home from "./pages/Home";
import React from "react";
import Settings from "./pages/Settings";
import { auth } from "./utils/firebase";
import SignIn from "./pages/SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Completed from "./pages/Completed";
import Laodi from "./pages/Laodi";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [curPage, setCurPage] = useState("SignIn");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  if (curPage === "Loading") {
    return <Laodi />;
  }
  if (currentUser !== null && hasSignedIn === true) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {curPage === "Home" && <Home setUser={setCurrentUser} setPage={setCurPage} />}
        {curPage === "Completed" && <Completed setUser={setCurrentUser} setPage={setCurPage} />}
        {curPage === "Settings" && <Settings setUser={setCurrentUser} setPage={setCurPage} />}
      </LocalizationProvider>
    );
  }

  return <SignIn setHasSignedIn={setHasSignedIn} setPage={setCurPage} />;
}

export default App;
