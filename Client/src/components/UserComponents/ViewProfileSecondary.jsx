import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

function ViewProfileSecondary() {
  const [data, setData] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const profilePictureData = () => {
      const path = "/profile/:userId";
      const apiUrl = apiBaseUrl + path;

      axios
        .get(apiUrl, {
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
  // console.log(data);

  return (
    <div className="mt-10">
      <div className="bg-neutral-900 p-5 rounded-lg outline outline-1 outline-white/10">
        <div className=" flex flex-col items-center text-center mt-5 mb-2">
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
          <h5
            className="text-xl font-bold text-white p-5"
            style={{ fontSize: "24px" }}
          >
            {data.username}
          </h5>
          {/* {all the stuff is inside} */}
          <div className="flex justify-center m-4 mb-6 bg-white rounded-lg p-5">
            <Link to="/home/followinglist">
              <div className="hover:bg-slate-200 p-2 rounded-lg flex justify-center items-center h-16">
                <p className="text-base text-center">
                  <strong>{data.following ? data.following.length : 0}</strong>
                  <br />
                  Following
                </p>
              </div>
            </Link>
            <Link to="/home/followerlist">
              <div className="hover:bg-slate-200 p-2 rounded-lg flex justify-center items-center h-16">
                <p className="text-base text-center">
                  <strong>{data.followers ? data.followers.length : 0}</strong>{" "}
                  <br />
                  Followers
                </p>
              </div>
            </Link>
            <Link to="/home/userId">
              <div className="hover:bg-slate-200 p-2 rounded-lg flex justify-center items-center h-16">
                <p className="text-base text-center">
                  <strong> {data.blogCount ? data.blogCount : 0} </strong>{" "}
                  <br /> Posts
                </p>
              </div>
            </Link>
          </div>

          <div>
            <Link to={"/profile/:userId"} className="block">
              <div
                className=" text-white px-4 py-2 rounded-xl transition duration-300 hover:scale-105 rounded-t-xl"
                style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                Profile
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfileSecondary;
