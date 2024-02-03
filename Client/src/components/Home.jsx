import React from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <div>
        <Upload />
        <AllUserBlogs />
      </div>
    </div>
  );
}

export default Home;
