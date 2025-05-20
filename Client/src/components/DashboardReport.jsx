import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import DashboardSideBar from "./DashboardSideBar";
import BanBtn from "./buttons/BanBtn";
import ViewProfileBtn from "./buttons/ViewProfileBtn";
import DashboardDeleteBtn from "./buttons/DashboardDeleteBtn";

const DashboardReport = () => {
  const [report, setReport] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
    setIsActionsDropdownOpen(false); // Close the other dropdown if open
  };
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  //this is not done yet
  const fetchreport = async () => {
    try {
      const path = `/report/blogdisplay`;
      const apiUrl = apiBaseUrl + path;

      const response = await axios.get(apiUrl, { withCredentials: true });
      setReport(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchreport();
  }, []);

  console.log("this is the report ", report);
  // Handler to toggle all checkboxes at once
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setReport((prevReport) =>
      prevReport.map((item) => ({ ...item, isSelected: !selectAll }))
    );
  };

  // Handler to toggle individual checkboxes
  const handleCheckboxChange = (id) => {
    setReport((prevReport) =>
      prevReport.map((item) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const selectedReportIds = report
    .filter((item) => item.isSelected)
    .map((item) => item._id);

  const deleteReport = async (selectedReportIds) => {
    try {
      const path = `/report/action/delete`;
      const apiUrl = apiBaseUrl + path;

      await axios.post(
        apiUrl,
        { ids: selectedReportIds }, // Send the ids in the request body
        { withCredentials: true } // Include credentials if necessary
      );

      // Update the state by removing the deleted reports
      setReport((prevReport) =>
        prevReport.filter((item) => !selectedReportIds.includes(item._id))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex-1 p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Reports</h2>
      <div className="mb-2">
        {/* Start coding here */}
        <div className="relative bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required=""
                  />
                </div>
              </form>
            </div>
            <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
              {/*this is the delete button */}
              <div className="flex items-center w-full space-x-3 md:w-auto">
                <button
                  id="actionsDropdownButton"
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  <DashboardDeleteBtn
                    onDelete={() => deleteReport(selectedReportIds)}
                  />
                </button>

                <button
                  id="filterDropdownButton"
                  onClick={toggleFilterDropdown}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-4 mr-2 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filter
                  <svg
                    className="-mr-1 ml-1.5 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </button>
                {/* Dropdown menu */}
                {isFilterDropdownOpen && (
                  <div
                    id="filterDropdown"
                    className="z-10 absolute mt-36  w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                  >
                    <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                      Category
                    </h6>
                    <ul
                      className="space-y-2 text-sm"
                      aria-labelledby="dropdownDefault"
                    >
                      <li className="flex items-center">
                        <input
                          id="apple"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="apple"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Apple (56)
                        </label>
                      </li>
                      <li className="flex items-center">
                        <input
                          id="fitbit"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor="fitbit"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                        >
                          Fitbit (56)
                        </label>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {/* Table */}
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Reported User
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Blog Owner
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                ReportCount
              </th>
            </tr>
          </thead>
          <tbody>
            {report.map((user, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={user.isSelected}
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-2"
                      src={`data:${user.reporterDetails.profilePicture.contentType};base64,${user.reporterDetails.profilePicture.data}`}
                      alt={user.reporterDetails.username}
                    />
                    <p className="text-gray-600">
                      {user.reporterDetails.username}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-2"
                      src={`data:${user.blogUserDetails.profilePicture.contentType};base64,${user.blogUserDetails.profilePicture.data}`}
                      alt={user.blogUserDetails.username}
                    />
                    <p className="text-gray-600">
                      {user.blogUserDetails.username}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    <div className="p-2 bg-red-600 rounded-md mr-4">
                      <BanBtn
                        userId={user.blogUserDetails._id}
                        banReason={user.reason}
                        isbanned={user.blogUserDetails.isBanned}
                      />
                    </div>
                    <div className="p-2 bg-red-600 rounded-md mr-4">
                      <ViewProfileBtn
                        blogId={user.blogDetails._id}
                        blogownerId={user.blogUserDetails._id}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-600">{user.reason}</p>
                </td>
                <td className="px-6 py-4">
                  {" "}
                  <p className="text-gray-600">{user.reportCount}</p>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default DashboardReport;
