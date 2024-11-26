import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import RecruitingManagerNavbar from "./RecruitingManagerNavbar";
import assignedrm from '../../assets/RecruitingManager/ViewMrfs/assignedrm.gif'
import pendingrm from '../../assets/RecruitingManager/ViewMrfs/pendingrm.gif';
import approvedrm from '../../assets/RecruitingManager/ViewMrfs/approvedrm.gif';
import rejectedrm from '../../assets/RecruitingManager/ViewMrfs/rejectedrm.gif';
import { getAllOfferByRm } from "../../services/RecruitingManager/OfferapprovalService";

const employeeId = sessionStorage.getItem("employeeId");

const Offerapproval = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ assigned: 0, pending: 0, approved: 0, rejected: 0 });
  const [rowData, setRowData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOfferId, setCurrentOfferId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchOption, setSearchOption] = useState("offerId"); // State for selected dropdown option
  const [currentPage, setCurrentPage] = useState(1); // Current page in pagination
  const rowsPerPage = 5; // Number of rows to display per page

  const rejectionReasons = [
    "Got Better Compensation Package Elsewhere",
    "Relocation Issues",
    "Long Commute",
    "Personal Reasons",
    "Disinterest in Job Role",
    "Shift or Work Schedule Conflicts"
  ];

  useEffect(() => {
    const fetchTableData = async (employeeId) => {
      try {
        const response = await getAllOfferByRm(employeeId);
        console.log(response.data);
        setRowData(response.data);
        setFilteredData(response.data); // Initialize filtered data
        updateCounts(response.data);
      } catch (error) {
        toast.error("Failed to fetch table data");
      }
    };

    fetchTableData(employeeId);
  }, []);

  const updateCounts = (newRowData) => {
    const assignedCount = newRowData.length;
    const pendingCount = newRowData.filter(row => row.status === "Pending" || row.status === null || row.status === "").length;
    const approvedCount = newRowData.filter(row => row.status === "Approved").length;
    const rejectedCount = newRowData.filter(row => row.status === "Rejected").length;

    setCounts({ assigned: assignedCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
  };

  const filterData = (status) => {
    if (status === "Assigned") {
      setFilteredData(rowData);
    } else if (status === "Pending") {
      setFilteredData(rowData.filter(row => row.status === "Pending" || row.status === null || row.status === ""));
    } else {
      setFilteredData(rowData.filter(row => row.status === status));
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderOfferLetter = (data, candidate) => {
    if (!data) return "No Document Available";

    const isBase64 = data.startsWith('JVBERi');
    const link = isBase64 ? `data:application/pdf;base64,${data}` : data;

    const openPDF = () => {
      if (isBase64) {
        const blob = new Blob([Uint8Array.from(atob(data), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        window.open(link, '_blank');
      }
    };

    return (
      <div>
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'black', textDecoration: 'underline' }} onClick={openPDF}>
          {candidate.firstName} {candidate.lastName}. Offer Letter
        </a>
        <span className="ml-2">
          <FontAwesomeIcon icon={faEye} onClick={openPDF} style={{ cursor: 'pointer', padding: '0 5px' }} />
        </span>
      </div>
    );
  };

  const renderResume = (data, candidate) => {
    if (!data) return "No Document Available";
    
    const isBase64 = data.startsWith('JVBERi');
    const link = isBase64 ? `data:application/pdf;base64,${data}` : data;

    const openPDF = () => {
      if (isBase64) {
        const blob = new Blob([Uint8Array.from(atob(data), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank'); // Open PDF in new tab
      } else {
        window.open(link, '_blank'); // Open PDF directly in a new tab
      }
    };
    
    return (
      <span style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }} onClick={openPDF}>
        {candidate.firstName} {candidate.lastName}'s Resume
      </span>
    );
  };

  const renderActionButtons = (offerApproval) => {
    if (offerApproval.status === "Approved" || offerApproval.status === "Rejected") {
      return null;
    }

    const offerId = offerApproval.offer.offerId; // Cache the offer ID

    return (
      <div className="relative">
        <button
          onClick={() => handleApprove(offerApproval)}
          className="bg-[#23275c] text-white p-2 rounded-xl mr-2"
        >
          Accept
        </button>
        <button
          onClick={() => {
            setCurrentOfferId(offerId); // Store the offer ID
            setSelectedReason(""); // Reset selected reason
            setModalOpen(true); // Open the rejection modal
          }}
          className="bg-[#23275c] text-white p-2 rounded-xl"
        >
          Reject
        </button>
      </div>
    );
  };

  const handleApprove = async (offerApproval) => {
    try {
      offerApproval.status = "Approved";
      await axios.put("http://localhost:8080/tap/updateOfferApprovalStatus", offerApproval);

      const newRowData = rowData.map((row) =>
        row.offer.offerId === offerApproval.offer.offerId ? { ...row, status: "Approved" } : row
      );

      setRowData(newRowData);
      updateCounts(newRowData);
      toast.success("Offer accepted successfully.");
    } catch (error) {
      toast.error("Failed to update approval status.");
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedReason) {
      toast.error("Please select a reason for rejection.");
      return;
    }

    const offerApproval = rowData.find(row => row.offer.offerId === currentOfferId);
    offerApproval.reason = selectedReason;
    offerApproval.status = "Rejected";
    
    try {
      await axios.put("http://localhost:8080/tap/updateOfferApprovalStatus", offerApproval);

      const newRowData = rowData.map((row) =>
        row.offer.offerId === currentOfferId ? { ...row, status: "Rejected", reason: selectedReason } : row
      );

      setRowData(newRowData);
      updateCounts(newRowData);
      setSelectedReason("");
      toast.success("Offer rejected successfully.");
      setModalOpen(false); // Close the modal after successful submission
    } catch (error) {
      toast.error("Failed to update rejection status.");
    }
  };

  const openCandidateModal = async (candidate) => {
    const response = await axios.get(`http://localhost:8080/tap/getAllOffersByRMId/${employeeId}`);
    const candidates = response.data;
    const foundCandidate = candidates.find(item => item.offer.candidate.candidate === candidate.candidate);
    setSelectedCandidate(foundCandidate || candidate);
    setCandidateModalOpen(true);
  };

  // Handler for search input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterSearchResults(event.target.value);
  };

  // Filter search results based on search option
  const filterSearchResults = (query) => {
    if (query === "") {
      setFilteredData(rowData);
    } else {
      const filtered = rowData.filter((row) => {
        if (searchOption === "offerId") {
          return row.offer.offerId.toString().includes(query);
        } else if (searchOption === "mrfId") {
          return row.offer.mrf.mrfId.toString().includes(query);
        } else if (searchOption === "candidate") {
          const candidateName = `${row.offer.candidate.firstName} ${row.offer.candidate.lastName}`.toLowerCase();
          return candidateName.includes(query.toLowerCase());
        }
        return false;
      });
      setFilteredData(filtered);
    }
  };

  // Calculate the indexes for pagination
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentRows = filteredData.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <>
      {candidateModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-4 rounded shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-semibold">Candidate Details</h2>
            <hr className="my-2 border-gray-400" />
            <p>Name: {selectedCandidate.offer.candidate.firstName} {selectedCandidate.offer.candidate.lastName}</p>
            <p>Email: {selectedCandidate.offer.candidate.email}</p>
            <p>Experience: {selectedCandidate.offer.candidate.experience}</p>
            <p>Resume: {selectedCandidate.offer.candidate.candidateResume && (
              <span> {renderResume(selectedCandidate.offer.candidate.candidateResume, selectedCandidate.offer.candidate)} </span>
            )}</p>

            <button
              className="mt-4 bg-[#23275c] text-white p-2 rounded"
              onClick={() => setCandidateModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <RecruitingManagerNavbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`min-h-screen bg-gray-200 p-4 flex flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>
        <div className={`mt-20 mb-5 flex justify-between items-center ${modalOpen ? 'blur-md' : ''}`}>
          <h2 className="text-2xl font-semibold text-center md:text-left">Offer Approval Dashboard</h2>
        </div>

        {/* Rejection Reasons Modal Card */}
        {modalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-10">
            <div className="bg-white p-4 rounded shadow-md w-11/12 md:w-1/3">
              <h4 className="text-sm font-semibold mb-2">Select a reason for rejection:</h4>
              {rejectionReasons.map((reasonOption, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedReason(reasonOption)}
                  className={`block p-2 w-full text-left hover:bg-gray-100 ${selectedReason === reasonOption ? 'bg-gray-500 text-white' : ''}`}
                >
                  {reasonOption}
                </button>
              ))}
              <button onClick={handleRejectSubmit} className="bg-[#23275c] text-white p-2 rounded-md w-full mt-2">
                Submit
              </button>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ${modalOpen ? 'blur-md' : ''}`}>
          <div 
            className="bg-white p-4 rounded shadow cursor-pointer" 
            onClick={() => filterData("Assigned")}
          >
            <div className="flex items-center">
              <div className="w-12 h-10 rounded-full bg-white-500 flex items-center justify-center mr-2 overflow-hidden">
                <img src={assignedrm} alt="Requirements Posted" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-2xl font-semibold">Assigned</h3>
            </div>
            <h2 className="text-4xl text-center">{counts.assigned}</h2>
          </div>
          <div 
            className="bg-white p-4 rounded shadow cursor-pointer" 
            onClick={() => filterData("Pending")}
          >
            <div className="flex items-center">
              <div className="w-12 h-10 rounded-full bg-white-500 flex items-center justify-center mr-2 overflow-hidden">
                <img src={pendingrm} alt="Requirements Posted" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-2xl font-semibold">Pending</h3>
            </div>
            <p className="text-4xl text-center">{counts.pending}</p>
          </div>
          <div 
            className="bg-white p-4 rounded shadow cursor-pointer" 
            onClick={() => filterData("Approved")}
          >
            <div className="flex items-center">
              <div className="w-12 h-10 rounded-full bg-white-500 flex items-center justify-center mr-2 overflow-hidden">
                <img src={approvedrm} alt="Requirements Posted" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-2xl font-semibold">Approved</h3>
            </div>
            <p className="text-4xl text-center">{counts.approved}</p>
          </div>
          <div 
            className="bg-white p-4 rounded shadow cursor-pointer" 
            onClick={() => filterData("Rejected")}
          >
            <div className="flex items-center">
              <div className="w-12 h-10 rounded-full bg-white-500 flex items-center justify-center mr-2 overflow-hidden">
                <img src={rejectedrm} alt="Requirements Posted" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-2xl font-semibold">Rejected</h3>
            </div>
            <p className="text-4xl text-center">{counts.rejected}</p>
          </div>
        </div>

        <div className={`my-5 overflow-x-auto ${modalOpen ? 'blur-md' : ''}`}>
          <table className="min-w-full bg-white ">
            <thead style={{ backgroundColor: "#23275c" }}>
              <tr>
                <th className="py-2 px-4 border text-white">Offer Id</th>
                <th className="py-2 px-4 border text-white">Mrf Id</th>
                <th className="py-2 px-4 border text-white">Candidate</th>
                <th className="py-2 px-4 border text-white">Offer Letter</th>
                <th className="py-2 px-4 border text-white">Offer Package<p className="text-sm font-thin text-white">(*LPA)</p></th>
                <th className="py-2 px-4 border text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.offer.offerId} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border"><p className="text-sm inline">#OFF</p>{row.offer.offerId}</td>
                  <td className="py-2 px-4 border"><p className="text-sm inline">#MRF</p>{row.offer.mrf.mrfId}</td>
                  <td className="py-2 px-4 border">
                    {row.offer.candidate.firstName} {row.offer.candidate.lastName}
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      style={{ marginLeft: '5px', cursor: 'pointer' }}
                      onClick={() => openCandidateModal(row.offer.candidate)}
                    />
                  </td>
                  <td className="py-2 px-4 border">{renderOfferLetter(row.offer.offerLetter, row.offer.candidate)}</td>
                  <td className="py-2 px-4 border">{row.offer.offerPackage}</td>

                  <td className="py-2 px-4 border">
                    {renderActionButtons(row)}
                    {row.status === "Rejected" && (
                      <p className="text-red-500 mt-2">Rejected: {row.reason}</p>
                    )}
                    {row.status === "Approved" && (
                      <p className="text-green-500 mt-2">Accepted</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            className="bg-gray-500 text-white p-2 rounded-md"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
            className="bg-gray-500 text-white p-2 rounded-md"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Offerapproval;