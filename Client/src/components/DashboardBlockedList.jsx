import React from "react";
import DashboardSideBar from "./DashboardSideBar";
import DashboardBListMain from "./DashboardBListMain";

const DashboardBlockedList = () => {
  return (
    <div>
      {" "}
      <div className="flex min-h-screen bg-gray-100">
        <DashboardSideBar />
        <DashboardBListMain />
      </div>
    </div>
  );
};

export default DashboardBlockedList;
