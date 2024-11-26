import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch, FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaAngleDoubleRight } from 'react-icons/fa';
import { AiOutlineCompass } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const getMRFStatus = (status) => {
  const statusMap = {
    Applied: 'Applied',
    Screened: 'Screened',
    Completed: 'Completed',
    'Document Verified': 'Document Verified',
    Selected: 'Selected',
    Rejected: 'Rejected',
    'On Hold': 'On Hold',
    Joined: 'Joined',
  };
  return statusMap[status] || 'Unknown';
};

const isExperienceInRange = (experience, range) => {
  const exp = Number(experience);
  switch (range) {
    case '0-5':
      return exp >= 0 && exp <= 5;
    case '5-10':
      return exp >= 5 && exp <= 10;
    case '10-15':
      return exp >= 10 && exp <= 15;
    case '15-Above':
      return exp > 15;
    default:
      return true;
  }
};

const CandidateList = () => {
  const MRFId = sessionStorage.getItem('mrfid') || '';
  const [candidates, setCandidates] = useState([]);
  const [recruitmentProcessLevels, setRecruitmentProcessLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesCount, setEntriesCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [experienceRange, setExperienceRange] = useState('');
  const [isLevelsVisible, setIsLevelsVisible] = useState(false);
  const [isCandidatesVisible, setIsCandidatesVisible] = useState(false);
  const [activeLevelId, setActiveLevelId] = useState(null); // new state for active level

  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, [MRFId]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/tap/getCandidateByMrfId/${MRFId}`);
      setCandidates(response.data);
    } catch (err) {
      setError('Error fetching candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruitmentProcess = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/tap/getRecruitmentProcessLevels/${MRFId}`);
      if (response.data) {
        setRecruitmentProcessLevels(response.data);
      }
    } catch (error) {
      console.error("Error fetching recruitment process:", error);
    }
  };

  const handleRecruitmentProcessClick = () => {
    if (isLevelsVisible) {
      fetchCandidates();
      setRecruitmentProcessLevels([]);
    } else {
      fetchRecruitmentProcess();
    }
    setIsLevelsVisible(!isLevelsVisible);
  };

  const fetchCandidatesByLevel = async (level) => {
    try {
      const { recruitmentProcessId, recruitmentProcessType } = level;
      let response;
      if (recruitmentProcessType === "Assessment") {
        response = await axios.get(`http://localhost:8080/tap/getCandidateByRpId/${recruitmentProcessId}`);
      } else if (recruitmentProcessType === "Interview") {
        response = await axios.get(`http://localhost:8080/tap/getCandidatesByRecruitmentProcessId/${recruitmentProcessId}`);
      }
      if (response.data) {
        setCandidates(response.data);
        console.log(response.data);
      }
      setIsCandidatesVisible(true);
      setActiveLevelId(recruitmentProcessId); 
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const experienceMatch = experienceRange ? isExperienceInRange(candidate.experience, experienceRange) : true;

    return (
      (candidate.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.mobileNumber?.includes(searchTerm) ||
      candidate.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skill?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getMRFStatus(candidate.status)?.toLowerCase().includes(searchTerm.toLowerCase())) && 
      experienceMatch
    );
  });

  const totalPages = Math.ceil(filteredCandidates.length / entriesCount);
  const currentPageCandidates = filteredCandidates.slice((currentPage - 1) * entriesCount, currentPage * entriesCount);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleEyeClick = (candidateId) => {
    navigate(`/candidateInfo/${candidateId}`);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="w-full p-14 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-4 text-blue-900">CANDIDATE LIST</h2>

      <div className="flex justify-center mb-4">
        <button 
          className="bg-blue-950 text-white py-2 px-4 rounded hover:bg-blue-900 transition duration-300" 
          onClick={handleRecruitmentProcessClick}
        >
          {isLevelsVisible ? "Hide Recruitment Process" : "Show Recruitment Process"}
        </button>
      </div>

      {isLevelsVisible && (
        <div className="flex justify-center mt-4 space-x-2">
          {recruitmentProcessLevels.map((level) => (
            <button 
              key={level.recruitmentProcessId} 
              className={`py-1 px-3 rounded transition duration-300 ${activeLevelId === level.recruitmentProcessId ? "bg-green-500 text-white" : "bg-green-300 text-gray-800 hover:bg-green-400"}`}
              onClick={() => fetchCandidatesByLevel(level)}
            >
              Level {level.level}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex items-center relative mt-2">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Candidates..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-72 mr-3" 
          />
          <select 
            id="experience-range" 
            value={experienceRange} 
            onChange={(e) => setExperienceRange(e.target.value)} 
            className="pl-10 text-gray-400 pr-4 py-2 border border-gray-300 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 bg-white w-72 mr-3"
          >
            <option value="">Search By Experience</option>
            <option value="0-5">0-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10-15">10-15 years</option>
            <option value="15-Above">15 and Above</option>
          </select>
        </div>
      </div>

      {/* Table to display the candidates */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-[#27235C] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">S.No</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Candidate Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Candidate Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Mobile Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Experience</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Skill</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Track Candidate</th>
            </tr>
          </thead>
          <tbody>
            {currentPageCandidates.length > 0 ? (
              currentPageCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-100 transition duration-300">
                  <td className="px-6 py-4 text-sm text-gray-800">{(currentPage - 1) * entriesCount + index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{candidate.firstName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{candidate.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{candidate.mobileNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{candidate.experience} Years</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{candidate.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{candidate.skill}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <span className="flex items-center cursor-pointer text-blue-600" onClick={() => handleEyeClick(candidate.candidateId)}>
                      <AiOutlineCompass className="ml-1" /> Track 
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No candidates found.
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

export default CandidateList;