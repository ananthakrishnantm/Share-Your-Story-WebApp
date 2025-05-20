import axios from "axios";
import React, { useEffect, useState } from "react";

const CommentSection = ({ blogId, userId }) => {
  // Assuming userId is passed as a prop
  const [commentData, setCommentData] = useState([]);
  const [editedComment, setEditedComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [commentInputData, setCommentInputData] = useState("");
  const [loggedInUserData, setLoggedInUserData] = useState({});
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  //this is the guy who logged in
  //to make sure only that the person logged in can enter the data
  const loggedUserData = async () => {
    const path = `/profile/data/:userId`;
    const apiUrl = apiBaseUrl + path;

    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      setLoggedInUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  //this is to display the comment
  const displayComments = async () => {
    const path = `/blog/user/blogs/${blogId}/comments`;
    const apiUrl = apiBaseUrl + path;

    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      setCommentData(response.data.data);
    } catch (error) {
      console.log(error);
    }
    // const apiBaseUrl = import.meta.env.VITE_API_URL;
  };

  //this is to post the comment
  const handleComment = async () => {
    const path = `/blog/user/:userId/blogs/${blogId}/postcomments`;
    const apiUrl = apiBaseUrl + path;

    try {
      const response = await axios.post(
        apiUrl,
        { commentText: commentInputData },
        { withCredentials: true }
      );
      displayComments();
      // Update commentData state with the new comment
      setCommentData((prevComments) => [...prevComments, response.data.data]);
      // Clear comment input
      setCommentInputData("");
    } catch (error) {
      console.log(error);
    }
  };

  const startEditing = (comment) => {
    setEditedComment(comment);
    setEditedContent(comment.content);
  };

  const handleSave = (commentId) => {
    const path = `/blog/user/:userId/blogs/${blogId}/comments/${commentId}`;
    const apiUrl = apiBaseUrl + path;

    axios
      .put(apiUrl, { commentText: editedContent }, { withCredentials: true })
      .then((response) => {
        displayComments();
        setEditedComment(null);
        setEditedContent("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log("blogData", commentData);
  // console.log("logged   user data", loggedInUserData);

  const handleDelete = (commentId) => {
    const path = `/blog/user/:userId/blogs/${blogId}/comments/${commentId}`;
    const apiUrl = apiBaseUrl + path;

    axios
      .delete(apiUrl, { withCredentials: true })
      .then((response) => {
        displayComments();
        setCommentData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loggedUserData();

    displayComments();
  }, []);

  return (
    <div>
      <div>
        <div className="flex flex-grow gap-5 mb-6  ">
          <div className="flex-grow">
            {/*this is the main comment input, like the first main comment */}
            <input
              className="bg-slate-300 text-black p-1 rounded-md font-mono w-full"
              type="text"
              placeholder="Add a comment..."
              value={commentInputData}
              onChange={(e) => setCommentInputData(e.target.value)}
            />
          </div>
          <div>
            <button
              className="bg-blue-700 p-1 px-2 text-white rounded-md font-mono"
              onClick={handleComment}
            >
              Send
            </button>
          </div>
        </div>
        <div className="pl-5 bg-slate-200 p-2 rounded-md">
          {commentData &&
            commentData.map((data, index) => (
              <div key={index}>
                <div>
                  <div>
                    {data &&
                      data.comments.map((comment, innerIndex) => (
                        <div key={innerIndex}>
                          {editedComment &&
                          editedComment._id === comment._id ? (
                            <>
                              {/* This is the edited section */}
                              <input
                                type="text"
                                value={editedContent}
                                className=""
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                              />
                              <button onClick={() => handleSave(comment._id)}>
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="mb-4">
                                <p className="bg-slate-300 p-2 rounded-md">
                                  {comment.content}
                                </p>

                                {/* Only display edit and delete options if the comment was created by the user */}
                                {console.log(
                                  "this is the blogdata",
                                  data.user._id,
                                  "this is the comment data",
                                  loggedInUserData.userId
                                )}

                                {loggedInUserData &&
                                  loggedInUserData.userId ===
                                    comment.user._id && (
                                    <div className="flex gap-4 text-blue-600 mt-1 pl-2">
                                      <p
                                        onClick={() => startEditing(comment)}
                                        className="underline text-sm"
                                      >
                                        Edit
                                      </p>
                                      <p
                                        className="underline text-sm"
                                        onClick={() =>
                                          handleDelete(comment._id)
                                        }
                                      >
                                        Delete
                                      </p>
                                    </div>
                                  )}

                                {loggedInUserData &&
                                  loggedInUserData.userId === data.user._id &&
                                  loggedInUserData.userId !==
                                    comment.user._id && (
                                    <div className="flex gap-4 text-blue-600 mt-1 pl-2">
                                      <p
                                        className="underline text-sm"
                                        onClick={() =>
                                          handleDelete(comment._id)
                                        }
                                      >
                                        Delete
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
