import React, { useState, useEffect } from "react";

import SidePanel from "../../../components/UserComponents/SidePanel";
import RightSidePanel from "../../../components/UserComponents/RightSidePanel";
import Navbar from "../../../components/Navbar";
import FollowingUserBlogList from "../../../components/UserComponents/FollowingUserBlogList";
import BottomNavBar from "../../../components/BottomNavBar";

const FollowingUsersBlog = () => {
  // console.log(profile.following);

  return (
    <div>
      {/*this is shows the user following blogs*/}
      {/* This is the side panel which takes Userid from server */}
      <div className="flex justify-center">
        <div className="hidden sm:hidden md:block">
          <SidePanel />
        </div>

        {/* This is the side panel which shows followers */}
        <div className="flex-1 ml-2 mr-2  mt-28 sm:mt-46 md:mt-28  lg:mt-24 sm:ml-5  sm:mr-5 md:ml-64 lg:mr-64">
          <FollowingUserBlogList />
        </div>
        <div className="hidden md:hidden lg:block">
          <RightSidePanel />
        </div>
        <div className="flex flex-col">
          <div className="mt-10" style={{ marginTop: "20%" }}>
            {/* <FollowingList /> */}
          </div>
        </div>
      </div>
      <Navbar />
      <span className="md:hidden  ">
        <BottomNavBar />
      </span>
    </div>
  );
};

export default FollowingUsersBlog;
