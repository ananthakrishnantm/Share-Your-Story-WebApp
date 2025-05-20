import React from "react";

const DashbrdDelConfirm = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p>Are you sure you want to delete this item?</p>
        <div className="mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Yes, delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashbrdDelConfirm;
