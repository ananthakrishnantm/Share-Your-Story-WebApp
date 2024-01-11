import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
