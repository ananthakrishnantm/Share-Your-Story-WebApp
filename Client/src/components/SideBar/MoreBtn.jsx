import React, { useState, useRef, useEffect } from "react";
import BlockBtn from "../UserComponents/BlockBtn";
import { UseAuth } from "../GlobalStateMangement/UseAuthProvider";
import FollowBtn from "../UserComponents/FollowBtn";
import ReportBlogModal from "./ReportBlogModal";

const Dropdown = ({ userId, blogId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { loggedInUserId } = UseAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const isCurrentUser = userId === loggedInUserId;

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = () => {
    setIsOpen(false); // Close the dropdown when an item is clicked
  };

  const handleReportClick = () => {
    setModalOpen(true);
    handleItemClick();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleReportSubmit = (report) => {
    console.log("Report submitted:", report);
    // Add your submit logic here, e.g., send the report to your backend
    setModalOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={toggleDropdown}>More</button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {!isCurrentUser && (
            <div
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleItemClick}
            >
              <FollowBtn className="ml-10 mr-10" userId={userId} />
            </div>
          )}
          <div
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={handleReportClick}
          >
            Report
          </div>
          {!isCurrentUser && (
            <div
              className="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
              onClick={handleItemClick}
            >
              <BlockBtn userId={userId} />
            </div>
          )}
        </div>
      )}

      <ReportBlogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleReportSubmit}
        reporterId={loggedInUserId}
        blogId={blogId}
        blogUserId={userId}
      />
    </div>
  );
};

export default Dropdown;
