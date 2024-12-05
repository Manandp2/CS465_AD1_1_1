import { useState, useEffect } from "react";
import Home from "./pages/Home";
import React from "react";
import RecapModal from "./components/RecapModal";
// import Settings from './pages/settings/Settings';
import { auth } from "./utils/firebase";
import SignIn from "./pages/SignIn";
import { onAuthStateChanged } from "firebase/auth";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Completed from "./pages/Completed";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [curPage, setCurPage] = useState("Home");
  const [showRecapModal, setShowRecapModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (curPage === "Home" && currentUser) {
      setShowRecapModal(true); // Open RecapModal when Home page is loaded
    }
  }, [curPage, currentUser]);

  const closeRecapModal = () => {
    setShowRecapModal(false);
  };

  if (curPage === "Home" && currentUser !== null) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <>
          <RecapModal open={showRecapModal} onClose={closeRecapModal} />
          <Home setUser={setCurrentUser} setPage={setCurPage} />
        </>
      </LocalizationProvider>
    );
  } else if (curPage === "Completed" && currentUser !== null) {
    console.log(currentUser);
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Completed setUser={setCurrentUser} setPage={setCurPage} />
      </LocalizationProvider>
    );
  } else {
    return <SignIn setUser={setCurrentUser} />;
  }
}

export default App;
