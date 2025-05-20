import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
import { LikeUnlikeComponent } from "./UserComponents/LikeUnlikeComponent";
import DisplayComments from "./CommentComponents/DisplayComments";
import BlockBtn from "./UserComponents/BlockBtn";
import MoreBtn from "./SideBar/MoreBtn";
import ViewCountComponent from "./CommentComponents/ViewCountComponent";

const AllUserBlogs = ({ triggerFetch }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5; // Fixed limit
  const observer = useRef(null);
  const sentinelRef = useRef();
  const navigate = useNavigate();

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const path = `/blog?offset=${offset}&limit=${limit}`;
    const mainUrl = apiBaseUrl + path;

    try {
      const response = await axios.get(mainUrl, { withCredentials: true });

      // console.log(response);

      setBlogs((prevBlogs) => [...prevBlogs, ...response.data.data.blogs]);
      setOffset((prevOffset) => prevOffset + limit);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [loading, limit, offset, apiBaseUrl]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchData();
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [fetchData, triggerFetch]);

  const formatDate = useCallback((timeStamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timeStamp).toLocaleString("en-US", options);
  }, []);

  // console.log("this is the all data", blogs);

  return (
    <div className="flex-1 mt-16 md:ml-36 lg:ml-48 xl:ml-48 ml-auto mr-1">
      {blogs.map((data) => (
        <div key={data._id} className="max-w-3xl mx-auto mb-1">
          <div
            className="bg-white rounded-md  shadow-custom"
            onClick={() => navigate(`/home/${data.user}/blogs/${data._id}`)}
          >
            {data.image && (
              <img
                className="w-full h-32 object-cover object-center"
                src={`data:${data.image.contentType};base64,${Buffer.from(
                  data.image.data.data
                ).toString("base64")}`}
                alt={data.title}
              />
            )}
            <div className="ml-50vh flex">
              <div className="px-6  flex flex-1 flex-col">
                {data.userDetails && data.userDetails.profilePicture && (
                  <div className="flex items-center w-full">
                    <div>
                      <img
                        className="w-12 h-12 sm:w-16 sm:h-16  m-5 rounded-full"
                        src={`data:${data.userDetails.profilePicture.contentType};base64,${data.userDetails.profilePicture.data}`}
                        alt={data.userDetails.profilePicture.username}
                      />
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link to={`/home/${data.user}/blogs`}>
                        <h1 className="text-sm  font-bold text-gray-700 sm:text-lg md:text-xl  ">
                          {data.userDetails.username}
                        </h1>
                      </Link>
                    </div>
                  </div>
                )}
                <div className="mb-10">
                  <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    {data.title}
                  </h1>
                </div>
                <div>
                  <p
                    style={{ whiteSpace: "pre-wrap" }}
                    className="text-black text-base mb-5"
                  >
                    {data.content}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-base mb-5">
                    Created on: {formatDate(data.createdAt)}
                  </p>
                  <div>
                    <div className="flex gap-8 mb-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <LikeUnlikeComponent blogId={data._id} />
                      </div>
                      <div>
                        <DisplayComments blogId={data._id} userId={data.user} />
                      </div>
                      <div>
                        <p>
                          <ViewCountComponent blogId={data._id} />
                        </p>
                      </div>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative overflow-visible"
                      >
                        <MoreBtn userId={data.user} blogId={data._id} />
                      </div>
                    </div>
                    {/* <div>
                      <CommentSection blogId={data._id} />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/*the height is important for this as intersection observer needs a dimension to detect so add a height or margin or even border*/}
      <div ref={sentinelRef} className="flex justify-center h-10 text-white">
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default AllUserBlogs;
