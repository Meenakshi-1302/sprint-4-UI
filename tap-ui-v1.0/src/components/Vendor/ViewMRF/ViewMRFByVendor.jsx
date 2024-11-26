import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VendorNavbar from '../../NavbarComponent/VendorNavbar';
import { FaSearch } from 'react-icons/fa';
import Modal from 'react-modal';
 
const preventContextMenu = (e) => {
    e.preventDefault();
};
const viewCandidates = (data) => {
    // Store MRF ID in session storage
    const mrfId = data.mrf.mrfId;
    sessionStorage.setItem('mrfId', mrfId);
    console.log(mrfId);
    // Redirect to view candidate page
    window.location.href = 'viewcandidatebymrf';
};
 
// Main Component
const ViewMRFByVendor = () => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMRF, setSelectedMRF] = useState(null);
    const vendorId = sessionStorage.getItem("vendorId");
 
    const columnDefs = [
        { headerName: "MRF ID", field: "mrf.mrfId", filter: true },
        { headerName: "Role", field: "mrf.probableDesignation", filter: true },
        { headerName: "Required Resources", field: "mrf.requiredResourceCount", filter: true },
       
 
 
        {
            headerName: "Job Description",
            field: "mrf.jobDescriptionId",
            cellRenderer: (params) => (
                <button
                    className="bg-[#27235C] text-white hover:bg-[#1F1A3D] transition duration-200 px-2 py-1 rounded text-sm"
                    onClick={() => window.open(`http://your-api-url/job-description/${params.value}`, '_blank')}
                >
                    Download
                </button>
            )
        },
        // {
        //     headerName: "View more details",
        //     cellRenderer: (params) => (
        //         <button
        //             className="bg-[#27235C] text-white hover:bg-[#1F1A3D] transition duration-200 px-2 py-1 rounded text-sm"
        //             onClick={() => viewMoreMRF(params.data)}
        //         >
        //             View more
        //         </button>
        //     )
        // },
 
        {
            headerName: "View more details",
            cellRenderer: (params) => (
                <button
                    className="bg-[#27235C] text-white hover:bg-[#1F1A3D] transition duration-200 px-2 py-1 rounded text-sm"
                    onClick={() => window.location.href = `/vendorDashboard/detailedmrf/${params.data.mrf.mrfId}`} // Navigate to MRF details page
                >
                    View more
                </button>
            )
        },
        {
            headerName: "Assigned Candidates",
            cellRenderer: (params) => (
                <button
                    className="bg-[#27235C] text-white hover:bg-[#1F1A3D] transition duration-200 px-2 py-1 rounded text-sm"
                    onClick={() => viewCandidates(params.data)}
                >
                    View Candidates
                </button>
            )
        }
    ];
 
    const viewMoreMRF = (data) => {
        setSelectedMRF(data);
        setIsOpen(true);
    };
 
    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedMRF(null);
    };
 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/vendors/allMrf/${vendorId}`);
                if (response.data) {
                    setRowData(response.data);
                    console.log(response.data);
                } else {
                    toast.error("MRF not found!");
                }
            } catch (error) {
                toast.error("Failed to fetch MRF data!");
            } finally {
                setLoading(false);
            }
        };
 
        fetchData();
    }, [vendorId]);
 
    const filterRowData = () => {
        if (!searchTerm) return rowData;
        return rowData.filter(row => {
            return Object.values(row.mrf).some(value =>
                String(value)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        });
    };
 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 -mt-8" onContextMenu={preventContextMenu}>
            <h1 className="text-3xl font-bold text-center text-[#27235C] mb-6">MRF Details</h1>
 
            {/* Search Bar */}
            <div className="flex items-center mb-6 w-full max-w-4xl">
                <div className="relative w-full">
                    <FaSearch className="absolute left-3 top-2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search MRFs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border bg-white rounded-full pl-10 py-2 shadow-md w-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
 
            {/* Ag-Grid Table */}
            {loading ? (
                <div className="flex justify-center">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="ag-theme-alpine w-full max-w-7xl h-96">
                    <AgGridReact
                        rowData={filterRowData()}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={10}
                        enableSorting={true}
                        domLayout='autoHeight'
                        suppressRowHoverHighlight={true}
                    />
                </div>
            )}
 
            <Modal
                isOpen={isOpen}
                onRequestClose={handleCloseModal}
                contentLabel="MRF Details Modal"
                className="fixed inset-0 flex items-start justify-center z-50 m-0 p-0" // Fullscreen modal
                overlayClassName="fixed inset-0 bg-black bg-opacity-70"
                style={{
                    content: {
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        padding: '0',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '0', // Make corners square
                    },
                }}
            >
                {selectedMRF && (
                    <div className="relative w-3/6 h-4/5 flex flex-col ml-20 mr-20 mt-20">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl transition duration-200"
                        >
                            &times; {/* Using &times; for an 'X' close button */}
                        </button>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">MRF Details</h2>
                        <div className="grid grid-cols-2 gap-4 p-4 h-full overflow-y-auto">
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">MRF ID:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfId}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Department:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfDepartmentName}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Technology:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfRequiredTechnology}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Designation:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.probableDesignation}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Required Resources:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.requiredResourceCount}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Skills:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.requiredSkills}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Employment Mode:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.employmentMode}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Education:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.educationalQualification}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Experience:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.yearsOfExperience}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Salary Range:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.minimumCTC} - {selectedMRF.mrf.mrfCriteria?.maximumCTC}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Contract Start:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.contractStartDate}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Closure:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.closureDate}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Location:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfCriteria?.jobLocation}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Filled Positions:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                {selectedMRF.mrf.mrfStatus?.requirementFilled}
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <span className="font-bold text-gray-700">Job Description:</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded shadow-sm select-none">
                                <a href={`http://your-api-url/job-description/${selectedMRF.mrf.jobDescriptionId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-200">Download</a>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
 
            <ToastContainer />
        </div>
    );
};
 
// Set app element for accessibility
Modal.setAppElement('#root');
 
export default ViewMRFByVendor;