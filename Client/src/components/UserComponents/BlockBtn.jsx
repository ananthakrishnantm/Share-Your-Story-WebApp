import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseAuth } from "../GlobalStateMangement/UseAuthProvider";

const BlockBtn = ({ userId }) => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const { loggedInUserId } = UseAuth();

  useEffect(() => {
    const fetchBlockedUserList = async () => {
      const path = "/profile/blockedlist";
      const apiUrl = apiBaseUrl + path;
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        setBlockedUsers(response.data.data.blockedUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlockedUserList();
  }, [apiBaseUrl]);

  const handleBlockUser = async (userId) => {
    const path = `/profile/block/${userId}`;
    const apiUrl = apiBaseUrl + path;
    try {
      await axios.post(apiUrl, {}, { withCredentials: true });
      setBlockedUsers((prev) => [...prev, userId]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnblockUser = async (userId) => {
    const path = `/profile/unblock/${userId}`;
    const apiUrl = apiBaseUrl + path;
    try {
      await axios.delete(apiUrl, { withCredentials: true });
      setBlockedUsers((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      console.error(error);
    }
  };


  const isBlocked = blockedUsers.includes(userId);
  const isCurrentUser = userId === loggedInUserId;

  return (
    <div>
      {!isCurrentUser && // Conditionally render the buttons if it's not the current user
        (isBlocked ? (
          <button onClick={() => handleUnblockUser(userId)}>
            Unblock User
          </button>
        ) : (
          <button onClick={() => handleBlockUser(userId)}>Block User</button>
        ))}
    </div>
  );
};

export default BlockBtn;
