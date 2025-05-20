import React, { useState, useEffect } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";
import SidePanel from "./UserComponents/SidePanel";
import RightSidePanel from "./UserComponents/RightSidePanel";
import BottomNavBar from "./BottomNavBar";
import FollowingList from "./SideBar/FollowingList";
import DashboardReport from "./DashboardReport";
import DashboardSideBar from "./DashboardSideBar";

function Dashboard() {
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Assuming this is used for menu visibility

  return (
    <div>
      <div className="flex min-h-screen bg-gray-100">
        <DashboardSideBar />
        <DashboardReport />
      </div>
    </div>
  );
}

export default Dashboard;
