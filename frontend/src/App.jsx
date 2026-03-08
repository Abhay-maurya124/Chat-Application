import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; 
import Verifyemail from "./pages/Verifyemail";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verifyemail />} />
      </Routes>
    </Router>
  );
}

export default App;