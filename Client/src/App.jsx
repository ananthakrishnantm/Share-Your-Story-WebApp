import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Upload from "./components/Upload";
import UserBlogs from "./components/UserBlogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/user/:userID" element={<UserBlogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
