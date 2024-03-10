import axios from "axios";
import React, { useEffect, useState } from "react";

const CommentSection = ({ blogId, userId }) => {
  // Assuming userId is passed as a prop
  const [commentData, setCommentData] = useState([]);
  const [editedComment, setEditedComment] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [commentInputData, setCommentInputData] = useState("");
  const [loggedInUserData, setLoggedInUserData] = useState({});

  const loggedUserData = () => {
    const apiUrl = `http://localhost:3000/profile/data/:userId`;
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        setLoggedInUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("this is the logged data ", loggedInUserData);

  const displayComments = () => {
    const apiUrl = `http://localhost:3000/blog/user/:userId/blogs/${blogId}/comments`;
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        setCommentData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleComment = () => {
    const apiUrl = `http://localhost:3000/blog/user/:userId/blogs/${blogId}/comments`;

    axios
      .post(
        apiUrl,
        { commentText: commentInputData },
        { withCredentials: true }
      )
      .then((response) => {
        setCommentInputData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (comment) => {
    setEditedComment(comment);
    setEditedContent(comment.content);
  };

  const handleSave = (commentId) => {
    const apiUrl = `http://localhost:3000/blog/user/:userId/blogs/${blogId}/comments/${commentId}`;

    axios
      .put(apiUrl, { commentText: editedContent }, { withCredentials: true })
      .then((response) => {
        setEditedComment(null);
        setEditedContent("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (commentId) => {
    const apiUrl = `http://localhost:3000/blog/user/:userId/blogs/${blogId}/comments/${commentId}`;

    axios
      .delete(apiUrl, { withCredentials: true })
      .then((response) => {
        setCommentData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    displayComments();
  }, []);

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            value={commentInputData}
            onChange={(e) => setCommentInputData(e.target.value)}
          />
          <button onClick={handleComment}>Submit</button>
        </div>
        {commentData &&
          commentData.map((data, index) => (
            <div key={index}>
              <div>
                <div>
                  {data &&
                    data.comments.map((comment, innerIndex) => (
                      <div key={innerIndex}>
                        {editedComment && editedComment._id === comment._id ? (
                          <>
                            <input
                              type="text"
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <button onClick={() => handleSave(comment._id)}>
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <p>{comment.content}</p>
                            {/* Only display edit and delete options if the comment was created by the user */}
                            {loggedInUserData &&
                              loggedInUserData.userId === comment.user && (
                                <>
                                  <p onClick={() => handleEdit(comment)}>
                                    edit
                                  </p>
                                  <p onClick={() => handleDelete(comment._id)}>
                                    Delete
                                  </p>
                                </>
                              )}
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
  );
};

export default CommentSection;
