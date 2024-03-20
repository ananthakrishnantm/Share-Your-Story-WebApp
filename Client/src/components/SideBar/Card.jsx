import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const FollowerCard = ({ follower }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={`data:${
          follower.profilePicture.contentType
        };base64,${Buffer.from(follower.profilePicture.data.data).toString(
          "base64"
        )}`}
        alt={follower.username}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {follower.username}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FollowerCard;
