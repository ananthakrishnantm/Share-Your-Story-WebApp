import React, { useState, useEffect } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";
import SidePanel from "./UserComponents/SidePanel";
import RightSidePanel from "./UserComponents/RightSidePanel";
import BottomNavBar from "./BottomNavBar";
import FollowerList from "./SideBar/FollowerList";

function HomeFollowerList() {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Assuming this is used for menu visibility

  const updateBlogList = () => {
    setTriggerFetch(!triggerFetch);
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="hidden sm:hidden md:block">
          <SidePanel />
        </div>
        <div className="flex-1 ml-2 mr-2  mt-28 sm:mt-46 md:mt-28  lg:mt-24 sm:ml-5  sm:mr-5 md:ml-64 lg:mr-64">
          <FollowerList />
        </div>
        <div className="hidden md:hidden lg:block">
          <RightSidePanel />
        </div>
        <div className="mt-52 hidden md:hidden lg:block"></div>
        <div className="flex flex-col">
          <div className="mt-10" style={{ marginTop: "20%" }}>
            {/* <FollowingList /> */}
          </div>
        </div>
      </div>
      <Navbar />
      <span className="md:hidden">
        <BottomNavBar />
      </span>
    </div>
  );
}

export default HomeFollowerList;
