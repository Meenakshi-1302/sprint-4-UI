import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateNavbar from "./CandidateNavbar";
import { getAppliedJobsCount, getAssessmentCount, getInterviewCount, getAppliedJobs } from "../../../services/Candidate/CandidateDashboardService";
import interviewlogo from '../../../assets/CandidateDashboard/interview.png';
import appliedlogo from '../../../assets/CandidateDashboard/apply.png';
import assessmentlogo from '../../../assets/CandidateDashboard/assessment.png';
 
function CandidateDashboard() {
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [totalAppliedJobs, setTotalAppliedJobs] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
 
  const candidateId = sessionStorage.getItem("vendorId");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    experience: '',
    skill: '',
    location: '',
    candidateProfileImage: null,
  });
 
  useEffect(() => {
    const generateWelcomeMsg = () => {
      const now = new Date().getHours();
      if (now >= 5 && now < 12) {
        return "Good Morning";
      } else if (now >= 12 && now < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };
    setWelcomeMsg(generateWelcomeMsg());
  }, []);
 
  useEffect(() => {
    const assessmentCountData = async () => {
      if (candidateId) {
        try {
          const totalAssessments = await getAssessmentCount(candidateId);
          setTotalAssessments(totalAssessments || 0);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
 
    assessmentCountData();
  }, []);
 
  useEffect(() => {
    const appliedJobsCountData = async () => {
      if (candidateId) {
        try {
          const totalAppliedJobs = await getAppliedJobsCount(candidateId);
          setTotalAppliedJobs(totalAppliedJobs || 0);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
 
    appliedJobsCountData();
  }, []);
 
  useEffect(() => {
    const interviewCountData = async () => {
      if (candidateId) {
        try {
          const totalInterviews = await getInterviewCount(candidateId);
          setTotalInterviews(totalInterviews || 0);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
 
    interviewCountData();
  }, []);
 
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (candidateId) {
        try {
          const jobs = await getAppliedJobs(candidateId);
          setAppliedJobs(jobs || []);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
 
    fetchAppliedJobs();
  }, []);
 
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/get/${candidateId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
 
    fetchProfileData();
  }, [candidateId]);
 
  const handleEditClick = () => {
    setIsEditing(true);
  };
 
  const handleSaveClick = async () => {
    try {
      const formData = new FormData();
      formData.append("candidateId", candidateId);
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("experience", profileData.experience);
      formData.append("skill", profileData.skill);
      formData.append("location", profileData.location);
      if (profileData.candidateProfileImage) {
        formData.append("candidateProfileImage", profileData.candidateProfileImage);
      }
 
      await axios.patch(`/profileupdate/${candidateId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
 
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile data", error);
    }
  };
 
  const handleInputChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileData({ ...profileData, candidateProfileImage: file });
  };
 
  const handleJobClick = (job) => {
    // Store job title in session storage before navigating
    sessionStorage.setItem("jobTitle", job.jobParameter);
    navigate(`job-detail/${job.mrfJdId}`);
  };
 
  return (
    <>
      <div className="flex flex-col md:flex-row m-4">
        <div className="w-full md:w-full">
          <h1 className="text-xl font-bold text-[#27235c] mb-2">{welcomeMsg}! </h1>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#27235c] mb-2">
              Your Progress Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-[#27235c] shadow-lg rounded-lg p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg text-center font-semibold text-white">
                    Total Interviews
                  </h3>
                  <p className="text-3xl text-center font-bold text-white mt-2">
                    {totalInterviews}
                  </p>
                </div>
              </div>
              <div className="bg-[#27235c] shadow-lg rounded-lg p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg text-center font-semibold text-white">
                    Total Assessments
                  </h3>
                  <p className="text-3xl text-center font-bold text-white mt-2">
                    {totalAssessments}
                  </p>
                </div>
              </div>
              <div className="bg-[#27235c] shadow-lg rounded-lg p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg text-center font-semibold text-white">
                    Total Applied Jobs
                  </h3>
                  <p className="text-3xl text-center font-bold text-white mt-2">
                    {totalAppliedJobs}
                  </p>
                </div>
              </div>
            </div>
          </div>
 
          {/* Applied Jobs Section */}
          <div className="bg-[#f4f4fa] rounded-lg p-6 mt-8 shadow-inner">
            <h3 className="text-2xl font-semibold text-[#27235c] mb-4">
              Your Applied Jobs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {appliedJobs.map((job) => (
                <div
                  key={job.mrfJdId}
                  className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  // Call handleJobClick on click
                  onClick={() => handleJobClick(job)}
                >
                  <h4 className="text-xl font-bold text-[#27235c]">
                    {job.jobTitle}
                  </h4>
                  <p className="text-gray-600">{job.jobParameter}</p>
                  {job.rolesAndResponsibilities && (
                    <p className="text-gray-600">
                     
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default CandidateDashboard;

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import CandidateNavbar from "./CandidateNavbar";
// import { getAppliedJobsCount, getAssessmentCount, getInterviewCount, getAppliedJobs } from "../../../services/Candidate/CandidateDashboardService";
// import CandidateJobApplyPage from "../../Candidate/CandidateCareer/CandiadateJobApplyPage"; // Import the CandidateJobApplyPage
// import interviewlogo from '../../../assets/CandidateDashboard/interview.png';
// import appliedlogo from '../../../assets/CandidateDashboard/apply.png';
// import assessmentlogo from '../../../assets/CandidateDashboard/assessment.png';

// function CandidateDashboard() {
//     const [welcomeMsg, setWelcomeMsg] = useState("");
//     const [totalInterviews, setTotalInterviews] = useState(0);
//     const [totalAssessments, setTotalAssessments] = useState(0);
//     const [totalAppliedJobs, setTotalAppliedJobs] = useState(0);
//     const [appliedJobs, setAppliedJobs] = useState([]);
//     const navigate = useNavigate();

//     const candidateId = sessionStorage.getItem("vendorId");
//     const [isEditing, setIsEditing] = useState(false);
//     const [profileData, setProfileData] = useState({
//         firstName: '',
//         lastName: '',
//         experience: '',
//         skill: '',
//         location: '',
//         candidateProfileImage: null,
//     });

//     useEffect(() => {
//         const generateWelcomeMsg = () => {
//             const now = new Date().getHours();
//             if (now >= 5 && now < 12) {
//                 return "Good Morning";
//             } else if (now >= 12 && now < 18) {
//                 return "Good Afternoon";
//             } else {
//                 return "Good Evening";
//             }
//         };
//         setWelcomeMsg(generateWelcomeMsg());
//     }, []);

//     useEffect(() => {
//         const assessmentCountData = async () => {
//             if (candidateId) {
//                 try {
//                     const totalAssessments = await getAssessmentCount(candidateId);
//                     setTotalAssessments(totalAssessments || 0);
//                 } catch (error) {
//                     console.error(error.message);
//                 }
//             }
//         };

//         assessmentCountData();
//     }, []);

//     useEffect(() => {
//         const appliedJobsCountData = async () => {
//             if (candidateId) {
//                 try {
//                     const totalAppliedJobs = await getAppliedJobsCount(candidateId);
//                     setTotalAppliedJobs(totalAppliedJobs || 0);
//                 } catch (error) {
//                     console.error(error.message);
//                 }
//             }
//         };

//         appliedJobsCountData();
//     }, []);

//     useEffect(() => {
//         const interviewCountData = async () => {
//             if (candidateId) {
//                 try {
//                     const totalInterviews = await getInterviewCount(candidateId);
//                     setTotalInterviews(totalInterviews || 0);
//                 } catch (error) {
//                     console.error(error.message);
//                 }
//             }
//         };

//         interviewCountData();
//     }, []);

//     useEffect(() => {
//         const fetchAppliedJobs = async () => {
//             if (candidateId) {
//                 try {
//                     const jobs = await getAppliedJobs(candidateId);
//                     setAppliedJobs(jobs || []);
//                 } catch (error) {
//                     console.error(error.message);
//                 }
//             }
//         };

//         fetchAppliedJobs();
//     }, []);

//     useEffect(() => {
//         const fetchProfileData = async () => {
//             try {
//                 const response = await axios.get(`/get/${candidateId}`);
//                 setProfileData(response.data);
//             } catch (error) {
//                 console.error("Error fetching profile data", error);
//             }
//         };

//         fetchProfileData();
//     }, [candidateId]);

//     const handleEditClick = () => {
//         setIsEditing(true);
//     };

//     const handleSaveClick = async () => {
//         try {
//             const formData = new FormData();
//             formData.append("candidateId", candidateId);
//             formData.append("firstName", profileData.firstName);
//             formData.append("lastName", profileData.lastName);
//             formData.append("experience", profileData.experience);
//             formData.append("skill", profileData.skill);
//             formData.append("location", profileData.location);
//             if (profileData.candidateProfileImage) {
//                 formData.append("candidateProfileImage", profileData.candidateProfileImage);
//             }

//             await axios.patch(`/profileupdate/${candidateId}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setIsEditing(false);
//         } catch (error) {
//             console.error("Error updating profile data", error);
//         }
//     };

//     const handleInputChange = (e, field) => {
//         setProfileData({ ...profileData, [field]: e.target.value });
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setProfileData({ ...profileData, candidateProfileImage: file });
//     };

//     const handleJobClick = (job) => {
//         // Store job title in session storage before navigating
//         sessionStorage.setItem("jobTitle", job.jobParameter);
//         navigate(`job-detail/${job.mrfJdId}`);
//     };

//     return (
//         <>
//             <div className="flex flex-col md:flex-row m-4">
//                 <div className="w-full md:w-full">
//                     <h1 className="text-xl font-bold text-[#27235c] mb-2">{welcomeMsg}! </h1>
//                     <div className="mb-4">
//                         <h2 className="text-xl font-bold text-[#27235c] mb-2">
//                             Your Progress Overview
//                         </h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                             <div className="bg-[#27235c] shadow-lg rounded-lg p-6 flex items-center justify-between">
//                                 <div className="flex-1">
//                                     <h3 className="text-lg text-center font-semibold text-white">
//                                         Total Interviews
//                                     </h3>
//                                     <p className="text-3xl text-center font-bold text-white mt-2">
//                                         {totalInterviews}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="bg-[#27235c] shadow-lg rounded-lg p-6 flex items-center justify-between">
//                                 <div className="flex-1">
//                                     <h3 className="text-lg text-center font-semibold text-white">
//                                         Total Assessments
//                                     </h3>
//                                     <p className="text-3xl text-center font-bold text-white mt-2">
//                                         {totalAssessments}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="bg-[#27235c] shadow-lg rounded-lg p-6 flex items-center justify-between">
//                                 <div className="flex-1">
//                                     <h3 className="text-lg text-center font-semibold text-white">
//                                         Total Applied Jobs
//                                     </h3>
//                                     <p className="text-3xl text-center font-bold text-white mt-2">
//                                         {totalAppliedJobs}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Applied Jobs Section */}
//                     <div className="bg-[#f4f4fa] rounded-lg p-6 mt-8 shadow-inner">
//                         <h3 className="text-2xl font-semibold text-[#27235c] mb-4">
//                             Your Applied Jobs
//                         </h3>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                             {appliedJobs.map((job) => (
//                                 <div
//                                     key={job.mrfJdId}
//                                     className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
//                                     // Call handleJobClick on click
//                                     onClick={() => handleJobClick(job)}
//                                 >
//                                     <h4 className="text-xl font-bold text-[#27235c]">
//                                         {job.jobTitle}
//                                     </h4>
//                                     <p className="text-gray-600">{job.jobParameter}</p>
//                                     {job.rolesAndResponsibilities && (
//                                         <p className="text-gray-600">
//                                             {job.rolesAndResponsibilities}
//                                         </p>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Jobs Available Section */}
//                     <div className="bg-[#f4f4fa] rounded-lg p-6 mt-8 shadow-inner">
//                         <h3 className="text-2xl font-semibold text-[#27235c] mb-4">
//                             Jobs Available
//                         </h3>
//                         <CandidateJobApplyPage /> {/* Render the CandidateJobApplyPage component here */}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default CandidateDashboard;