import React from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OtherViewProfileSecondary from "./OtherViewProfileSecondary";

const OtherSidePanel = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    const path = "/logout";
    const apiUrl = apiBaseUrl + path;

    axios.post(apiUrl, {}, { withCredentials: true });
    navigate("/login");
  };

  return (
    <div className=" lex-1 bg-neutral-950 fixed h-screen sm:w-96  lg:w-98 xl:w-98 2xl:w-auto outline outline-1 outline-white/10 overflow-y-auto overflow-x-hidden">
      <div className="  mt-32">
        <div className="md:px-12 lg:px-14 ">
          <OtherViewProfileSecondary />
        </div>

        <hr className="mt-5 opacity-10" />
        <Link to="/home" className="block">
          <div className="p-3 transition duration-300 hover:scale-105 rounded-t-xl">
            <div className="bg-neutral-950 text-white p-4 rounded-xl">Home</div>
          </div>
        </Link>
        <hr className=" opacity-10" />
        <Link to="/home/userId" className="block">
          <div className="p-3 transition duration-300 hover:scale-105">
            <div className="bg-neutral-950 text-white p-4 rounded-xl">
              MyBlog
            </div>
          </div>
        </Link>
        <hr className=" opacity-10" />
        <div
          className="p-3 transition duration-300 hover:scale-105 cursor-pointer rounded-b-xl"
          onClick={handleLogout}
        >
          <div className="bg-neutral-950 0 p-4 text-white  rounded-xl">
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherSidePanel;
