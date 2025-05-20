import React, { useState } from "react";
import axios from "axios";

const ReportBlogModal = ({
  blogUserId,
  reporterId,
  blogId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [report, setReport] = useState("");
  const maxChars = 100; // Set the maximum character limit

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const path = `/report/blog`;
      const apiUrl = apiBaseUrl + path;

      await axios.post(
        apiUrl,
        {
          reporterId: reporterId,
          blogId: blogId,
          reason: report,
          blogUserId: blogUserId,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    setReport("");
    onClose();
    onSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl mb-4">Report User</h2>
        <form onSubmit={handleReportSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Reason for reporting
          </label>
          <textarea
            maxLength={maxChars}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows="4"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            required
          ></textarea>
          <div className="text-sm text-gray-500">
            {maxChars - report.length} characters remaining
          </div>
          {report.length >= maxChars && (
            <div className="text-sm text-red-500">
              Maximum character limit reached
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              disabled={report.length >= maxChars} // Disable the submit button if the maxChars is reached
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportBlogModal;
