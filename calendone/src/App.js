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
  const [curPage, setCurPage] = useState("Loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setCurPage("Home");
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  if (curPage === "Loading") {
    return <Laodi />;
  }
  if (currentUser !== null) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {curPage === "Home" && <Home setUser={setCurrentUser} setPage={setCurPage} />}
        {curPage === "Completed" && <Completed setUser={setCurrentUser} setPage={setCurPage} />}
        {curPage === "Settings" && <Settings setUser={setCurrentUser} setPage={setCurPage} />}
      </LocalizationProvider>
    );
  }

  return <SignIn setUser={setCurrentUser} />;
}

export default App;
