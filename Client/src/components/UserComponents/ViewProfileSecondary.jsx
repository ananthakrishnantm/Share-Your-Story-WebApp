import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import { Buffer } from "buffer";

function ViewProfileSecondary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const profilePictureData = () => {
      axios
        .get("http://localhost:3000/profile/:userId", {
          withCredentials: true,
        })
        .then((response) => {
          setData(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    profilePictureData();
  }, []);

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <Avatar
          alt="User Avatar"
          sx={{ width: 120, height: 120, marginBottom: 2 }}
        >
          {data.profilePicture && (
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={`data:${
                data.profilePicture.contentType
              };base64,${Buffer.from(data.profilePicture.data.data).toString(
                "base64"
              )}`}
              alt={data.title}
            />
          )}
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          gutterBottom
          style={{ fontSize: "24px" }}
        >
          {data.username}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "15px",
            marginBottom: "25px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Typography
            component="p"
            variant="body1"
            style={{ fontSize: "16px", marginRight: "10px" }}
          >
            <strong>{data.following ? data.following.length : 0}</strong> <br />
            Following:
          </Typography>

          <Typography
            component="p"
            variant="body1"
            style={{ fontSize: "16px", marginRight: "10px" }}
          >
            <strong>{data.followers ? data.followers.length : 0}</strong> <br />
            Followers:
          </Typography>
          <Typography
            component="p"
            variant="body1"
            style={{ fontSize: "16px" }}
          >
            <strong> 100 </strong>
            <br /> Posts:
          </Typography>
        </div>
        <Button variant="contained" color="primary">
          View Profile
        </Button>
      </div>
    </Container>
  );
}

export default ViewProfileSecondary;
