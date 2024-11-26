import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminRoles } from '../../../redux/actions/Admin/Role/AdminRoleActions';
import {   FaSearch,FaPlus,FaEdit, FaChevronRight, FaChevronLeft, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';  // Import icons for pagination
import AdminAddRole from './AdminAddRole';  // Import your AdminAddRole modal
import AdminEditRole from './AdminEditRole'; // Import AdminEditRole modal for editing
 
const AdminViewRole = ({ sidebarOpen }) => {
    const dispatch = useDispatch();
    const roles = useSelector((state) => state.adminRoles.roles);
 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // State for Add Role modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // State for Edit Role modal
    const [roleSearchTerm, setRoleSearchTerm] = useState('');
    const [editingRoleId, setEditingRoleId] = useState(null);  // Store the roleId to be edited
 
    const [currentPage, setCurrentPage] = useState(1);  // State for the current page
    const [entriesCount, setEntriesCount] = useState(5);  // Roles per page
 
    useEffect(() => {
        dispatch(fetchAdminRoles());
    }, [dispatch]);
 
    const handleRoleSearchChange = (e) => {
        setRoleSearchTerm(e.target.value);
    };
 
    // Filter roles based on search term
    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(roleSearchTerm.toLowerCase())
    );
 
    // Pagination logic
    const totalPages = Math.ceil(filteredRoles.length / entriesCount);
    const currentPageRoles = filteredRoles.slice(
        (currentPage - 1) * entriesCount,
        currentPage * entriesCount
    );
 
    // Handle edit role
    const handleEditRole = (roleId) => {
        setEditingRoleId(roleId);
        setIsEditModalOpen(true); // Open the modal for editing
    };
 
    // Handle pagination change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
 
    return (
        <div className="bg-[#eeeeee] min-h-screen flex flex-col items-center py-8">
        <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl">
                <div className="p-6 ">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-blue-900">Roles</h2>
 
                    {/* Top row for Entries per page dropdown on the left and Search bar & Add Role button on the right */}
                    <div className="flex justify-between items-center mb-6">
                        {/* Left section for Entries per page */}
                        <div className="flex items-center space-x-2">
                            <label htmlFor="entries-count" className="text-sm text-gray-700">
                                Entries per page:
                            </label>
                            <select
                                id="entries-count"
                                value={entriesCount}
                                onChange={(e) => setEntriesCount(Number(e.target.value))}
                                className="p-2 ml-2 border border-gray-300 rounded"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
 
                        {/* Right section for Search bar and Add Role button */}
                        <div className="flex items-center space-x-4">
                        <div className="relative flex items-center">
                        <FaSearch className="absolute left-3 text-gray-500" />
                            {/* Search bar */}
                            <input
                                type="text"
                                placeholder="Search Roles..."
                                value={roleSearchTerm}
                                onChange={handleRoleSearchChange}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-72 bg-white"
                               
                            />
 </div>
                            {/* Add Role button */}
                            <button
                                className="flex items-center p-2 text-white rounded"
                                style={{
                                    background: 'linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))',
                                }}
                                onClick={() => setIsAddModalOpen(true)}  // Open Add Role modal
                            >
                                 <FaPlus className="mr-2" /> Add Role
                            </button>
                        </div>
                    </div>
 
                    {/* Table to display the roles */}
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                        <table className="min-w-full table-auto border-collapse">
                            <thead className="bg-[#27235C] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Role ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Role Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Role Description</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageRoles.length > 0 ? (
                                    currentPageRoles.map((role) => (
                                        <tr
                                            key={role.roleId}
                                            className="border-b hover:bg-gray-100 transition duration-300"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-800">{role.roleId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{role.roleName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{role.roleDescription}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {role.department ? role.department.departmentName : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                <button
                                                    onClick={() => handleEditRole(role.roleId)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <FaEdit />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No roles found.
                                        </td>
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
 
                {/* Pass the roleId to AdminEditRole to fetch data */}
                <AdminAddRole
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />
 
                <AdminEditRole
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    roleId={editingRoleId}  // Pass roleId for editing
                />
            </div>
        </div>
    );
};
 
export default AdminViewRole;