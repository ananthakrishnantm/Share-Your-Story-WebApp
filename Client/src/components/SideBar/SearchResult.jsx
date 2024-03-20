import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import Navbar from "../Navbar";

const SearchResult = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { query } = useParams();
  const navigate = useNavigate();

  const fetchSearchResult = () => {
    const url = `http://localhost:3000/profile/data/search?username=${query}`;
    axios
      .get(url, { withCredentials: true })
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
    <div>
      <Navbar />
      <div className="my-5">
        {searchResults.map((user, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={`data:${
                    user.profilePicture.contentType
                  };base64,${Buffer.from(
                    user.profilePicture.data.data
                  ).toString("base64")}`}
                  alt={user.username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h1 className="text-lg font-bold">{user.username}</h1>
              </div>
              <button
                onClick={() => handleViewProfile(user._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
