import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Container,
} from "@mui/material";
const FollowingList = () => {
  const [userData, setUserData] = useState({});
  const [followersData, setFollowersData] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    followerData();
  }, []);

  const followerData = () => {
    const path = "/follower/blog/users/:userId/following";
    const apiUrl = apiBaseUrl + path;

    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => setFollowersData(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Container
        maxWidth="sm"
        sx={{ backgroundColor: "white", borderRadius: "16px", padding: "16px" }}
      >
        <Typography sx={{ fontWeight: "bold", marginBottom: 5 }}>
          <h1>FollowingList</h1>
        </Typography>
        <div>
          {followersData.map((data, index) => (
            <div key={index}>
              <Card sx={{ display: "flex", marginBottom: 2 }}>
                <Avatar
                  sx={{ width: 40, height: 40, margin: 2 }}
                  alt={data.username}
                  src={`data:${
                    data.profilePicture.contentType
                  };base64,${Buffer.from(
                    data.profilePicture.data.data
                  ).toString("base64")}`}
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent>
                    <Typography variant="h5" component="h1">
                      {data.username}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default FollowingList;
