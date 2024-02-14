import "./App.css";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Upload from "./components/Upload";
import UserBlogs from "./components/UserBlogs";
import UserBlogView from "./components/UserBlogOpearations/UserBlogView";
import Home from "./components/Home";
import UseAuth, {
  UseAuthProvider,
} from "./components/GlobalStateMangement/UseAuthProvider";
import UserBlogEdit from "./components/UserBlogOpearations/UserBlogEdit";

function App() {
  return (
    <BrowserRouter>
      <UseAuthProvider
        protectedPaths={[
          "/home",
          "/upload",
          "/home/userId",
          "/home/userId/View/:blogId",
          "/home/userId/Edit/:blogId",
        ]}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/home/userId" element={<UserBlogs />} />
          <Route path="/home/userId/View/:blogId" element={<UserBlogView />} />
          <Route path="/home/userId/Edit/:blogId" element={<UserBlogEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </UseAuthProvider>
    </BrowserRouter>
  );
}

export default App;
