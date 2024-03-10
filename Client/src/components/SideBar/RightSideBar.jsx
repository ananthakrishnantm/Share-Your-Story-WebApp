import React from "react";

const RightSideBar = () => {
  return (
    <div className="bg-white h-full w-80 mt-5 ml-5  text-black rounded-xl">
      <div className="p-5 hover:bg-gray-500 hover:text-white cursor-pointer transition duration-300 rounded-t-xl">
        Profile
      </div>
      <div className="p-5 hover:bg-gray-500 hover:text-white cursor-pointer transition duration-300 ">
        MyBlog
      </div>

      <div className="p-5 hover:bg-gray-500 hover:text-white cursor-pointer transition duration-300 rounded-b-xl">
        Logout
      </div>
    </div>
  );
};

export default RightSideBar;
