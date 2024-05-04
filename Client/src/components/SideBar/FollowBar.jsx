import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Icon from "@mdi/react";
import { mdiAccountPlus } from "@mdi/js";
import Container from "@mui/material/Container";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { Buffer } from "buffer";

function FollowBar() {
  const [usersData, setUsersData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [socket, setSocket] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const currentUserDataFunction = () => {
    const path = "/profile/:userId";
    const apiUrl = apiBaseUrl + path;

    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => setCurrentUserData(response.data.data))
      .catch((error) => console.log(error));
  };

  const userDataList = () => {
    const path = "/profile/Users";
    const apiUrl = apiBaseUrl + path;
    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => setUsersData(response.data.data))
      .catch((error) => console.log(error));
  };

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

  useEffect(() => {
    const socket = socketIOClient(apiBaseUrl);
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    setSocket(socket);
    userDataList();
    currentUserDataFunction();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!currentUserData) {
    return null;
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "20px",
      }}
    >
      <div style={{ margin: "10px" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "20px" }}>
          Suggestions For You
        </h1>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {usersData.map((data, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  "&:hover .MuiButton-root": { transform: "scale(1.1)" },
                  "& .MuiButton-root": { transition: "transform 0.3s" },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={data.username}
                    src={`data:${
                      data.profilePicture.contentType
                    };base64,${Buffer.from(
                      data.profilePicture.data.data
                    ).toString("base64")}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.username}
                  secondary={
                    <div style={{ display: "inline" }}>
                      {" "}
                      {/* Changed Typography to div */}
                      {currentUserData.following.includes(data._id) ? (
                        <Button
                          style={{ color: "#8bc34a" }}
                          variant="outlined"
                          disableElevation
                          endIcon={<Icon path={mdiAccountPlus} size={1} />}
                          onClick={() => handleUnfollow(data._id)}
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          style={{ color: "#8bc34a" }}
                          variant="outlined"
                          disableElevation
                          endIcon={<Icon path={mdiAccountPlus} size={1} />}
                          onClick={() => handleFollow(data._id)}
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </div>
    </Container>
  );
}

export default FollowBar;
