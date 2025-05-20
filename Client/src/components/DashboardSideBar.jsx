import React from "react";
import { Link } from "react-router-dom";

const DashboardSideBar = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <nav className="mt-8">
            <ul>
              <li className="mb-4">
                <Link
                  to={"/home"}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <span className="inline-block w-4 h-4 mr-2 bg-indigo-500 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li className="mb-4">
                <Link to={"/dashboard"}>
                  <a href="#" className="text-gray-700 hover:text-gray-900">
                    <span className="inline-block w-4 h-4 mr-2 bg-indigo-500 rounded-full"></span>
                    Reports
                  </a>
                </Link>
              </li>
              <li className="mb-4">
                <Link to={"/dashboard/blockedList"}>
                  <a href="#" className="text-gray-700 hover:text-gray-900">
                    <span className="inline-block w-4 h-4 mr-2 bg-indigo-500 rounded-full"></span>
                    BlockedList
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default DashboardSideBar;
