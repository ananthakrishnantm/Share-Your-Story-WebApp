import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const LikeUnlikeComponent = ({ blogId }) => {
  const [displaylike, setDisplayLike] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    likeUnlike();
  }, []);

  const handleLikeUnlike = (actionType) => {
    console.log("Action type:", actionType);
    const path = `/blog/user/:userId/blogs/${blogId}/like`;
    const apiUrl = apiBaseUrl + path;

    axios
      .put(
        apiUrl,
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
    const path = `/blog/user/:userId/blogs/${blogId}/like`;
    const apiUrl = apiBaseUrl + path;

    axios
      .get(apiUrl, {
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
          <div key={index} className="flex gap-2">
            <div>
              <button onClick={() => toggleLikeUnlike(data.action)}>
                <FavoriteIcon />
              </button>
            </div>
            <div>{data.likesCount || 0}</div>
          </div>
        ))}
    </div>
  );
};
