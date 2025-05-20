import React, { useState } from "react";
import axios from "axios";

const ViewProfileBtn = ({ blogId, blogownerId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogContent, setBlogContent] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const userId = blogownerId;

  const handleViewBlog = async () => {
    try {
      const path = `/blog/otherUser/${userId}/blogs/${blogId}`;
      const apiUrl = apiBaseUrl + path;

      const response = await axios.get(apiUrl, { withCredentials: true });
      setBlogContent(response.data.data); // Assuming response.data contains the blog content
      setIsModalOpen(true); // Open the modal after fetching the content
    } catch (error) {
      console.log(error);
    }
  };

  console.log("this is the blog content", blogContent);

  const closeModal = () => {
    setIsModalOpen(false);
    setBlogContent(null);
  };

  return (
    <>
      <button onClick={handleViewBlog}>click here</button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Blog Content</h2>
            <p>{blogContent ? blogContent.content : "Loading..."}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProfileBtn;
