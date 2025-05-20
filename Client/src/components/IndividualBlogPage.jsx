import React, { useState } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";
import SidePanel from "./UserComponents/SidePanel";
import RightSidePanel from "./UserComponents/RightSidePanel";
import UserBlogs from "./UserBlogs";
import OtherSidePanel from "./OtherUserComponents/OtherSidePanel";
import OtherIndividualBlog from "./OtherUserComponents/OtherIndividualBlog";
import BottomNavBar from "./BottomNavBar";

const IndividualBlogPage = () => {
  const [triggerFetch, setTriggerFetch] = useState(false);

  const updateBlogList = () => {
    setTriggerFetch(!triggerFetch);
  };

  //this is the page for individual blog

  return (
    <div>
      <div className="flex justify-center">
        <div className="hidden sm:hidden md:block">
          <OtherSidePanel />
        </div>
        <div className="flex-1 ml-2 mr-2  mt-28 sm:mt-46 md:mt-28  lg:mt-24 sm:ml-5 sm:mr-5 md:ml-64 ">
          {<OtherIndividualBlog />}
        </div>
      </div>

      <Navbar />
      <span className="md:hidden  ">
        <BottomNavBar />
      </span>
    </div>
  );
};

export default IndividualBlogPage;
