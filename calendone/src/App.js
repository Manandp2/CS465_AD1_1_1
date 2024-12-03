// import "./App.css";
import { useState } from "react";
import Home from "./pages/home/Home";
// import Settings from './pages/settings/Settings';

function App() {
  const [curPage, setCurPage] = useState("Home");
  if (curPage === "Home") {
    return <Home />;
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
