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
import ViewProfile from "./components/UserComponents/ViewProfile";
import OtherUserBlogs from "./components/OtherUserBlogs";
import { LikeUnlikeComponent } from "./components/UserComponents/LikeUnlikeComponent";

function App() {
  const user = {
    name: "john sup",
  };
  return (
    <BrowserRouter>
      <UseAuthProvider
        protectedPaths={[
          "/home",
          "/Navbar",
          "/home/:userId/blogs",
          "/upload",
          "/home/userId",
          "/profile/:Id",
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
          <Route path="/home/:userId/blogs" element={<OtherUserBlogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:Id" element={<ViewProfile />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/home/userId/Edit/:blogId/like"
            element={<LikeUnlikeComponent />}
          />
        </Routes>
      </UseAuthProvider>
    </BrowserRouter>
  );
}

export default App;
