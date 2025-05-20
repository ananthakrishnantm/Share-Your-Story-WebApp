import axios from "axios";
import React, { useEffect, useState } from "react";

const BanBtn = ({ userId, banReason }) => {
  // console.log("this is from the ban btn", userId);
  // console.log("this is the reason", banReason);
  // console.log("this is the ban status", isbanned);
  const [currentUser, setCurrentUser] = useState(null);
  const [banStatusChanged, setBanStatusChanged] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchUserData = async () => {
    try {
      const path = `/profile/blog/${userId}`;
      const apiUrl = apiBaseUrl + path;

      const response = await axios.get(apiUrl, { withCredentials: true });
      setCurrentUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const path = `/profile/banned/${userId}`;
      const apiUrl = apiBaseUrl + path;
      const response = await axios.put(
        apiUrl,
        {},
        {
          withCredentials: true,
        }
      );
      setBanStatusChanged(!banStatusChanged);
    } catch (erro) {
      console.log("this is the error", error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const path = `/profile/unban/${userId}`;
      const apiUrl = apiBaseUrl + path;
      const response = await axios.put(
        apiUrl,
        {},
        {
          withCredentials: true,
        }
      );
      setBanStatusChanged(!banStatusChanged);
    } catch (erro) {
      console.log("this is the error", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, banStatusChanged]);

  const banCheck = currentUser?.isBanned;

  console.log("this is the current user", banCheck);
  return (
    <div>
      {banCheck ? (
        <button onClick={() => handleUnbanUser(userId)}>unban</button>
      ) : (
        <button onClick={() => handleBanUser(userId)}>ban</button>
      )}
    </div>
  );
};

export default BanBtn;
