import React from "react";
import Navbar from "../Navbar";
import ViewProfileLogic from "./ViewProfileLogic";
import BottomNavBar from "../BottomNavBar";

const ViewProfile = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <ViewProfileLogic />
      <span className="md:hidden  ">
        <BottomNavBar />
      </span>
    </>
  );
};

export default ViewProfile;
