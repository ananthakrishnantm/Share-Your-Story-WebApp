import axios from "axios";
import React, { useState } from "react";

const ChangePasswordModal = ({ closeModal }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const path = "/profile/:userid";

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios
      .put(apiBaseUrl + path, { password }, { withCredentials: true })
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-bold mb-4">Change Password</h2>
        <div>
          <label className="block mb-1">Enter new password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md px-2 py-1 mb-2"
          />
        </div>
        <div>
          <label className="block mb-1">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded-md px-2 py-1 mb-2"
          />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
