// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { AgGridReact } from 'ag-grid-react';
// import { useNavigate } from 'react-router-dom';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// function MRFList() {
//     const [mrfList, setMrfList] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchMRFs = async () => {
//             const employeeId = sessionStorage.getItem('employeeId');
//             try {
//                 const response = await axios.get(`http://localhost:8080/tap/api/mrfassignedtorecruiter/${employeeId}`);
//                 setMrfList(response.data);
//             } catch (err) {
//                 setError('Error fetching MRFs');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMRFs();
//     }, []);

//     if (loading) return <div className="text-center py-4">Loading...</div>;
//     if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

//     // Filter MRF List based on search term
//     const filteredMRFs = mrfList.filter(mrf =>
//         mrf.mrfId.toString().includes(searchTerm) ||
//         mrf.mrfDepartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         mrf.probableDesignation.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const columnDefs = [
//         { headerName: "S.No", valueGetter: "node.rowIndex + 1", sortable: true, filter: false },
//         { headerName: "MRF ID", field: "mrfId", sortable: true, filter: true },
//         { headerName: "Department Name", field: "mrfDepartmentName", sortable: true, filter: true },
//         { headerName: "Probable Designation", field: "probableDesignation", sortable: true, filter: true },
//         { headerName: "Required Technology", field: "mrfRequiredTechnology", sortable: true, filter: true },
//             { headerName: "Created At", field: "createdAt", sortable: true, filter: true },
//         { headerName: "Required Resource Count", field: "requiredResourceCount", sortable: true, filter: true }
//     ];

//     const rowClickHandler = (event) => {
//         sessionStorage.setItem('mrfid', event.data.mrfId);
//         navigate(`/mrfDashboard/${event.data.mrfId}`);
//     };

//     return (
//         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
//             <h2 className="text-gray-700 font-semibold mb-4">MRF List</h2>

//             {/* Search Box */}
//             <input
//                 type="text"
//                 placeholder="Search by MRF ID, Department, or Designation"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="mb-4 p-2 border border-gray-300 rounded"
//             />

//             {/* AG Grid */}
//             <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
//                 <AgGridReact
//                     rowData={filteredMRFs}
//                     columnDefs={columnDefs}
//                     onRowClicked={rowClickHandler}
//                     pagination={true} // Optional: Enable pagination
//                     paginationPageSize={10} // Optional: Set pagination page size
//                     filter={true} // Optional: Enable global filtering
//                 />
//             </div>
//         </div>
//     );
// }

// export default MRFList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
 
function MRFList() {
    const [mrfList, setMrfList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesCount, setEntriesCount] = useState(10);
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchMRFs = async () => {
            const employeeId = sessionStorage.getItem('employeeId');
            try {
                const response = await axios.get(`http://localhost:8080/tap/api/mrfassignedtorecruiter/${employeeId}`);
                setMrfList(response.data);
            } catch (err) {
                setError('Error fetching MRFs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
 
        fetchMRFs();
    }, []);
 
    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
 
    // Filter MRF List based on search term
    const filteredMRFs = mrfList.filter(mrf =>
        mrf.mrfId.toString().includes(searchTerm) ||
        mrf.mrfDepartmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mrf.probableDesignation.toLowerCase().includes(searchTerm.toLowerCase())
    );
 
    // Pagination setup
    const totalPages = Math.ceil(filteredMRFs.length / entriesCount);
    const currentPageMRFs = filteredMRFs.slice((currentPage - 1) * entriesCount, currentPage * entriesCount);
 
    const rowClickHandler = (mrfId) => {
        sessionStorage.setItem('mrfid', mrfId);
        navigate(`/mrfDashboard/${mrfId}`);
    };
 
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
 
    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-gray-700 font-semibold mb-4 text-center">MRF LIST</h2>
 
            {/* Search Box */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center relative">
                    <FaSearch className="absolute left-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by MRF ID, Department, or Designation"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-72"
                    />
                </div>
            </div>
 
            {/* Table to display the MRFs */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-[#27235C] text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">S.No</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">MRF ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Department Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Probable Designation</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Required Technology</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Required Resource Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageMRFs.length > 0 ? (
                            currentPageMRFs.map((mrf, index) => (
                                <tr key={mrf.mrfId} className="border-b hover:bg-gray-100 transition duration-300 cursor-pointer" onClick={() => rowClickHandler(mrf.mrfId)}>
                                    <td className="px-6 py-4 text-sm text-gray-800">{(currentPage - 1) * entriesCount + index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{mrf.mrfId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{mrf.mrfDepartmentName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{mrf.probableDesignation}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{mrf.mrfRequiredTechnology}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{mrf.createdAt}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{mrf.requiredResourceCount}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No MRFs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
 
            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                </div>
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
                <div className="flex items-center space-x-2">
                    <label htmlFor="entries-count" className="text-md text-gray-400 mr-2">Entries per page:</label>
                    <select
                        id="entries-count"
                        value={entriesCount}
                        onChange={(e) => setEntriesCount(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
 
export default MRFList;
