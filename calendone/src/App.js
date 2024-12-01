import './App.css';
import { 
  BrowserRouter as Router, 
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/home/Home';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <div>
      {/* Material Design Icons import */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;