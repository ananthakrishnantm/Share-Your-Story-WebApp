import React from "react";
import Navbar from "../Navbar";
import ViewProfileLogic from "./ViewProfileLogic";

const ViewProfile = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <ViewProfileLogic />
    </>
  );
};

export default ViewProfile;
