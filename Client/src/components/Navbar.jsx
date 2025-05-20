import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchOption from "./SideBar/SearchOption";

const Navbar = () => {
  const [profile, setProfile] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const path = "/profile/:userid";
      const apiUrl = apiBaseUrl + path;

      try {
        const response = await axios.get(apiUrl, { withCredentials: true });
        setProfile(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className="text-gray-600 body-font bg-neutral-950 fixed w-full top-0"
      style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          to="/home"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl text-zinc-50">Tailblocks</span>
        </Link>
        <nav
          className=" hidden sm-tab:hidden  sm:hidden md:flex md:ml-auto md:mr-auto  flex-wrap items-center text-base justify-center bg-neutral-900 px-2 py-1 rounded-xl"
          style={{ outline: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <div
            className={`px-4 py-2 rounded-xl text-center transition duration-300 ease-in-out ${
              location.pathname.startsWith("/home") &&
              !location.pathname.startsWith("/home/following")
                ? "bg-neutral-500"
                : ""
            }`}
          >
            <button
              className="text-zinc-50 hover:text-gray-400"
              onClick={() => handleNavigation("/home")}
            >
              All
            </button>
          </div>
          <div
            className={`px-4 py-2 rounded-xl text-center transition duration-300 ease-in-out ${
              location.pathname.startsWith("/home/following")
                ? "bg-neutral-500"
                : ""
            }`}
          >
            <button
              className="text-zinc-50 hover:text-gray-400"
              onClick={() => handleNavigation("/home/following")}
            >
              Following
            </button>
          </div>
        </nav>
        <SearchOption
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </div>
  );
};

export default Navbar;
