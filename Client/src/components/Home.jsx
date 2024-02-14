import React, { useState } from "react";
import Upload from "./Upload";
import AllUserBlogs from "./AllUserBlogs";
import Navbar from "./Navbar";

function Home() {
  const [triggerFetch, setTriggerFetch] = useState(false);

  const updateBlogList = () => {
    setTriggerFetch(!triggerFetch);
  };

  return (
    <div>
      <Navbar />
      <div>
        <Upload updateBlogList={updateBlogList} />
        <AllUserBlogs triggerFetch={triggerFetch} />
      </div>
    </div>
  );
}

export default Home;
