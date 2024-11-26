import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaEdit, FaChevronRight, FaChevronLeft, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import AddBussinessUnit from './AdminAddBussinessUnit';
import AdminEditBusinessUnit from './AdminEditBussinessUnit'; // Import the Edit modal component
import { getBussinessUnits } from '../../../services/Admin/BussinessUnit/AdminBusinessUnitService';
 
const AdminViewBussinessUnit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for the edit modal
  const [searchTerm, setSearchTerm] = useState('');
  const [businessUnits, setBusinessUnits] = useState([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState(null); // State to hold the selected business unit for editing
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesCount, setEntriesCount] = useState(5); // Number of entries per page
 
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        const units = await getBussinessUnits();
        setBusinessUnits(units);
      } catch (error) {
        console.error('Error fetching Business Units:', error);
      }
    };
 
    fetchBusinessUnits();
  }, []);
 
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const filteredBusinessUnits = businessUnits.filter((unit) =>
    unit.businessUnitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.businessUnitLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const totalPages = Math.ceil(filteredBusinessUnits.length / entriesCount);
  const currentPageBusinessUnits = filteredBusinessUnits.slice(
    (currentPage - 1) * entriesCount,
    currentPage * entriesCount
  );
 
  // Handle opening the edit modal
  const handleEditClick = (unit) => {
    setSelectedBusinessUnit(unit); // Set the selected business unit
    setIsEditModalOpen(true); // Open the edit modal
  };
 
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
 
  return (
    <div className="bg-[#eeeeee] min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#27235C]">Business Units</h2>
 
          {/* Search Bar and Create Button */}
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
                placeholder="Search Business unit..."
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
              <FaPlus className="mr-2" /> Create Business unit
            </button>
          </div>
        </div>
 
          {/* Table to display business units */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#27235C] text-white text-left">
                  <th className="py-3 px-4">Business Unit Name</th>
                  <th className="py-3 px-4">Business Unit Description</th>
                  <th className="py-3 px-4">Business Unit Location</th>
                  <th className="py-3 px-4">Actions</th> {/* Add Actions column */}
                </tr>
              </thead>
              <tbody>
                {currentPageBusinessUnits.length > 0 ? (
                  currentPageBusinessUnits.map((unit, index) => (
                    <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                      <td className="py-3 px-4">{unit.businessUnitName}</td>
                      <td className="py-3 px-4">{unit.description || 'No Description Available'}</td>
                      <td className="py-3 px-4">{unit.businessUnitLocation}</td>
                      <td className="py-3 px-4 text-center">
                        {/* Edit Icon for each unit */}
                        <button
                          onClick={() => handleEditClick(unit)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-center text-gray-500">No business units found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
         
          {/* Pagination Controls */}
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
 
        {/* Modal for AddBusinessUnit */}
        {isModalOpen && <AddBussinessUnit isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
 
        {/* Modal for Edit Business Unit */}
        {isEditModalOpen && (
          <AdminEditBusinessUnit
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            businessUnit={selectedBusinessUnit} // Pass selected business unit to edit modal
          />
        )}
      </div>
    </div>
  );
};
 
export default AdminViewBussinessUnit;

