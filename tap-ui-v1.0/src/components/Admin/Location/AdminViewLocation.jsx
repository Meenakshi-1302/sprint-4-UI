import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaTimes, FaEdit, FaChevronRight, FaChevronLeft, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import AdminAddLocation from './AdminAddLocation'; // For adding new locations
import AdminEditLocation from './AdminEditLocation'; // For editing locations
import { getLocations } from '../../../services/Admin/Location/LocationService'; // Add updateLocation for updating data
 
const AdminViewLocation = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLocationData, setEditLocationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesCount, setEntriesCount] = useState(5);
 
  useEffect(() => {
    const fetchAdminLocations = async () => {
      try {
        const locationData = await getLocations();
        setLocations(locationData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch locations');
        setLoading(false);
      }
    };
    fetchAdminLocations();
  }, []);
 
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const filteredLocations = locations.filter((location) =>
    location.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.locationAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const totalPages = Math.ceil(filteredLocations.length / entriesCount);
  const currentPageLocations = filteredLocations.slice(
    (currentPage - 1) * entriesCount,
    currentPage * entriesCount
  );
 
  const handleEditClick = (location) => {
    setEditLocationData(location);
    setIsEditModalOpen(true);
  };
 
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
 
  // New onSave function to handle saving updated location
  const handleSaveLocation = (updatedLocation) => {
    // You can now update your locations state or make an API call to save the data
    console.log('Location saved:', updatedLocation);
   
    // Optionally, update state or re-fetch locations
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc.locationId === updatedLocation.locationId ? updatedLocation : loc
      )
    );
   
    setIsEditModalOpen(false); // Close the edit modal after saving
  };
 
  return (
    <div className="bg-[#eeeeee] min-h-screen flex flex-col items-center py-8">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-900">Locations</h2>
 
          {/* Search Bar, Entries per Page Dropdown, and Create Button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
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
 
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <i className="absolute left-3 text-gray-500">
                  <FaSearch />
                </i>
                <input
                  type="text"
                  placeholder="Search Locations..."
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
 
              <button
                className="flex items-center p-2 bg-gradient-to-r from-[#971A7E] to-[#E01950] text-white rounded hover:bg-[#1E1A4D] transition duration-300"
                onClick={() => setIsModalOpen(true)}
                style={{ height: '40px', minWidth: '150px' }} // Adjusted button size
              >
                <FaPlus className="mr-2" /> Create Location
              </button>
            </div>
          </div>
 
          {/* Table to display locations */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-[#27235C] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Location Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Location Address</th>
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
                ) : currentPageLocations.length > 0 ? (
                  currentPageLocations.map((location, index) => (
                    <tr key={location.locationId} className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                      <td className="px-6 py-4 text-sm text-gray-800">{location.locationName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{location.locationAddress}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <button
                          onClick={() => handleEditClick(location)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No locations found</td>
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
        {/* </div> */}
          {/* Pagination UI code here... */}
        </div>
 
        {/* Modal for Add Location */}
        {isModalOpen && <AdminAddLocation isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
 
        {/* Modal for Edit Location */}
        {isEditModalOpen && (
          <AdminEditLocation
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            location={editLocationData}
            onSave={handleSaveLocation} // Pass the handleSaveLocation function here
          />
        )}
      </div>
    </div>
  );
};
 
export default AdminViewLocation;
 