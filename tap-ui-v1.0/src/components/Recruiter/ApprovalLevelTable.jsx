import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApprovalTable = () => {
  const [approvers, setApprovers] = useState([]);
  const [employeeContacts, setEmployeeContacts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [workflowStatus, setWorkflowStatus] = useState("");
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [approverId, setApproverId] = useState(null);

  useEffect(() => {
    fetchApprovers();
    fetchEmployees();
    fetchWorkflowStatus();
  }, []);

  const fetchApprovers = async () => {
    const mrfid = sessionStorage.getItem("mrfid");
    try {
      const response = await axios.get(
        `http://localhost:8080/tap/getApproverLevel/${mrfid}`
      );
      setApprovers(response.data);
    } catch (error) {
      toast.error("Error fetching approvers.");
      console.error("Error fetching approvers:", error);
    }
  };

  const fetchWorkflowStatus = async () => {
    try {
      const mrfid = sessionStorage.getItem("mrfid");
      const response = await axios.get(
        `http://localhost:8080/tap/getWorkflow/${mrfid}`
      );
      if (response.data && response.data.status) {
        setWorkflowStatus(response.data.status);
      }
    } catch (error) {
      console.error("Failed to fetch workflow status:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/tap/getallemployee"
      );
      setEmployeeContacts(response.data);
    } catch (error) {
      toast.error("Error fetching employees.");
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (index) => {
    const approver = approvers[index];
    setApproverId(approver.approverId);
    setEditedRowIndex(index);
    setSelectedApprover(approver.employee.employeeId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedApprover("");
    setSearchTerm("");
    setEditedRowIndex(null);
  };

  const handleSubmit = async () => {
    const mrfid = sessionStorage.getItem("mrfid");
    if (!selectedApprover || !mrfid) {
      toast.warn("Please select an approver and ensure MRF ID is available.");
      return;
    }

    const selectedEmployee = employeeContacts.find(
      (emp) => emp.employeeId === selectedApprover
    );
    if (!selectedEmployee) {
      toast.warn("Selected approver does not exist.");
      return;
    }

    const newRow = {
      level: approvers.length + 1,
      mrf: { mrfId: mrfid },
      employee: { employeeId: selectedApprover, role: selectedEmployee.role },
    };

    if (workflowStatus === "Approved" || workflowStatus === "Rejected") {
      try {
        await axios.post(
          `http://localhost:8080/tap/addSingleApproverLevel`,
          newRow
        );
        toast.success("Approver added successfully!");
      } catch (error) {
        toast.error("Failed to add approver.");
        console.error("Error adding approver:", error);
      }
    } else {
      setApprovers((prevApprovers) => [...prevApprovers, newRow]);
      toast.success("Approver added successfully!");
    }

    handleCloseModal();
  };

  const handleUpdate = async () => {
    const approverDetails = employeeContacts.find(
      (emp) => emp.employeeId === selectedApprover
    );
    if (!approverDetails) {
      toast.warn("Please select a valid approver.");
      return;
    }

    if (workflowStatus === "Pending") {
      toast.warn("Cannot update approver when workflow status is pending.");
      return;
    }

    const mrfid = sessionStorage.getItem("mrfid");
    const approverToUpdate = approvers[editedRowIndex];
    const updatedApprover = {
      approverId: approverId,
      mrf: { mrfId: mrfid },
      employee: { employeeId: selectedApprover },
      level: approverToUpdate.level,
    };

    if (workflowStatus === "Approved" || workflowStatus === "Rejected") {
      try {
        const response = await axios.put(
          `http://localhost:8080/tap/updateApproverLevel`,
          updatedApprover
        );
        if (response.status === 200) {
          const updatedRows = [...approvers];
          updatedRows[editedRowIndex] = updatedApprover;
          setApprovers(updatedRows);
          toast.success("Approver updated successfully.");
          handleCloseModal();
        } else {
          toast.error("Failed to update approver.");
        }
      } catch (error) {
        toast.error("Error updating approver.");
        console.error("Error updating approver:", error);
      }
    } else {
      const updatedRows = [...approvers];
      updatedRows[editedRowIndex] = {
        ...updatedRows[editedRowIndex],
        employee: { employeeId: selectedApprover },
      };

      setApprovers(updatedRows);
      toast.success("Approver updated successfully.");
      handleCloseModal();
    }
  };

  const handleDelete = async (index) => {
    const approverToDelete = approvers[index];
    const approverLevelId = approverToDelete.approverId;

    if (workflowStatus === "Approved" || workflowStatus === "Rejected") {
      try {
        const response = await axios.delete(
          `http://localhost:8080/tap/deleteApproverLevel/${approverLevelId}`
        );
        if (response.status === 200) {
          setApprovers((prevApprovers) =>
            prevApprovers.filter((_, idx) => idx !== index)
          );
          toast.success("Approver deleted successfully.");
        }
      } catch (error) {
        toast.error("Error deleting approver.");
        console.error("Error deleting approver:", error);
      }
    } else {
      setApprovers((prevApprovers) =>
        prevApprovers.filter((_, idx) => idx !== index)
      );
      toast.success("Approver deleted successfully.");
    }
  };

  const handleSendForApproval = async () => {
    const mrfid = sessionStorage.getItem("mrfid");

    if (workflowStatus === "Approved" || workflowStatus === "Rejected") {
      const response = await axios.patch(
        `http://localhost:8080/tap/updateWorkFlowAsPendingForApprovalProcess/${mrfid}`
      );
      toast.success(
        "Levels sent for approval successfully. Your status is pending!"
      );
      return;
    }

    try {
      const dataToSend = approvers.map((row) => ({
        mrf: { mrfId: mrfid },
        employee: { employeeId: row.employee.employeeId },
        level: row.level,
        role: row.employee.role,
      }));

      const response = await axios.post(
        "http://localhost:8080/tap/addApproverLevel",
        dataToSend
      );

      if (response.status === 200) {
        toast.success("All approvers have been sent for approval!");
        setWorkflowStatus("Pending");
      }
    } catch (error) {
      toast.error("Error sending for approval.");
      console.error("Error sending for approval:", error);
    }
  };

  const filteredEmployees = employeeContacts.filter(
    (employee) =>
      employee.employeeEmail &&
      employee.employeeEmail.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const getRoleName = (employeeId) => {
    const employee = employeeContacts.find(
      (emp) => emp.employeeId === employeeId
    );
    return employee ? employee.role?.roleName || "No Role" : "No Role";
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="bg-white p-20 mt-14 w-4/5 m-auto bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-blue-950 font-semibold">
            Approver Level
          </h2>
          {workflowStatus && (
            <div
              className={`px-4 py-2 rounded-lg font-semibold ${
                workflowStatus === "Approved"
                  ? "bg-green-500 text-black"
                  : workflowStatus === "Rejected"
                  ? "bg-red-300 text-black"
                  : "bg-yellow-300 text-black"
              }`}
            >
              Status: {workflowStatus}
            </div>
          )}
          <button
            onClick={handleAddClick}
            disabled={workflowStatus === "Pending"}
            className={`flex items-center ${
              workflowStatus === "Pending"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-950 hover:bg-blue-900 transform transition-transform duration-200"
            } text-white px-4 py-2 rounded-lg`}
          >
            <FaPlus className="mr-2" /> Add Approver
          </button>
        </div>

        <table className="w-full table-auto bg-white shadow-xl rounded-lg">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-4 border-b text-left">Level</th>
              <th className="py-3 px-4 border-b text-left">Approver Name</th>
              <th className="py-3 px-4 border-b text-left">Contact</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvers.length > 0 ? (
              approvers.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-300 transition-colors duration-200`}
                >
                  <td className="py-2 px-4 border-b text-left">{row.level}</td>
                  <td className="py-2 px-4 border-b text-left">
                    {
                      employeeContacts.find(
                        (emp) => emp.employeeId === row.employee.employeeId
                      )?.employeeEmail
                    }{" "}
                    ({getRoleName(row.employee.employeeId)})
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {
                      employeeContacts.find(
                        (emp) => emp.employeeId === row.employee.employeeId
                      )?.employeeEmail
                    }
                  </td>
                  <td className="py-2 px-4 border-b text-center flex justify-center">
                    <button
                      onClick={() => handleEditClick(index)}
                      className={`text-blue-500 mr-2 hover:text-blue-700 transition-colors duration-200`}
                      disabled={workflowStatus === "Pending"}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className={`text-red-500 hover:text-red-700 transition-colors duration-200`}
                      disabled={workflowStatus === "Pending"}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No approvers added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          {workflowStatus !== "Pending" && (
            <button
              onClick={handleSendForApproval}
              className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-2 rounded-lg transition mt-4"
            >
              Send for Approval
            </button>
          )}
        </div>
      </div>

      {/* Add Approver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Add Approver</h3>
            <div className="mb-4">
              <label className="block mb-2">Approval Level</label>
              <input
                type="text"
                value={approvers.length + 1} // Automatically incrementing level
                readOnly
                className="border border-gray-300 px-4 py-2 rounded-lg w-full bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Search Approver</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full"
              />
              {searchTerm && (
                <div className="mt-2 bg-white shadow-md rounded-lg max-h-60 overflow-auto">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.employeeId}
                      className="flex items-center p-2 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedApprover(employee.employeeId);
                        setSearchTerm(employee.employeeEmail);
                      }}
                    >
                      <img
                        src={employee.profilePicture || "default-avatar.png"}
                        alt={employee.employeeEmail}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <span>{employee.employeeEmail}</span>
                        <span className="text-sm text-gray-500">
                          {employee.role?.roleName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedApprover && (
              <div className="mb-4 p-2 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-semibold">Selected Approver:</h4>
                <div className="flex items-center mt-2">
                  <img
                    src={
                      employeeContacts.find(
                        (emp) => emp.employeeId === selectedApprover
                      )?.profilePicture || "default-avatar.png"
                    }
                    alt="Selected Approver"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>
                    {
                      employeeContacts.find(
                        (emp) => emp.employeeId === selectedApprover
                      )?.employeeEmail
                    }
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Add
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Approver Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Edit Approver</h3>
            <div className="mb-4">
              <label className="block mb-2">Approval Level</label>
              <input
                type="text"
                value={approvers[editedRowIndex]?.level}
                readOnly
                className="border border-gray-300 px-4 py-2 rounded-lg w-full bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Search Approver</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full"
              />
              {searchTerm && (
                <div className="mt-2 bg-white shadow-md rounded-lg max-h-60 overflow-auto">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.employeeId}
                      className="flex items-center p-2 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSelectedApprover(employee.employeeId);
                        setSearchTerm(employee.employeeEmail);
                      }}
                    >
                      <img
                        src={employee.profilePicture || "default-avatar.png"}
                        alt={employee.employeeEmail}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <span>{employee.employeeEmail}</span>
                        <span className="text-sm text-gray-500">
                          {employee.role?.roleName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedApprover && (
              <div className="mb-4 p-2 border border-gray-300 rounded-lg bg-gray-50">
                <h4 className="font-semibold">Selected Approver:</h4>
                <div className="flex items-center mt-2">
                  <img
                    src={
                      employeeContacts.find(
                        (emp) => emp.employeeId === selectedApprover
                      )?.profilePicture || "default-avatar.png"
                    }
                    alt="Selected Approver"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>
                    {
                      employeeContacts.find(
                        (emp) => emp.employeeId === selectedApprover
                      )?.employeeEmail
                    }
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                Update
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalTable;
