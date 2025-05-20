import React from "react";
import SidePanel from "../../components/UserComponents/SidePanel";
import RightSidePanel from "../../components/UserComponents/RightSidePanel";
import Navbar from "../../components/Navbar";
import UserBlogEdit from "../../components/UserBlogOpearations/UserBlogEdit";

const EditingUserBlogPage = () => {
  return (
    <div>
      {/*this is the side panel which takes Userid from server*/}
      <SidePanel />
      {/*this is the side panel which shows followers*/}
      <RightSidePanel />
      <Navbar />
      <div className=" flex justify-center mt-15 ">
        <div>{/* <ViewProfileSecondary /> */}</div>
        <div className="flex-1" style={{ marginTop: "7%" }}>
          <UserBlogEdit />
        </div>
        <div className="flex flex-col ">
          <div className="mt-10" style={{ marginTop: "20%" }}>
            {/* <FollowingList /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditingUserBlogPage;
