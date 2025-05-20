import React from "react";
import FollowBar from "../SideBar/FollowBar";

const RightSidePanel = () => {
  return (
    <>
      <div
        className="fixed h-screen w-sm"
        style={{
          outline: "1px solid rgba(255, 255, 255, 0.1)",
          right: "0%",
        }}
      >
        <div className="  mt-24">
          <FollowBar />
        </div>
      </div>
    </>
  );
};

export default RightSidePanel;
