import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaEdit, FaChevronRight, FaChevronLeft, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import AdminAddDepartment from './AdminAddDepartment'; // For adding new departments
import AdminEditDepartment from './AdminEditDepartment'; // For editing departments
import { getAdminDepartments } from '../../../services/Admin/Department/AdminDepartmentService'; // Add updateDepartment for updating data
 
const AdminViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDepartmentData, setEditDepartmentData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesCount, setEntriesCount] = useState(5);
 
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await getAdminDepartments();
        setDepartments(departmentData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch departments');
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);
 
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const filteredDepartments = departments.filter((department) =>
    department.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const totalPages = Math.ceil(filteredDepartments.length / entriesCount);
  const currentPageDepartments = filteredDepartments.slice(
    (currentPage - 1) * entriesCount,
    currentPage * entriesCount
  );
 
  const handleEditClick = (department) => {
    setEditDepartmentData(department);
    setIsEditModalOpen(true);
  };
 
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
 
  return (
    <div className="bg-[#eeeeee] min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl">
 
        {/* Department Title - Centered */}
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-semibold text-[#27235C]">Departments</h2>
        </div>
 
        {/* Entries per Page Dropdown, Search Bar, and Create Department Button - Same Row */}
        <div className="flex justify-between items-center mb-6">
          {/* Entries per Page Dropdown */}
          <div className="flex items-center space-x-4">
            <label htmlFor="entries-count" className="text-sm text-gray-700">Entries per page:</label>
            <select
              id="entries-count"
              value={entriesCount}
              onChange={(e) => setEntriesCount(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
 
          {/* Search Bar and Create Department Button - Same Row */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search Departments..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-72 bg-white"
              />
              {searchTerm && (
                <button className="absolute right-3 text-gray-500 hover:text-gray-700" onClick={() => setSearchTerm('')}>
                  <FaTimes />
                </button>
              )}
            </div>
 
            {/* Create Department Button */}
            <button
              className="flex items-center p-2 bg-gradient-to-r from-[#971A7E] to-[#E01950] text-white rounded hover:bg-[#1E1A4D] transition duration-300"
              onClick={() => setIsModalOpen(true)}
              style={{ height: '40px', minWidth: '150px' }}
            >
              <FaPlus className="mr-2" /> Create Department
            </button>
          </div>
        </div>
 
        {/* Table to display departments */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#27235C] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Department Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Department Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-red-500">{error}</td>
                </tr>
              ) : currentPageDepartments.length > 0 ? (
                currentPageDepartments.map((department, index) => (
                  <tr key={department.departmentId} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                    <td className="px-6 py-4 text-sm text-gray-800">{department.departmentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{department.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <button
                        onClick={() => handleEditClick(department)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No departments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
 
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
                        {/* Left side: Page count */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>
 
                        {/* Right side: Pagination buttons */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className={`p-2 bg-gray-200 rounded-l ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : ''}`}
                            >
                                <FaAngleDoubleLeft />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 bg-gray-200 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : ''}`}
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 bg-gray-200 ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : ''}`}
                            >
                                <FaChevronRight />
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className={`p-2 bg-gray-200 rounded-r ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : ''}`}
                            >
                                <FaAngleDoubleRight />
                            </button>
                        </div>
                    </div>
      </div>
 
      {/* Modal for Add Department */}
      {isModalOpen && <AdminAddDepartment isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
 
      {/* Modal for Edit Department */}
      {isEditModalOpen && (
        <AdminEditDepartment
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          department={editDepartmentData}
        />
      )}
    </div>
  );
};
 
export default AdminViewDepartment;