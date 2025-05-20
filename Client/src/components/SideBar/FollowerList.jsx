import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";

import FollowBtn from "../UserComponents/FollowBtn";
const FollowerList = () => {
  const [userData, setUserData] = useState({});
  const [followersData, setFollowersData] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    followerData();
  }, []);

  const followerData = () => {
    const path = "/follower/blog/users/:userId/followers";
    const apiUrl = apiBaseUrl + path;

    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => setFollowersData(response.data))
      .catch((error) => console.log(error));
  };

  console.log("this is the followers data", followersData);

  return (
    <div className="flex-1  px-5 ml-auto md:mr-auto  lg:mt-5 md:ml-36 lg:ml-48 xl:ml-48">
      <div>
        {followersData.map((data, index) => (
          <div key={index}>
            <div className="  p-4 rounded-lg shadow-md mb-4">
              <div className="flex-1 flex-wrap items-center justify-between mb-4">
                <div className="flex items-center  sm:text-sm p-4  sm:mr-4">
                  <div className="flex-shrink-0">
                    <img
                      sx={{ width: 40, height: 40, margin: 2 }}
                      alt={data.username}
                      src={`data:${
                        data.profilePicture.contentType
                      };base64,${Buffer.from(
                        data.profilePicture.data.data
                      ).toString("base64")}`}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  </div>
                  <div className="flex-grow  max-w-xs">
                    <h5 className="text-white">{data.username}</h5>
                  </div>
                </div>
                <div className=" p-4 w-full border-t-2 border-white/10 sm:w-auto">
                  <div>
                    <button
                      className=" text-white px-4 py-2 rounded-xl transition duration-300 hover:scale-105 rounded-t-xl"
                      style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
                    >
                      <FollowBtn userId={data._id} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowerList;
