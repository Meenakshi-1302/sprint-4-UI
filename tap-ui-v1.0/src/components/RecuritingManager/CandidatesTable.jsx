import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecruitingManagerNavbar from './RecruitingManagerNavbar';
import candidaterm from '../../assets/RecruitingManager/ViewMrfs/candidaterm.gif'
import { getCandidatesAddedByRecruitingManager } from '../../services/RecruitingManager/CandidateService';

const CandidateGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  // Skills, statuses, and experience options
  const skillsOptions = ["Java", "Python", "JavaScript", "React", "Node.js", "SQL", "NoSQL"];
  const statusOptions = [
    "ResumeAdded",
    "Candidate Added",
    "Screen Reject(Recruiter)",
    "Screen Reject(Client)",
    "Yet to Schedule(Client)",
    "Yet to Schedule(Internal)",
    "L1 Scheduled",
    "L2 Scheduled",
    "L2 Select(Client)",
    "L2 Reject(Client)",
    "L1 Select(Client)",
    "L1 Reject(Client)",
    "Internal L1 Reject",
    "Internal L2 Reject",
    "Waiting Managerial / HR Discussion",
    "Managerial / HR Selected",
    "Managerial / HR Reject",
    "Selected",
    "Yet to Offer",
    "Offered",
    "Yet to join / Offer Accepted",
    "Joined",
    "Declined",
    "Hold",
    "Duplicate"
  ];
  const experienceOptions = [
    "0-2",
    "2-5",
    "3-6",
    "6-10",
    "Above 10"
  ];

  const sourceId = sessionStorage.getItem('employeeId');
 
  useEffect(() => {
 
    const fetchCandidates=async(sourceId)=>{
      try{
        const response = await getCandidatesAddedByRecruitingManager(sourceId);
        const sortedData = response.data.sort((a,b)=>b.candidateId - a.candidateId);
        setRowData(response.data);
        setFilteredData(response.data);
 
      }
      catch(error){
        console.error('Error fetching data:', error);
      }
     
    }
    fetchCandidates(sourceId);  
  }, []);

  useEffect(() => {
    setFilteredData(
      rowData.filter(candidate =>
        (candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.candidateId.toString().includes(searchTerm)) &&
        (selectedSkill ? candidate.skill.split(',').map(skill => skill.trim()).includes(selectedSkill.toLowerCase()) : true) &&
        (selectedStatus ? candidate.status === selectedStatus : true) &&
        (selectedExperience ? filterByExperience(candidate.experience, selectedExperience) : true)
      )
    );
  }, [searchTerm, rowData, selectedSkill, selectedStatus, selectedExperience]);

  const filterByExperience = (experience, selectedExperience) => {
    const experienceNum = parseInt(experience, 10);
    switch (selectedExperience) {
      case "0-2":
        return experienceNum >= 0 && experienceNum <= 2;
      case "2-5":
        return experienceNum > 2 && experienceNum <= 5;
      case "3-6":
        return experienceNum > 3 && experienceNum <= 6;
      case "6-10":
        return experienceNum > 6 && experienceNum <= 10;
      case "Above 10":
        return experienceNum > 10;
      default:
        return true;
    }
  };

  const renderResume = (data) => {
    if (!data) return "No Document Available";

    const isBase64 = data.startsWith('JVBERi'); // Check if the data is a base64 string
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
      < button onClick={openPDF} className="text-indigo-600 hover:text-indigo-900">
        View Resume
      </button>
    );
  };

  // Pagination logic
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredData.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredData.length / candidatesPerPage);

  return (
    <>
      <RecruitingManagerNavbar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className={`min-h-screen bg-gray-200 p-4 flex flex-col ${sidebarOpen ? 'ml-64' : ' ml-16'} transition-all duration-300 ease-in-out`}>
        <div className="container mx-auto p-4">
          <div className="flex justify-between mb-4 mt-14">
            <h2 className="text-2xl font-bold">Candidates List</h2>
            <Link to="/candidateform">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                Add Candidate
              </button>
            </Link>
          </div>

          {/* Candidates Count Card with Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col">
            {/* <h3 className="text-lg font-bold mb-2">Total Candidates: {filteredData.length}</h3> */}
            <div className="flex items-center"> {/* Adjusted this line to ensure alignment */}
              <div className="w-12 h-10 rounded-full bg-white-500 flex items-center justify-center mr-2 overflow-hidden">
                <img src={candidaterm} alt="Requirements Posted" className="object-cover w-full h-full" />
              </div>
              <h3 className="text-lg font-bold mb-2">Total Candidates: {filteredData.length}</h3> {/* Text should align right of the GIF */}
            </div>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search by ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg p-2 w-1/3"
              />
              <div className="flex space-x-4">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="">All Skills</option>
                  {skillsOptions.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="">All Experience Levels</option>
                  {experienceOptions.map(experience => (
                    <option key={experience} value={experience}>{experience}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tailwind CSS Table */}
          <div className="overflow-x-auto mt-6 border rounded-xl">
            <table className="min-w-full bg-white divide-y divide-gray-200 border rounded-lg ">
              <thead className="bg-[#23275c]">
                <tr>
                  {["Candidate ID", "First Name", "Last Name", "Mobile Number", "Email", "Experience (In Years)", "Skills", "Candidate Status", "Resume"].map(header => (
                    <th key={header} className="px-10 py-3 text-left text-xs font-large text-white uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCandidates.map(candidate => (
                  <tr key={candidate.candidateId}>
                    <td className="px-8 py-4 whitespace-nowrap text-md text-black">{candidate.candidateId}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-md text-black">{candidate.firstName}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-md text-black">{candidate.lastName}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-md text-black">{candidate.mobileNumber}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-md text-black">{candidate.email}</td>
                    <td className="px-8 py-4 whitespace-nowrap text-md text-black">{candidate.experience}</td>
                    <td 
                    className="px-12 py-4 whitespace-nowrap text-md text-black">{candidate.skill}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-black">{candidate.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-md text-black">
                      {renderResume(candidate.candidateResume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className ="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateGrid;