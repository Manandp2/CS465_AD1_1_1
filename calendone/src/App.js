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
    return <Home setUser={setCurrentUser} setPage={setCurPage} />;
  } if (curPage === "Completed") {
    return <Completed setUser={setCurrentUser} setPage={setCurPage} />
  } else {
    console.log(currentUser);
    return <SignIn setUser={setCurrentUser} />;
  }
  // return (
  //   <div>
  //     {/* Material Design Icons import */}
  //     <link
  //       rel="stylesheet"
  //       href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
  //     />
  //   </div>
  // );
}

export default App;
