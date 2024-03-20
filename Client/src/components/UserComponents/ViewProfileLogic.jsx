import React, { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import Navbar from "../Navbar";
import { AiOutlineUpload } from "react-icons/ai";
import ChangePasswordModal from "./ChangePassword";

const ViewProfileLogic = () => {
  const [data, setData] = useState({});
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [reload, setReload] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  //for the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setReload(false);
    fetchData();
  }, [reload]);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/profile/:userid", { withCredentials: true })
      .then((response) => {
        setData(response.data.data);
        setFirstName(response.data.data.firstName);
        setMiddleName(response.data.data.middleName);
        setLastName(response.data.data.lastName);
        setEmail(response.data.data.email);
        setProfilePic(response.data.profilePicture);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCancel = () => {
    setEditMode(false);
  };
  const handleProfilePicChange = (e) => {
    const selectedProfilePic = e.target.files[0];
    setProfilePic(selectedProfilePic);

    const profilePicFile = new FormData();

    profilePicFile.append("profilePicture", selectedProfilePic);
    axios
      .put("http://localhost:3000/profile/:userId", profilePicFile, {
        withCredentials: true,
      })
      .then(() => {
        console.log("Data updated successfully");
        setReload(true);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("middleName", middleName);
    formData.append("lastName", lastName);
    formData.append("email", email);

    // Update the profile on the server
    axios
      .put("http://localhost:3000/profile/:userid", formData, {
        withCredentials: true,
      })
      .then(() => {
        console.log("Data updated successfully");
        setEditMode(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <>
      <div className="flex items-center justify-center h-full mt-10">
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
          <div>
            {editMode ? (
              <div className="mb-10">
                <form onSubmit={handleSave}>
                  <div>
                    <label>FirstName : </label>
                    <input
                      type="text"
                      name="firstName"
                      value={firstName}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-lg"
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <br />
                  <div>
                    <label>MiddleName : </label>
                    <input
                      type="text"
                      name="middleName"
                      value={middleName}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-lg"
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Enter your middle name"
                    />
                  </div>
                  <br />
                  <div className="mb-5">
                    <label>LastName : </label>
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-lg"
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                    <br />
                  </div>
                  <div>
                    <label>Email Id : </label>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-lg"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                    <br />
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex">
                  <div className="flex-grow">
                    <div>
                      <label>FirstName : </label>
                      <p className="text-xl">{firstName}</p>
                      <br />
                      <label>MiddleName: </label>
                      <p className="text-xl">{middleName}</p>
                      <br />
                      <label>LastName: </label>
                      <p className="text-xl">{lastName}</p>
                      <br />
                      <label>Email Id: </label>
                      <p className="text-xl">{email}</p>
                      <br />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {data.profilePicture && (
                      <>
                        <div className="relative">
                          <label
                            htmlFor="profilePictureInput"
                            className="cursor-pointer"
                          >
                            <div className="relative">
                              <AiOutlineUpload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white   hover:bg-opacity-50 hover:scale-150 transition-transform duration-300" />
                              <img
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full"
                                src={`data:${
                                  data.profilePicture.contentType
                                };base64,${Buffer.from(
                                  data.profilePicture.data.data
                                ).toString("base64")}`}
                                alt="Profile"
                              />
                            </div>
                          </label>
                          <input
                            id="profilePictureInput"
                            type="file"
                            accept="*"
                            onChange={handleProfilePicChange}
                            className="hidden"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {!data.profilePicture && (
                      <>
                        <label
                          htmlFor="profilePictureInput"
                          className="cursor-pointer"
                        >
                          <div className="relative">
                            <label
                              htmlFor="profilePictureInput"
                              className="cursor-pointer"
                            >
                              <div className="relative">
                                <AiOutlineUpload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white hover:bg-opacity-50 hover:scale-150 transition-transform duration-300" />
                                <img
                                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200"
                                  src="/default-profile-picture.png" // Provide a path to your default profile picture
                                />
                                {/* Centered text */}
                                <div className="absolute inset-0 mt-20 flex items-center justify-center text- text-sm">
                                  Upload Profile Pic
                                </div>
                              </div>
                            </label>
                            <input
                              id="profilePictureInput"
                              type="file"
                              accept="*"
                              onChange={handleProfilePicChange}
                              className="hidden"
                            />
                          </div>
                        </label>
                        <input
                          id="profilePictureInput"
                          type="file"
                          accept="*"
                          onChange={handleProfilePicChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-shrink-0 border-1 justify-between flex items-center mt-5 sm:mt-0">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-lg"
              onClick={editMode ? handleSave : handleEdit}
            >
              {editMode ? "Save" : "Edit"}
            </button>

            <button
              className="px-4 py-2 ml-5 bg-blue-500 text-white rounded-md text-lg"
              onClick={editMode ? handleCancel : openModal}
            >
              {editMode ? "Cancel" : "Change Password"}
            </button>
            {isModalOpen && <ChangePasswordModal closeModal={closeModal} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default ViewProfileLogic;
