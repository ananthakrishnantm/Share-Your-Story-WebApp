import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { UseAuth } from "../GlobalStateMangement/UseAuthProvider";

const FollowBtn = ({ userId }) => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [socket, setSocket] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { loggedInUserId } = UseAuth();

  // console.log("this is the userID", userId);

  useEffect(() => {
    // const socketLink = socketIOClient(apiBaseUrl);
    // setSocket(socketLink);

    // socketLink.on("connect_error", (error) => {
    //   console.error("Socket connection error:", error);
    // });

    const fetchUserData = () => {
      const path = `/profile/:userId`;

      const apiUrl = apiBaseUrl + path;
      axios
        .get(apiUrl, { withCredentials: true })
        .then((response) => setCurrentUserData(response.data.data))
        .catch((error) => console.log(error));
    };

    // console.log("this is the socket", socketLink);

    fetchUserData();

    // return () => {
    //   if (socketLink) {
    //     return socketLink.disconnect();
    //   }
    // };
  }, [apiBaseUrl, userId]);

  const handleUnfollow = (userToUnFollowId) => {
    const path = `/follower/blog/users/:userId/${userToUnFollowId}`;
    const apiUrl = apiBaseUrl + path;
    axios
      .delete(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        setCurrentUserData((prevData) => ({
          ...prevData,
          following: prevData.following.filter(
            (userId) => userId !== userToUnFollowId
          ),
        }));
      })
      .catch((error) => console.log(error));
  };

  const handleFollow = (userToFollowId) => {
    const path = `/follower/blog/users/:userId/follow`;
    const apiUrl = apiBaseUrl + path;
    axios
      .post(apiUrl, { userToFollowId }, { withCredentials: true })
      .then((response) => {
        setCurrentUserData((prevData) => ({
          ...prevData,
          following: [...prevData.following, userToFollowId],
        }));
      })
      .catch((error) => console.log(error));
  };

  if (!currentUserData) {
    return null; // Or loading indicator
  }
  const isFollowing = currentUserData.following.includes(userId);
  const isCurrentUser = userId === loggedInUserId;

  // console.log(currentUserData);

  return (
    <div>
      {!isCurrentUser &&
        (isFollowing ? (
          <button
           
            onClick={() => handleUnfollow(userId)}
          >
            Unfollow
          </button>
        ) : (
          <button
           
            onClick={() => handleFollow(userId)}
          >
            Follow
          </button>
        ))}
    </div>
  );
};

export default FollowBtn;
