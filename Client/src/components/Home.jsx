import React, { useState } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";
import SideBar from "./SideBar/SideBar";
import FollowBar from "./SideBar/FollowBar";
import RightSideBar from "./SideBar/RightSideBar";
import ViewProfileLogic from "./UserComponents/ViewProfileLogic";
import ViewProfileSecondary from "./UserComponents/ViewProfileSecondary";
import FollowingList from "./SideBar/FollowingList";

function Home() {
  const [triggerFetch, setTriggerFetch] = useState(false);

  const updateBlogList = () => {
    setTriggerFetch(!triggerFetch);
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-10 m-20">
        <div>
          <ViewProfileSecondary />
          <div className="mt-5  ">
            <FollowBar />
          </div>
        </div>
        <div className="flex-1">
          <Upload updateBlogList={updateBlogList} />
          <AllUserBlogs triggerFetch={triggerFetch} />
        </div>
        <div className="flex flex-col ">
          <div>
            <SideBar />
          </div>
          <div className="mt-5">
            <FollowingList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
