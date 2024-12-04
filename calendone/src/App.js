// import "./App.css";
import { useState } from "react";
import Home from "./pages/Home";
// import Settings from './pages/settings/Settings';
import { auth } from "./utils/firebase";
import SignIn from "./pages/SignIn";
import Completed from "./pages/Completed";

function App() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [curPage, setCurPage] = useState("Home");
  if (curPage === "Home" && currentUser !== null) {
    console.log(currentUser);
    return <Home setUser={setCurrentUser} />;
  } if (curPage === "Completed") {
    return <Completed />
  } else {
    console.log(currentUser);
    return <SignIn setUser={setCurrentUser} />;
  }
}

export default App;
