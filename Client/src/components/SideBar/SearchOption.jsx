import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link component
import { Buffer } from "buffer";

const SearchOption = ({
  searchQuery,
  handleSearchInputChange,
  handleSearchIconClick,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchResults([]); // Reset search results on each search query change

    const handleSearchCall = async () => {
      if (!searchQuery) {
        setShowDropdown(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/profile/data/search?username=${searchQuery}`,
          { withCredentials: true }
        );
        setSearchResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching for users:", error);
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    handleSearchCall();
  }, [searchQuery]);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Add event listener when the dropdown is shown
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Remove event listener when the dropdown is hidden
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleChange = (user) => {
    // Handle the selection of a user here
    console.log("Selected user:", user);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchIconClick();
          }
        }}
        className="px-3 py-2 w-full bg-white rounded text-black"
        style={{ borderBottom: "1px solid black" }}
      />
      {showDropdown && (
        <ul className="absolute top-full left-0 w-full border text-black border-gray-300 bg-white rounded-b mt-1 z-50">
          {searchResults.length > 0 ? (
            searchResults.map((user, index) => (
              <li
                key={index}
                className="px-3 py-2 flex items-center cursor-pointer hover:bg-gray-100"
              >
                <Link
                  to={`data/profile/${user._id}`} // Navigate to user profile page
                  onClick={() => handleChange(user)} // Optionally handle selection
                  className="flex items-center"
                >
                  <img
                    src={`data:${
                      user.profilePicture.contentType
                    };base64,${Buffer.from(
                      user.profilePicture.data.data
                    ).toString("base64")}`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user.username}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-3 py-2">No users found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchOption;
