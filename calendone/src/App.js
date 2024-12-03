import "./App.css";
import { useState } from "react";
import Home from "./pages/home/Home";
// import Settings from './pages/settings/Settings';
import {auth} from "./utils/firebase";
import SignIn from "./pages/SignIn";



function App() {

  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [curPage, setCurPage] = useState("Home");
  if (curPage === "Home" &&  currentUser !== null) {
    console.log(currentUser);
    return <Home setUser={setCurrentUser}/>;
  } else {
    console.log(currentUser);
    return (
      <SignIn setUser={setCurrentUser}/>
    );
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
