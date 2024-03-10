import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const LikeUnlikeComponent = ({ blogId }) => {
  const [displaylike, setDisplayLike] = useState([]);

  useEffect(() => {
    likeUnlike();
  }, []);

  const handleLikeUnlike = (actionType) => {
    console.log("Action type:", actionType);
    axios
      .put(
        `http://localhost:3000/blog/user/:userId/blogs/${blogId}/like`,
        {
          action: actionType,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        likeUnlike();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const likeUnlike = () => {
    axios
      .get(`http://localhost:3000/blog/user/:userId/blogs/${blogId}/like`, {
        withCredentials: true,
      })
      .then((response) => {
        setDisplayLike(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleLikeUnlike = (currentAction) => {
    handleLikeUnlike(currentAction === "like" ? "unlike" : "like");
  };
  return (
    <div>
      {displaylike &&
        displaylike.map((data, index) => (
          <button onClick={() => toggleLikeUnlike(data.action)} key={index}>
            <FavoriteIcon />
            {data.likesCount || 0}
          </button>
        ))}
    </div>
  );
};
