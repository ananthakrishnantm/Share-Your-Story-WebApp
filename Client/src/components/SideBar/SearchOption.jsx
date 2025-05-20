import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Buffer } from "buffer";

const SearchOption = ({ searchQuery, setSearchQuery }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  // Debounced function for making the API call
  const debouncedSearch = debounce(async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const path = `/profile/data/search?username=${query}`;
    const apiUrl = apiBaseUrl + path;

    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      setSearchResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching for users:", error);
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, 300);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/searchresults/${searchQuery}`);
    }
  };

  useEffect(() => {
    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, apiBaseUrl]);

  const handleResultClick = (userId) => {
    setSearchResults([]);
    setSearchQuery("");
    setShowDropdown(false);

    navigate(`/home/data/profile/${userId}`);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative z-50 hidden sm-tab:hidden sm:hidden md:block"
      ref={dropdownRef}
    >
      <label className="input input-bordered bg-neutral-800 text-white flex items-center rounded-3xl gap-2">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="grow"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {showDropdown && searchResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full border overflow-hidden text-black border-gray-300 bg-gray-100 rounded-2xl mt-2 z-50">
          {searchResults.map((user, index) => (
            <li
              key={index}
              className="px-3 py-2 flex items-center cursor-pointer hover:bg-gray-200"
              onClick={() => handleResultClick(user._id)}
            >
              <img
                src={`data:${
                  user.profilePicture.contentType
                };base64,${Buffer.from(user.profilePicture.data.data).toString(
                  "base64"
                )}`}
                alt={user.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchOption;
