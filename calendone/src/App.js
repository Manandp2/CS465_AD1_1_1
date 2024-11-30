import './App.css';
import { 
  BrowserRouter as Router, 
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Home from './pages/home/Home';
import Completed from './pages/completed/Completed';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/completed" element={<Completed />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;