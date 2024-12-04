import { useState, useEffect } from "react";
import Home from "./pages/Home";
// import Settings from './pages/settings/Settings';
import { auth } from "./utils/firebase";
import SignIn from "./pages/SignIn";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [curPage, setCurPage] = useState("Home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (curPage === "Home" && currentUser !== null) {
    return <Home setUser={setCurrentUser} />;
  } else {
    return <SignIn setUser={setCurrentUser} />;
  }
}

export default App;