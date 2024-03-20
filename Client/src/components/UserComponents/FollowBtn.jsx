import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import Button from "@mui/material/Button";
import Icon from "@mdi/react";
import { mdiAccountPlus } from "@mdi/js";

const FollowBtn = ({ userId }) => {
  const [currentUserData, setCurrentUserData] = useState(null);
  const [socket, setSocket] = useState(null);
  console.log("this is the userID", userId);
  useEffect(() => {
    const fetchUserData = () => {
      const apiUrl = `http://localhost:3000/profile/:userId`;
      axios
        .get(apiUrl, { withCredentials: true })
        .then((response) => setCurrentUserData(response.data.data))
        .catch((error) => console.log(error));
    };

    const socket = socketIOClient("http://localhost:3000");
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
    const apiUrl = `http://localhost:3000/follower/blog/users/:userId/${userToUnFollowId}`;
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
    const apiUrl = `http://localhost:3000/follower/blog/users/:userId/follow`;
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
