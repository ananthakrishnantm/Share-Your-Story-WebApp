import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MDEditor from "@uiw/react-md-editor";
import FollowBtn from "./FollowBtn";
import Navbar from "../Navbar";

const SearchProfile = () => {
  const [userData, setUserData] = useState();
  const [userBlogs, setUserBlogs] = useState([]);
  const { userId } = useParams("");
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  console.log(userId);

  const fetchUserData = () => {
    const path = `/profile/blog/${userId}`;
    const apiUrl = apiBaseUrl + path;

    axios
      .get(apiUrl, {
        withCredentials: true,
      })

      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchBlogData = () => {
    const url = `http://localhost:3000/blog/${userId}/blogs`;
    axios
      .get(url, { withCredentials: true })
      .then((response) => {
        const sortedBlogs = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserBlogs(sortedBlogs);
      })
      .catch((errr) => {
        console.log(err);
      });
  };

  const formatDate = (timeStamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timeStamp).toLocaleString("en-US", options);
  };

  useEffect(() => {
    fetchUserData();
    fetchBlogData();
  }, []);
  console.log(userBlogs);
  return (
    <div>
      <Navbar />
      <div className="my-10">
        {userData && (
          <>
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
                  {userData.profilePicture && (
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={`data:${
                        userData.profilePicture.contentType
                      };base64,${Buffer.from(
                        userData.profilePicture.data.data
                      ).toString("base64")}`}
                      alt={userData.title}
                    />
                  )}
                </Avatar>
                <Typography
                  component="h1"
                  variant="h5"
                  gutterBottom
                  style={{ fontSize: "24px" }}
                >
                  {userData.username}
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
                    <strong>
                      {userData.following ? userData.following.length : 0}
                    </strong>{" "}
                    <br />
                    Following:
                  </Typography>

                  <Typography
                    component="p"
                    variant="body1"
                    style={{ fontSize: "16px", marginRight: "10px" }}
                  >
                    <strong>
                      {userData.followers ? userData.followers.length : 0}
                    </strong>{" "}
                    <br />
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
                <FollowBtn userId={userId} />
              </div>
            </Container>
          </>
        )}
      </div>
      <div className="my-20">
        {userBlogs.length === 0 ? (
          <h1 className="text-3xl text-center font-bold ">No posts yet</h1>
        ) : (
          <div>
            {userBlogs.map((blog, index) => (
              <div className=" max-w-3xl mx-auto " key={index}>
                <div className="bg-white rounded-sm overflow-hidden shadow-custom mb-20 hover:transform scale-105 transition-transform duration-300">
                  {/*Always perfome the checks if to see if the item is present*/}
                  {blog.image && blog.image.contentType && (
                    <img
                      className=" w-full h-32 object-cover objct-center"
                      src={`data:${blog.image.contentType};base64,${Buffer.from(
                        blog.image.data.data
                      ).toString("base64")}`}
                      alt={blog.title}
                    />
                  )}
                  <div className="px-6 py-4">
                    <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">
                      {blog.title}
                    </h1>
                    <MDEditor.Markdown
                      source={blog.content}
                      style={{ whiteSpace: "pre-wrap" }}
                      className="text-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
                    />
                    <p className="text-gray-600 md:text-lg">
                      Created on:{formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProfile;
