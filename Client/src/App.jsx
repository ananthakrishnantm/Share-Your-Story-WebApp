import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
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
import SearchOption from "./components/SideBar/SearchOption";
import SearchResult from "./components/SideBar/SearchResult"; // Import the SearchResult component
import SearchProfile from "./components/UserComponents/SearchProfile";

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
          "/Search",
          "/upload",
          "/searchresults/:query",
          "/home/userId",
          "/profile/:Id",
          "/home/:userId/blogs",
          "/home/userId/View/:blogId",
          "/home/userId/Edit/:blogId",
          "home/data/profile/:username",
        ]}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/Search" element={<SearchOption />} />
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
          <Route path="/searchresults/:query" element={<SearchResult />} />
          <Route path="home/data/profile/:userId" element={<SearchProfile />} />
          {/* Define the route for search results */}
        </Routes>
      </UseAuthProvider>
    </BrowserRouter>
  );
}

export default App;
