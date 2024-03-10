import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Button } from "@mui/material";
import Icon from "@mdi/react";
import { mdiAccountPlus } from "@mdi/js";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";

function FollowBar() {
  const [usersData, setUsersData] = useState([]);
  const [followData, setFollowData] = useState([]);
  const [unfollowData, setunFollowData] = useState([]);

  const currentUserDataFunction = () => {
    const apiUrl = "http://localhost:3000/profile/:userId";
    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => setCurrentUserData(response.data.data))
      .catch((error) => console.log(error));
  };

  const userDataList = () => {
    const apiUrl = "http://localhost:3000/profile/Users";
    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => setUsersData(response.data.data))
      .catch((error) => console.log(error));
  };

  const handleUnfollow = (userToFollowId) => {
    const apiUrl = `http://localhost:3000/follower/blog/users/:userId/${userToFollowId}`;
    axios
      .delete(apiUrl, {
        // Data should be passed in the options object
        withCredentials: true,
      })
      .then((response) => {
        setunFollowData(response.data.data);
      })
      .catch((error) => console.log(error));
  };

  const handleFollow = (userToFollowId) => {
    const apiUrl = `http://localhost:3000/follower/blog/users/:userId/follow`;
    axios
      .post(apiUrl, { userToFollowId }, { withCredentials: true })
      .then((response) => {
        setFollowData(response.data);
      })
      .catch((error) => console.log(error));
  };

  const [currentUserData, setCurrentUserData] = useState([]);
  useEffect(() => {
    userDataList();
    currentUserDataFunction();
  }, [handleFollow, handleUnfollow]);

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
                  <img
                    className="w-16 h-16 m-5 rounded-full"
                    src={`data:${
                      data.profilePicture.contentType
                    };base64,${Buffer.from(
                      data.profilePicture.data.data
                    ).toString("base64")}`}
                    alt={data.username}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.username}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
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
                    </Typography>
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
