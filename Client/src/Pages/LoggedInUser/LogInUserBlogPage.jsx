import React, { useState } from "react";

import SidePanel from "../../components/UserComponents/SidePanel";

import Navbar from "../../components/Navbar";
import UserBlogView from "../../components/UserBlogOpearations/UserBlogView";
import BottomNavBar from "../../components/BottomNavBar";

const LogInUserBlogPage = () => {
  const [triggerFetch, setTriggerFetch] = useState(false);

  return (
    <div>
      <div className="flex justify-center">
        <div className="hidden sm:hidden md:block">
          <SidePanel />
        </div>
        <div className="flex-1 ml-2 mr-2  mt-28 sm:mt-46 md:mt-28  lg:mt-24 sm:ml-5 sm:mr-5 md:ml-64 ">
          {<UserBlogView />}
        </div>
      </div>
      <Navbar />
      <span className="md:hidden  ">
        <BottomNavBar />
      </span>
    </div>
  );
};

export default LogInUserBlogPage;
