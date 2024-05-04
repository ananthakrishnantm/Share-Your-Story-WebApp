import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Button from "@mui/material/Button";
import Icon from "@mdi/react";
import { mdiAccountPlus } from "@mdi/js";

const FollowBtn = ({ userId }) => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [socket, setSocket] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  console.log("this is the userID", userId);
  useEffect(() => {
    const fetchUserData = () => {
      const path = `/profile/:userId`;

      const apiUrl = apiBaseUrl + path;
      axios
        .get(apiUrl, { withCredentials: true })
        .then((response) => setCurrentUserData(response.data.data))
        .catch((error) => console.log(error));
    };

    const socket = socketIOClient(apiBaseUrl);
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    setSocket(socket);

    fetchUserData();

    return () => {
      socket.disconnect();
    };
  }, []);

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

  console.log(currentUserData);

  return (
    <div>
      {currentUserData.following.includes(userId) ? (
        <Button
          style={{ color: "#8bc34a" }}
          variant="outlined"
          disableElevation
          endIcon={<Icon path={mdiAccountPlus} size={1} />}
          onClick={() => handleUnfollow(userId)}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          style={{ color: "#8bc34a" }}
          variant="outlined"
          disableElevation
          endIcon={<Icon path={mdiAccountPlus} size={1} />}
          onClick={() => handleFollow(userId)}
        >
          Follow
        </Button>
      )}
    </div>
  );
};

export default FollowBtn;
