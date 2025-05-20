import React, { useState, useEffect } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";
import SidePanel from "./UserComponents/SidePanel";
import RightSidePanel from "./UserComponents/RightSidePanel";
import BottomNavBar from "./BottomNavBar";
import FollowingList from "./SideBar/FollowingList";

const getScrollbarWidth = () => {
  // Create a temporary element to calculate scrollbar width
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll"; // Firefox and others
  outer.style.msOverflowStyle = "scrollbar"; // IE and Edge
  document.body.appendChild(outer);

  const inner = document.createElement("div");
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  document.body.removeChild(outer);

  return scrollbarWidth;
};

function HomeFollowingList() {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Assuming this is used for menu visibility

  const updateBlogList = () => {
    setTriggerFetch(!triggerFetch);
  };

  useEffect(() => {
    const scrollbarWidth = getScrollbarWidth();

    if (showMenu) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Adjust padding to maintain layout
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px"; // Reset padding
    }

    // Cleanup on component unmount or when menu is closed
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showMenu]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="hidden sm:hidden md:block">
          <SidePanel />
        </div>
        <div className="flex-1 ml-2 mr-2  mt-28 sm:mt-46 md:mt-28  lg:mt-24 sm:ml-5  sm:mr-5 md:ml-64 lg:mr-64">
          <FollowingList />
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

export default HomeFollowingList;
