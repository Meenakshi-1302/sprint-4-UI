import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaSearch } from 'react-icons/fa';
import VendorNavbar from '../../NavbarComponent/VendorNavbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getVendorAddedCandidatesDataByMRF } from '../../../services/Vendor/VendorCandidateView';

const ViewCandidateByMRF = () => {
  const [candidatesData, setCandidatesData] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const vendorId = sessionStorage.getItem("vendorId");
  const mrfId = sessionStorage.getItem("mrfId");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVendorAddedCandidatesDataByMRF(vendorId,mrfId);
        setCandidatesData(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching the candidates data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { headerName: 'Candidate ID', field: 'candidateId', filter: true, flex: 1, minWidth: 100 },
    { headerName: 'Name', field: 'firstName', filter: true, flex: 1, minWidth: 200 },
    { headerName: 'Location', field: 'location', filter: true, flex: 1, minWidth: 250 },
    { headerName: 'Skills', field: 'skill', filter: true, flex: 1, minWidth: 200 },
    { headerName: 'Status', field: 'status', filter: true, flex: 1, minWidth: 200 },
  ];

  const closeModal = () => {
    setSelectedCandidate(null);
  };

  // Function to filter the row data based on search term
  const filterCandidates = (data) => {
    if (!searchTerm) return data;
    return data.filter(candidate => {
      return (
        candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  return (
    <div className="flex flex-col items-center mx-auto p-1 mt-10">

      {/* Search Bar */}
      <b><h1 className='text-3xl pb-4'>View All Candidates</h1></b>
      <div className="flex items-center mb-6 w-full max-w-4xl">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-3 text-gray-500 items-center" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-full pl-10 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Candidate Button */}
        {/* <button
          onClick={() => navigate('addcandidatebyvendor')} // Implement navigation
          className="ml-4 bg-[#27235C] text-white rounded-full px-4 py-2 hover:bg-[#393389] transition duration-200">
          Add Candidate
        </button> */}
        <button
          onClick={() => navigate('/vendorDashboard/addcandidatebyvendor')} // Use absolute path
          className="ml-4  bg-[#27235C] text-white rounded-md px-6 hover:bg-[#605ba0] transition duration-200">
          Add Candidate
        </button>
      </div>

      {/* Ag-Grid Table */}
      <div className="ag-theme-alpine w-full max-w-full h-96"> {/* Set max-w-full for full width */}
        <AgGridReact
          rowData={filterCandidates(candidatesData)}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          enableSorting={true}
          domLayout='autoHeight'
          suppressRowHoverHighlight={true}
          style={{ minWidth: '1200px' }} 
        />
      </div>
    </div>
  );
};

export default ViewCandidateByMRF;