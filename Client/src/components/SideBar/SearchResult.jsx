import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import Navbar from "../Navbar";
import "../userBlogs.css";

const SearchResult = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { query } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchSearchResult = () => {
    const path = `/profile/data/search?username=${query}`;
    const apiUrl = apiBaseUrl + path;

    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSearchResult();
  }, [query]);

  const handleViewProfile = (userId) => {
    navigate(`/home/data/profile/${userId}`);
  };

  return (
    <div className="flex-1  px-5 ml-auto md:mr-auto  lg:mt-5 md:ml-36 lg:ml-48 xl:ml-48">
      <div>
        {searchResults.map((user, index) => (
          <div key={index}>
            <div className="  p-4 rounded-lg shadow-md mb-4">
              <div className="flex-1 flex-wrap items-center justify-between mb-4">
                <div className="flex items-center  sm:text-sm p-4  sm:mr-4">
                  <div className="flex-shrink-0">
                    <img
                      src={`data:${
                        user.profilePicture.contentType
                      };base64,${Buffer.from(
                        user.profilePicture.data.data
                      ).toString("base64")}`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  </div>
                  <div className="flex-grow  max-w-xs">
                    <h1 className="text-lg text-white ">{user.username}</h1>
                  </div>
                </div>
                <div className=" p-4 w-full border-t-2 border-white/10 sm:w-auto">
                  <button
                    onClick={() => handleViewProfile(user._id)}
                    style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
                    className=" w-full sm:w-auto  text-white py-4 px-6 sm:px-4 rounded-xl text-lg sm:text-sm  transition duration-300 hover:scale-105 "
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
