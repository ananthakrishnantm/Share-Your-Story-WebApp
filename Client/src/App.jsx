import "./App.css";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Upload from "./components/Upload";
import UserBlogs from "./components/UserBlogs";
import UserBlogView from "./components/UserBlogView";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/home/userId" element={<UserBlogs />} />
        <Route
          path="/home/userId/UsersBlog/:blogId"
          element={<UserBlogView />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
