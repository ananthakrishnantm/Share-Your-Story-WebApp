import React, { useState, useEffect } from "react";
import Icon from "@mdi/react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { Buffer } from "buffer";
import FollowBtn from "../UserComponents/FollowBtn";

function FollowBar() {
  const [usersData, setUsersData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [socket, setSocket] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const userDataList = async () => {
    const path = "/follower/users/:userId/suggestedFollowers";
    const apiUrl = apiBaseUrl + path;
    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      setUsersData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // const socket = socketIOClient(apiBaseUrl);
    // // console.log("this is the socket", socket);
    // socket.on("connect_error", (error) => {
    //   console.error("Socket connection error:", error);
    // });
    setSocket(socket);
    userDataList();

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md rounded-lg shadow-md p-4">
        <h1 className="text-white text-xl font-bold mb-4">Suggested For You</h1>
        <ul className="w-full">
          {usersData.map((data, index) => (
            <React.Fragment key={index}>
              <li className="flex items-center py-2 px-4 hover:transform hover:scale-110 transition-transform duration-300">
                <div className="mr-4">
                  <img
                    src={`data:${
                      data.profilePicture.contentType
                    };base64,${Buffer.from(
                      data.profilePicture.data.data
                    ).toString("base64")}`}
                    alt={data.username}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{data.username}</p>
                  <div
                    className=" text-white px-4 py-2 rounded-xl transition duration-300 hover:scale-105 rounded-t-xl"
                    style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
                  >
                    <FollowBtn userId={data._id} />
                  </div>
                </div>
              </li>
              <li className="w-full border-b border-gray-600 my-2"></li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FollowBar;
