import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SideBar = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    const path = "/logout";
    const apiUrl = apiBaseUrl + path;

    axios.post(apiUrl, {}, { withCredentials: true });
    navigate("/login");
  };
  return (
    <div className="bg-white max-h-screen w-80 text-black rounded-xl overflow-hidden">
      <Link to={`/profile/:userId`} className="block">
        <div className="p-5 transition duration-300 hover:scale-105 rounded-t-xl">
          <div className="bg-gray-200 p-4 rounded-xl">Profile</div>
        </div>
      </Link>
      <Link to="/home/userId" className="block">
        <div className="p-5 transition duration-300 hover:scale-105">
          <div className="bg-gray-200 p-4 rounded-xl">MyBlog</div>
        </div>
      </Link>
      <div
        className="p-5 transition duration-300 hover:scale-105 cursor-pointer rounded-b-xl"
        onClick={handleLogout}
      >
        <div className="bg-gray-200 p-4 rounded-xl">Logout</div>
      </div>
    </div>
  );
};

export default SideBar;
