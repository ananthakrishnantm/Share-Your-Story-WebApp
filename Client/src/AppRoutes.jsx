import React from "react";
import FollowingUsersBlog from "./Pages/HomePage/UsersFollowing/FollowingUsersBlog";
import Dashboard from "./components/Dashboard";
import HomeSearch from "./components/HomeSearch";
import HomeFollowerList from "./components/HomeFollowerList";
import HomeFollowingList from "./components/HomeFollowingList";
import HomeSearchResult from "./components/HomeSearchResult";
import { LikeUnlikeComponent } from "./components/UserComponents/LikeUnlikeComponent";
import IndividualBlogPage from "./components/IndividualBlogPage";
import ViewProfile from "./components/UserComponents/ViewProfile";
import OtherHomeThree from "./components/OtherHomeThree";
import EditingUserBlogPage from "./Pages/UserFunctionPages/EditingUserBlogPage";
import LogInUserBlogPage from "./Pages/LoggedInUser/LogInUserBlogPage";
import HomeTwo from "./components/HomeTwo";
import SearchOption from "./components/SideBar/SearchOption";
import Upload from "./components/Upload";
import Home from "./components/Home";
import EmailTokenVerification from "./components/EmailTokenVerification";
import EmailVerificationSent from "./components/EmailVerificationSent";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { UseAuth } from "./components/GlobalStateMangement/UseAuthProvider";
import ProtectedRoute from "./components/GlobalStateMangement/ProtectedRoute";
import DashboardBlockedList from "./components/DashboardBlockedList";

const AppRoutes = () => {
  const { role } = UseAuth();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/EmailVerification-Sent"
          element={<EmailVerificationSent />}
        />
        <Route
          path="/EmailTokenVerification/*"
          element={<EmailTokenVerification />}
        />
        <Route
          element={<ProtectedRoute redirectTo="/login" requiredRole={"user"} />}
        >
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/Search" element={<SearchOption />} />
          <Route path="/home/userId" element={<HomeTwo />} />
          <Route
            path="/home/userId/View/:blogId"
            element={<LogInUserBlogPage />}
          />

          <Route
            path="/home/userId/Edit/:blogId"
            element={<EditingUserBlogPage />}
          />
          <Route path="/home/:userId/blogs" element={<OtherHomeThree />} />

          <Route path="/profile/:userId" element={<ViewProfile />} />

          <Route
            path="/home/:userId/blogs/:blogId"
            element={<IndividualBlogPage />}
          />
          <Route
            path="/home/userId/Edit/:blogId/like"
            element={<LikeUnlikeComponent />}
          />
          <Route path="/searchresults/:query" element={<HomeSearchResult />} />
          <Route path="home/followinglist" element={<HomeFollowingList />} />
          <Route path="home/followerlist" element={<HomeFollowerList />} />
          <Route path="home/data/profile/:userId" element={<HomeSearch />} />

          <Route path="home/following" element={<FollowingUsersBlog />} />
        </Route>
        <Route
          element={
            <ProtectedRoute redirectTo="/login" requiredRole={"admin"} />
          }
        >
          <Route
            path="/dashboard/blockedList"
            element={<DashboardBlockedList />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
