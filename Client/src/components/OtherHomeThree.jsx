import React, { useState } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";

import OtherUserBlogs from "./OtherUserBlogs";

import OtherSidePanel from "./OtherUserComponents/OtherSidePanel";
import BottomNavBar from "./BottomNavBar";

//page for blog of other user
function OtherHomeThree() {
  const [triggerFetch, setTriggerFetch] = useState(false);

  const updateBlogList = () => {
    setTriggerFetch(!triggerFetch);
  };

  return (
    <div>
      {/*this the page which shows the other users blog list */}
      {/*this is the side panel which takes Userid from front end to the server*/}
      <div className="flex justify-center">
        <div className="hidden sm:hidden md:block">
          <OtherSidePanel />
        </div>
        <div className="flex justify-center  flex-1 ml-2 mr-2  mt-28 sm:mt-46 md:mt-24  lg:mt-24 sm:ml-5  sm:mr-5 md:ml-64 ">
          <OtherUserBlogs />
        </div>
        <div className="flex flex-col">
          <div>{/* <SideBar /> */}</div>
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
}

export default OtherHomeThree;
