// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getInterviewLevels, getInterviewDetails } from "../../../services/Candidate/CandidateDashboardService";
// import ProgressBar from "./ProgressBar";
// import { FaCalendarAlt, FaLink } from "react-icons/fa";
 
// const AppliedJobDetails = () => {
//   const { mrfJdId } = useParams();
//   const [interviewLevels, setInterviewLevels] = useState([]);
//   const [currentStage, setCurrentStage] = useState(0);
//   const [detailsData, setDetailsData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [jobTitle, setJobTitle] = useState(""); // State for job title
//   const candidateId = sessionStorage.getItem("vendorId");
//   const jobTitlee = sessionStorage.getItem('jobTitle');
 
//   useEffect(() => {
//     const fetchInterviewLevels = async () => {
//       try {
//         const data = await getInterviewLevels(mrfJdId);
//         setInterviewLevels(data);
//         const completedStages = data.filter(
//           (level) => level.completedStatus !== "Pending"
//         ).length;
//         const initialStage = completedStages + 2;
//         setCurrentStage(initialStage);
//         handleStageClick(initialStage - 1); // Show details of the highest stage on page load
//       } catch (error) {
//         console.error("Error fetching interview levels", error);
//       }
//     };
 
//     fetchInterviewLevels();
//   }, [mrfJdId]);
 
//   const stages = [
//     "Application Submitted",
//     "Shortlisted",
//     ...interviewLevels.map((level) => level.recruitmentProcessType),
//     "Offer Release",
//   ];
 
//   const handleStageClick = async (index) => {
//     if (index >= 2 && (index < currentStage || index === currentStage)) {
//       setIsLoading(true);
//       try {
//         const recruitmentProcessId = interviewLevels[index - 2]?.recruitmentProcessId;
//         if (recruitmentProcessId) {
//           const data = await getInterviewDetails(recruitmentProcessId, candidateId);
//           setDetailsData({ ...data, currentStage: stages[index] });
//           setJobTitle(data.jobTitle);
//         }
//       } catch (error) {
//         console.error("Error fetching details", error);
//         setDetailsData(null);
//       } finally {
//         setIsLoading(false);
//       }
//     } else if (index < 2) {
//       const greeting = index === 0
//         ? "Congratulations on moving forward in the application process!"
//         : "You have been shortlisted! Keep going!";
 
//       setDetailsData({ greeting, currentStage: stages[index] });
//     }
//   };
 
//   const formatTime = (time) => {
//     const [hour, minute] = time.split(':');
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${minute} ${ampm}`;
//   };
 
//   const formatDateTime = (date, time) => {
//     const [year, month, day] = date.split('-');
//     return `${day}/${month}/${year}, ${formatTime(time)}`;
//   };
 
//   const isFutureOrPresent = (date, time) => {
//     const dateTime = new Date(`${date}T${time}`);
//     return dateTime >= new Date();
//   };
 
//   const renderDetails = (data) => {
//     if (!data) return null;
//     if (data.greeting) return <p className="text-xl font-semibold">{data.greeting}</p>;
 
//     const isInterviewFutureOrPresent = data.interviewDate && isFutureOrPresent(data.interviewDate, data.interviewFromTime);
//     const isAssessmentFutureOrPresent = data.assessmentStartDate && isFutureOrPresent(data.assessmentStartDate, data.assessmentStartTime);
   
 
//     return (
//       <div className="grid grid-cols-2 gap-4">
//         <div className="flex flex-col">
//           {data.interviewTitle && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">{data.interviewTitle}</h2>
//               <p className="text-gray-600">{data.candidateStatus}</p>
//               <p className="text-gray-600">{data.others}</p>
//               {data.meetingUrl && isInterviewFutureOrPresent ? (
//                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                   <FaLink />
//                   <span>Join Meeting (Unlocks on {formatDateTime(data.interviewDate, data.interviewFromTime)})</span>
//                 </button>
//               ) : (
//                 isInterviewFutureOrPresent ? (
//                   <a href={data.meetingUrl} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                     <FaLink />
//                     <span>Join Meeting</span>
//                   </a>
//                 ) : (
//                   <p className="text-red-600 mt-4">Meeting link expired</p>
//                 )
//               )}
//             </>
//           )}
//           {data.assessmentName && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">{data.assessmentName}</h2>
//               <p className="text-gray-600">{data.assessmentType}</p>
//               <p className="text-gray-600">{data.status}</p>
//               {data.assessmentLink && isAssessmentFutureOrPresent ? (
//                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                   <FaLink />
//                   <span>Start Assessment (Unlocks on {formatDateTime(data.assessmentStartDate, data.assessmentStartTime)})</span>
//                 </button>
//               ) : (
//                 isAssessmentFutureOrPresent ? (
//                   <a href={data.assessmentLink} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                     <FaLink />
//                     <span>Start Assessment</span>
//                   </a>
//                 ) : (
//                   <p className="text-red-600 mt-4">Assessment link expired</p>
//                 )
//               )}
//             </>
//           )}
//         </div>
//         <div className="flex flex-col items-end">
//           {data.interviewDate && (
//             <>
//               <div className="flex items-center mt-2">
//                 <FaCalendarAlt className="mr-2 text-[#27235c]" />
//                 <p>{`${data.interviewDate}, ${formatTime(data.interviewFromTime)} - ${formatTime(data.interviewToTime)}`}</p>
//               </div>
//             </>
//           )}
//           {data.assessmentStartDate && data.assessmentEndDate && (
//             <>
//               <div className="flex items-center mt-2">
//                 <FaCalendarAlt className="mr-2 text-[#27235c]" />
//                 <p>{`${data.assessmentStartDate}, ${formatTime(data.assessmentStartTime)} - ${data.assessmentEndDate}, ${formatTime(data.assessmentEndTime)}`}</p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };
 
//   return (
//     <div className="p-6" style={{ scrollBehavior: "smooth" }}>
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-[#27235c] mb-4">
//           Application Status - {jobTitlee} {/* Display job title */}
//         </h2>
//         <ProgressBar
//           stages={stages}
//           currentStage={currentStage}
//           isLoading={isLoading}
//           onStageClick={handleStageClick}
//         />
//       </div>
 
//       <div className="w-full border-2 border-[#27235c] rounded-lg mt-8 p-4 bg-white">
//         {detailsData ? (
//           <>
//             <h1 className="py-4 font-medium text-black/80">
//               Current Stage: {detailsData.currentStage}
//             </h1>
//             <hr className="border-1 border-[#27235c] mb-4" />
//             <div className="p-3">
//               {renderDetails(detailsData)}
//             </div>
//           </>
//         ) : (
//           <div className="p-3">
//             <h1 className="text-xl font-semibold">No Details Found</h1>
//             <p>Click on a stage to view details.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
 
// export default AppliedJobDetails;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getInterviewLevels, getInterviewDetails } from "../../../services/Candidate/CandidateDashboardService";
// import ProgressBar from "./ProgressBar";
// import { FaCalendarAlt, FaLink } from "react-icons/fa";
 
// const AppliedJobDetails = () => {
//   const { mrfJdId } = useParams();
//   const [interviewLevels, setInterviewLevels] = useState([]);
//   const [currentStage, setCurrentStage] = useState(0);
//   const [detailsData, setDetailsData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [jobTitle, setJobTitle] = useState(""); // State for job title
//   const candidateId = sessionStorage.getItem("vendorId");
//   const jobTitlee = sessionStorage.getItem('jobTitle');
 
//   useEffect(() => {
//     const fetchInterviewLevels = async () => {
//       try {
//         const data = await getInterviewLevels(mrfJdId);
//         setInterviewLevels(data);
//         const completedStages = data.filter(
//           (level) => level.completedStatus !== "Pending"
//         ).length;
//         const initialStage = completedStages + 2;
//         setCurrentStage(initialStage);
//         handleStageClick(initialStage - 1); // Show details of the highest stage on page load
//       } catch (error) {
//         console.error("Error fetching interview levels", error);
//       }
//     };
 
//     fetchInterviewLevels();
//   }, [mrfJdId]);
 
//   const stages = [
//     "Application Submitted",
//     "Shortlisted",
//     ...interviewLevels.map((level) => "Level:" +level.level+level.recruitmentProcessName),
//     "Offer Release",
//   ];
 
//   const handleStageClick = async (index) => {
//     if (index >= 2 && (index < currentStage || index === currentStage)) {
//       setIsLoading(true);
//       try {
//         const recruitmentProcessId = interviewLevels[index - 2]?.recruitmentProcessId; // Get the recruitment process ID
//         if (recruitmentProcessId) {
//           // Store the recruitment process ID in session storage
//           sessionStorage.setItem('recruitmentProcessId', recruitmentProcessId);
 
//           const data = await getInterviewDetails(recruitmentProcessId, candidateId);
//           setDetailsData({ ...data, currentStage: stages[index] });
//           setJobTitle(data.jobTitle);
//           console.log(data);
//         }
//       } catch (error) {
//         console.error("Error fetching details", error);
//         setDetailsData(null);
//       } finally {
//         setIsLoading(false);
//       }
//     } else if (index < 2) {
//       const greeting = index === 0
//         ? "Congratulations on moving forward in the application process!"
//         : "You have been shortlisted! Keep going!";
 
//       setDetailsData({ greeting, currentStage: stages[index] });
//     }
//   };
 
//   const formatTime = (time) => {
//     const [hour, minute] = time.split(':');
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${minute} ${ampm}`;
//   };
 
//   const formatDateTime = (date, time) => {
//     const [year, month, day] = date.split('-');
//     return `${day}/${month}/${year}, ${formatTime(time)}`;
//   };
 
//   const isFutureOrPresent = (date, time) => {
//     const dateTime = new Date(`${date}T${time}`);
//     return dateTime >= new Date();
//   };
 
//   const renderDetails = (data) => {
//     if (!data) return null;
//     if (data.greeting) return <p className="text-xl font-semibold">{data.greeting}</p>;
 
//     const isInterviewFutureOrPresent = data.interviewDate && isFutureOrPresent(data.interviewDate, data.interviewFromTime);
//     const isAssessmentFutureOrPresent = data.assessmentStartDate && isFutureOrPresent(data.assessmentStartDate, data.assessmentStartTime);
 
//     return (
//       <div className="grid grid-cols-2 gap-4">
//         <div className="flex flex-col">
//           {data.interviewTitle && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">{data.interviewTitle}</h2>
//               <p className="text-gray-600">{data.candidateStatus}</p>
//               <p className="text-gray-600">{data.others}</p>
//               {data.meetingUrl && isInterviewFutureOrPresent ? (
//                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                   <FaLink />
//                   <span>Join Meeting (Unlocks on {formatDateTime(data.interviewDate, data.interviewFromTime)})</span>
//                 </button>
//               ) : (
//                 isInterviewFutureOrPresent ? (
//                   <a href={data.meetingUrl} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                     <FaLink />
//                     <span>Join Meeting</span>
//                   </a>
//                 ) : (
//                   <p className="text-red-600 mt-4">Meeting link expired</p>
//                 )
//               )}
//             </>
//           )}
//           {data.assessmentName && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">{data.assessmentName}</h2>
//               <p className="text-gray-600">{data.assessmentType}</p>
//               <p className="text-gray-600">{data.status}</p>
//               {data.assessmentLink && isAssessmentFutureOrPresent ? (
//                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                   <FaLink />
//                   <span>Start Assessment (Unlocks on {formatDateTime(data.assessmentStartDate, data.assessmentStartTime)})</span>
//                 </button>
//               ) : (
//                 isAssessmentFutureOrPresent ? (
//                   <a href={data.assessmentLink} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                     <FaLink />
//                     <span>Start Assessment</span>
//                   </a>
//                 ) : (
//                   <p className="text-red-600 mt-4">Assessment link expired</p>
//                 )
//               )}
//             </>
//           )}
//         </div>
//         <div className="flex flex-col items-end">
//           {data.interviewDate && (
//             <>
//               <div className="flex items-center mt-2">
//                 <FaCalendarAlt className="mr-2 text-[#27235c]" />
//                 <p>{`${data.interviewDate}, ${formatTime(data.interviewFromTime)} - ${formatTime(data.interviewToTime)}`}</p>
//               </div>
//             </>
//           )}
//           {data.assessmentStartDate && data.assessmentEndDate && (
//             <>
//               <div className="flex items-center mt-2">
//                 <FaCalendarAlt className="mr-2 text-[#27235c]" />
//                 <p>{`${data.assessmentStartDate}, ${formatTime(data.assessmentStartTime)} - ${data.assessmentEndDate}, ${formatTime(data.assessmentEndTime)}`}</p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };
 
//   return (
//     <div className="p-6" style={{ scrollBehavior: "smooth" }}>
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-[#27235c] mb-4">
//           Application Status - {jobTitlee} {/* Display job title */}
//         </h2>
//         <ProgressBar
//           stages={stages}
//           currentStage={currentStage}
//           isLoading={isLoading}
//           onStageClick={handleStageClick}
//         />
//       </div>
 
//       <div className="w-full border-2 border-[#27235c] rounded-lg mt-8 p-4 bg-white">
//         {detailsData ? (
//           <>
//             <h1 className="py-4 font-medium text-black/80">
//               Current Stage: {detailsData.currentStage}
//             </h1>
//             <hr className="border-1 border-[#27235c] mb-4" />
//             <div className="p-3">
//               {renderDetails(detailsData)}
//             </div>
//           </>
//         ) : (
//           <div className="p-3">
//             <h1 className="text-xl font-semibold">No Details Found</h1>
//             <p>Click on a stage to view details.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
 
// export default AppliedJobDetails;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getInterviewLevels, getInterviewDetails } from "../../../services/Candidate/CandidateDashboardService";
// import ProgressBar from "./ProgressBar";
// import { FaCalendarAlt, FaLink } from "react-icons/fa";

// const AppliedJobDetails = () => {
//   const { mrfJdId } = useParams();
//   const [interviewLevels, setInterviewLevels] = useState([]);
//   const [currentStage, setCurrentStage] = useState(0);
//   const [detailsData, setDetailsData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [jobTitle, setJobTitle] = useState("");
//   const candidateId = sessionStorage.getItem("vendorId");

//   useEffect(() => {
//     const fetchInterviewLevels = async () => {
//       try {
//         const data = await getInterviewLevels(mrfJdId);
//         setInterviewLevels(data);
        
//         // Set current stage to the last level available
//         const completedStages = data.filter(level => level.completedStatus !== "Pending").length;
//         const initialStage = Math.min(completedStages + 2, data.length + 1); // Ensure it does not exceed available stages
//         setCurrentStage(initialStage);
//         handleStageClick(initialStage - 1); // Automatically show details of the last stage
//       } catch (error) {
//         console.error("Error fetching interview levels", error);
//       }
//     };

//     fetchInterviewLevels();
//   }, [mrfJdId]);

//   const stages = [
//     "Application Submitted",
//     "Shortlisted",
//     ...interviewLevels.map(level => `Level: ${level.level} ${level.recruitmentProcessName}`)
//   ];

//   const handleStageClick = async (index) => {
//     if (index >= 2 && (index < currentStage || index === currentStage)) {
//       setIsLoading(true);
//       try {
//         const recruitmentProcessId = interviewLevels[index - 2]?.recruitmentProcessId; // Get the recruitment process ID
//         if (recruitmentProcessId) {
//           sessionStorage.setItem('recruitmentProcessId', recruitmentProcessId);

//           const data = await getInterviewDetails(recruitmentProcessId, candidateId);
//           setDetailsData({ ...data, currentStage: stages[index] });
//           setJobTitle(data.jobTitle);
//           console.log(data);
//         }
//       } catch (error) {
//         console.error("Error fetching details", error);
//         setDetailsData(null);
//       } finally {
//         setIsLoading(false);
//       }
//     } else if (index < 2) {
//       const greeting = index === 0
//         ? "Congratulations on moving forward in the application process!"
//         : "You have been shortlisted! Keep going!";

//       setDetailsData({ greeting, currentStage: stages[index] });
//     }
//   };

//   const formatTime = (time) => {
//     const [hour, minute] = time.split(':');
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${minute} ${ampm}`;
//   };

//   const formatDateTime = (date, time) => {
//     const [year, month, day] = date.split('-');
//     return `${day}/${month}/${year}, ${formatTime(time)}`;
//   };

//   const isFutureOrPresent = (date, time) => {
//     const dateTime = new Date(`${date}T${time}`);
//     return dateTime >= new Date();
//   };

//   const renderDetails = (data) => {
//     if (!data) return null;
//     if (data.greeting) return <p className="text-xl font-semibold">{data.greeting}</p>;

//     const isInterviewFutureOrPresent = data.interviewDate && isFutureOrPresent(data.interviewDate, data.interviewFromTime);
//     const isAssessmentFutureOrPresent = data.assessmentStartDate && isFutureOrPresent(data.assessmentStartDate, data.assessmentStartTime);

//     return (
//       <div className="grid grid-cols-2 gap-4">
//         <div className="flex flex-col">
//           {data.interviewTitle && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">{data.interviewTitle}</h2>
//               <p className="text-gray-600">{data.candidateStatus}</p>
//               <p className="text-gray-600">{data.others}</p>
//               {data.meetingUrl && isInterviewFutureOrPresent ? (
//                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                   <FaLink />
//                   <span>Join Meeting (Unlocks on {formatDateTime(data.interviewDate, data.interviewFromTime)})</span>
//                 </button>
//               ) : (
//                 isInterviewFutureOrPresent ? (
//                   <a href={data.meetingUrl} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                     <FaLink />
//                     <span>Join Meeting</span>
//                   </a>
//                 ) : (
//                   <p className="text-red-600 mt-4">Meeting link expired</p>
//                 )
//               )}
//             </>
//           )}
//           {data.assessmentName && (
//             <>
//               <h2 className="text-lg font-semibold mb-2">{data.assessmentName}</h2>
//               <p className="text-gray-600">{data.assessmentType}</p>
//               <p className="text-gray-600">{data.status}</p>
//               {data.assessmentLink && isAssessmentFutureOrPresent ? (
//                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                   <FaLink />
//                   <span>Start Assessment (Unlocks on {formatDateTime(data.assessmentStartDate, data.assessmentStartTime)})</span>
//                 </button>
//               ) : (
//                 isAssessmentFutureOrPresent ? (
//                   <a href={data.assessmentLink} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                     <FaLink />
//                     <span>Start Assessment</span>
//                   </a>
//                 ) : (
//                   <p className="text-red-600 mt-4">Assessment link expired</p>
//                 )
//               )}
//             </>
//           )}
//         </div>
//         <div className="flex flex-col items-end">
//           {data.interviewDate && (
//             <div className="flex items-center mt-2">
//               <FaCalendarAlt className="mr-2 text-[#27235c]" />
//               <p>{`${data.interviewDate}, ${formatTime(data.interviewFromTime)} - ${formatTime(data.interviewToTime)}`}</p>
//             </div>
//           )}
//           {data.assessmentStartDate && data.assessmentEndDate && (
//             <div className="flex items-center mt-2">
//               <FaCalendarAlt className="mr-2 text-[#27235c]" />
//               <p>{`${data.assessmentStartDate}, ${formatTime(data.assessmentStartTime)} - ${data.assessmentEndDate}, ${formatTime(data.assessmentEndTime)}`}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-[#27235c] mb-4">
//           Application Status - {jobTitle} {/* Display job title */}
//         </h2>
//         <ProgressBar
//           stages={stages}
//           currentStage={currentStage}
//           isLoading={isLoading}
//           onStageClick={handleStageClick}
//         />
//       </div>

//       <div className="w-full border-2 border-[#27235c] rounded-lg mt-8 p-4 bg-white">
//         {detailsData ? (
//           <>
//             <h1 className="py-4 font-medium text-black/80">
//               Current Stage: {detailsData.currentStage}
//             </h1>
//             <hr className="border-1 border-[#27235c] mb-4" />
//             <div className="p-3">
//               {renderDetails(detailsData)}
//             </div>
//           </>
//         ) : (
//           <div className="p-3">
//             <h1 className="text-xl font-semibold">No Details Found</h1>
//             <p>Click on a stage to view details.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppliedJobDetails;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getInterviewLevels, getInterviewDetails } from "../../../services/Candidate/CandidateDashboardService";
// import { getOfferLetterByCandidateId } from "../../../services/Candidate/CandidateViewOfferService"; // Import the offer service
// import ProgressBar from "./ProgressBar";
// import { FaCalendarAlt, FaLink } from "react-icons/fa";

// const AppliedJobDetails = () => {
//     const { mrfJdId } = useParams();
//     const [interviewLevels, setInterviewLevels] = useState([]);
//     const [currentStage, setCurrentStage] = useState(0);
//     const [detailsData, setDetailsData] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [jobTitle, setJobTitle] = useState("");
//     const candidateId = sessionStorage.getItem("vendorId");

//     useEffect(() => {
//         const fetchInterviewLevels = async () => {
//             try {
//                 const data = await getInterviewLevels(mrfJdId);
//                 setInterviewLevels(data);
//                 const completedStages = data.filter(level => level.completedStatus !== "Pending").length;
//                 const initialStage = Math.min(completedStages + 2, data.length + 1); // Ensure it does not exceed available stages
//                 setCurrentStage(initialStage);
//                 handleStageClick(initialStage - 1); // Automatically show details of the last stage
//             } catch (error) {
//                 console.error("Error fetching interview levels", error);
//             }
//         };

//         fetchInterviewLevels();
//     }, [mrfJdId]);

//     const stages = [
//         "Application Submitted",
//         "Shortlisted",
//         ...interviewLevels.map(level => `Level: ${level.level} ${level.recruitmentProcessName}`)
//     ];

//     const handleStageClick = async (index) => {
//         if (index >= 2 && (index < currentStage || index === currentStage)) {
//             setIsLoading(true);
//             try {
//                 const recruitmentProcessId = interviewLevels[index - 2]?.recruitmentProcessId; // Get the recruitment process ID
//                 if (recruitmentProcessId) {
//                     sessionStorage.setItem('recruitmentProcessId', recruitmentProcessId);

//                     const data = await getInterviewDetails(recruitmentProcessId, candidateId);
//                     setDetailsData({ ...data, currentStage: stages[index] });
//                     setJobTitle(data.jobTitle);

//                     // Check if the current level signifies an offer
//                     if (interviewLevels[index - 2]?.level === "Offer") { 
//                         const offerData = await getOfferLetterByCandidateId(candidateId);
//                         setDetailsData(prev => ({ ...prev, offerData })); // Add offer data to detailsData
//                     }

//                     console.log(data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching details", error);
//                 setDetailsData(null);
//             } finally {
//                 setIsLoading(false);
//             }
//         } else if (index < 2) {
//             const greeting = index === 0
//                 ? "Congratulations on moving forward in the application process!"
//                 : "You have been shortlisted! Keep going!";

//             setDetailsData({ greeting, currentStage: stages[index] });
//         }
//     };

//     const formatTime = (time) => {
//         const [hour, minute] = time.split(':');
//         const ampm = hour >= 12 ? 'PM' : 'AM';
//         const formattedHour = hour % 12 || 12;
//         return `${formattedHour}:${minute} ${ampm}`;
//     };

//     const formatDateTime = (date, time) => {
//         const [year, month, day] = date.split('-');
//         return `${day}/${month}/${year}, ${formatTime(time)}`;
//     };

//     const isFutureOrPresent = (date, time) => {
//         const dateTime = new Date(`${date}T${time}`);
//         return dateTime >= new Date();
//     };

//     const renderDetails = (data) => {
//         if (!data) return null;
//         if (data.greeting) return <p className="text-xl font-semibold">{data.greeting}</p>;

//         const isInterviewFutureOrPresent = data.interviewDate && isFutureOrPresent(data.interviewDate, data.interviewFromTime);
//         const isAssessmentFutureOrPresent = data.assessmentStartDate && isFutureOrPresent(data.assessmentStartDate, data.assessmentStartTime);

//         return (
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                     {data.interviewTitle && (
//                         <>
//                             <h2 className="text-lg font-semibold mb-2">{data.interviewTitle}</h2>
//                             <p className="text-gray-600">{data.candidateStatus}</p>
//                             <p className="text-gray-600">{data.others}</p>
//                             {data.meetingUrl && isInterviewFutureOrPresent ? (
//                                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                                     <FaLink />
//                                     <span>Join Meeting (Unlocks on {formatDateTime(data.interviewDate, data.interviewFromTime)})</span>
//                                 </button>
//                             ) : (
//                                 isInterviewFutureOrPresent ? (
//                                     <a href={data.meetingUrl} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                                         <FaLink />
//                                         <span>Join Meeting</span>
//                                     </a>
//                                 ) : (
//                                     <p className="text-red-600 mt-4">Meeting link expired</p>
//                                 )
//                             )}
//                         </>
//                     )}
//                     {data.assessmentName && (
//                         <>
//                             <h2 className="text-lg font-semibold mb-2">{data.assessmentName}</h2>
//                             <p className="text-gray-600">{data.assessmentType}</p>
//                             <p className="text-gray-600">{data.status}</p>
//                             {data.assessmentLink && isAssessmentFutureOrPresent ? (
//                                 <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
//                                     <FaLink />
//                                     <span>Start Assessment (Unlocks on {formatDateTime(data.assessmentStartDate, data.assessmentStartTime)})</span>
//                                 </button>
//                             ) : (
//                                 isAssessmentFutureOrPresent ? (
//                                     <a href={data.assessmentLink} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
//                                         <FaLink />
//                                         <span>Start Assessment</span>
//                                     </a>
//                                 ) : (
//                                     <p className="text-red-600 mt-4">Assessment link expired</p>
//                                 )
//                             )}
//                         </>
//                     )}
//                 </div>
//                 <div className="flex flex-col items-end">
//                     {data.interviewDate && (
//                         <div className="flex items-center mt-2">
//                             <FaCalendarAlt className="mr-2 text-[#27235c]" />
//                             <p>{`${data.interviewDate}, ${formatTime(data.interviewFromTime)} - ${formatTime(data.interviewToTime)}`}</p>
//                         </div>
//                     )}
//                     {data.assessmentStartDate && data.assessmentEndDate && (
//                         <div className="flex items-center mt-2">
//                             <FaCalendarAlt className="mr-2 text-[#27235c]" />
//                             <p>{`${data.assessmentStartDate}, ${formatTime(data.assessmentStartTime)} - ${data.assessmentEndDate}, ${formatTime(data.assessmentEndTime)}`}</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="p-6">
//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-[#27235c] mb-4">
//                     Application Status - {jobTitle} {/* Display job title */}
//                 </h2>
//                 <ProgressBar
//                     stages={stages}
//                     currentStage={currentStage}
//                     isLoading={isLoading}
//                     onStageClick={handleStageClick}
//                 />
//             </div>

//             <div className="w-full border-2 border-[#27235c] rounded-lg mt-8 p-4 bg-white">
//                 {detailsData ? (
//                     <>
//                         <h1 className="py-4 font-medium text-black/80">
//                             Current Stage: {detailsData.currentStage}
//                         </h1>
//                         <hr className="border-1 border-[#27235c] mb-4" />
//                         <div className="p-3">
//                             {renderDetails(detailsData)}
//                             {detailsData.offerData && (
//                                 <div className="mt-4">
//                                     <h3 className="font-semibold">Offer Details:</h3>
//                                     <p>{detailsData.offerData.offerLetterDetails}</p> {/* Adjust this according to your offer data structure */}
//                                 </div>
//                             )}
//                         </div>
//                     </>
//                 ) : (
//                     <div className="p-3">
//                         <h1 className="text-xl font-semibold">No Details Found</h1>
//                         <p>Click on a stage to view details.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AppliedJobDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInterviewLevels, getInterviewDetails } from "../../../services/Candidate/CandidateDashboardService"; 
import { getOfferLetterByCandidateId, acceptOffer } from "../../../services/Candidate/CandidateViewOfferService";
import ProgressBar from "./ProgressBar";
import { FaCalendarAlt, FaLink } from "react-icons/fa";

const AppliedJobDetails = () => {
    const { mrfJdId } = useParams();
    const [interviewLevels, setInterviewLevels] = useState([]);
    const [currentStage, setCurrentStage] = useState(0);
    const [detailsData, setDetailsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [offerDetails, setOfferDetails] = useState(null); 
    const candidateId = sessionStorage.getItem("vendorId");
    const [congratulationMessage, setCongratulationMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showRejectReasons, setShowRejectReasons] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');
    const [rejectionMessage, setRejectionMessage] = useState('');

    const rejectionReasons = [
        "Got Better Compensation Package Elsewhere",
        "Relocation Issues",
        "Long Commute",
        "Personal Reasons",
        "Disinterest in Job Role",
        "Shift or Work Schedule Conflicts",
        "Others"
    ];

    useEffect(() => {
        const fetchInterviewLevels = async () => {
            try {
                const data = await getInterviewLevels(mrfJdId);
                setInterviewLevels(data);
                const completedStages = data.filter(level => level.completedStatus !== "Pending").length;
                const initialStage = Math.max(completedStages + 2, 1); 
                setCurrentStage(initialStage);
                handleStageClick(initialStage - 1); 
            } catch (error) {
                console.error("Error fetching interview levels", error);
            }
        };

        fetchInterviewLevels();
    }, [mrfJdId]);

    const stages = [
        "Application Submitted",
        "Shortlisted",
        ...interviewLevels.map(level => `Level: ${level.level} ${level.recruitmentProcessName}`),
        "Offer Release" 
    ];

    const handleStageClick = async (index) => {
        setIsLoading(true); 
        setCongratulationMessage(''); 
        setDetailsData(null); 
        setOfferDetails(null); 

        try {
            if (index >= 0 && index < stages.length) {
                if (index === 0) { 
                    setCongratulationMessage("Congratulations! Your application has been submitted successfully.");
                } else if (index === 1) { 
                    setCongratulationMessage("Congratulations! You've been shortlisted for the next round. All the best!");
                } else if (index === stages.length - 1) { 
                    const offerData = await getOfferLetterByCandidateId(candidateId);
                    console.log("Offer Data from API:", offerData); 
                    setOfferDetails(offerData);
                } else { 
                    const previousLevelsCompleted = interviewLevels.slice(0, index - 2).every(level => level.completedStatus !== "Pending");

                    if (!previousLevelsCompleted) {
                        setCongratulationMessage("Please complete the previous levels to view details for this stage.");
                    } else {
                        const recruitmentProcessId = interviewLevels[index - 2]?.recruitmentProcessId; 
                        if (recruitmentProcessId) {
                            sessionStorage.setItem('recruitmentProcessId', recruitmentProcessId);
                            const data = await getInterviewDetails(recruitmentProcessId, candidateId);
                            if (data) {
                                setDetailsData({ ...data, currentStage: stages[index] });
                                setJobTitle(data.jobTitle);
                            } 
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setIsLoading(false); 
        }
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const formatDateTime = (date, time) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}, ${formatTime(time)}`;
    };

    const isFutureOrPresent = (date, time) => {
        const dateTime = new Date(`${date}T${time}`);
        return dateTime >= new Date();
    };

    const renderDetails = (data) => {
        if (!data) return null;

        const isInterviewFutureOrPresent = data.interviewDate && isFutureOrPresent(data.interviewDate, data.interviewFromTime);
        const isAssessmentFutureOrPresent = data.assessmentStartDate && isFutureOrPresent(data.assessmentStartDate, data.assessmentStartTime);

        return (
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    {data.interviewTitle && (
                        <>
                            <h2 className="text-lg font-semibold mb-2">{data.interviewTitle}</h2>
                            <p className="text-gray-600">{data.candidateStatus}</p>
                            <p className="text-gray-600">{data.others}</p>
                            {data.meetingUrl && isInterviewFutureOrPresent ? (
                                <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
                                    <FaLink />
                                    <span>Join Meeting (Unlocks on {formatDateTime(data.interviewDate, data.interviewFromTime)})</span>
                                </button>
                            ) : (
                                isInterviewFutureOrPresent ? (
                                    <a href={data.meetingUrl} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
                                        <FaLink />
                                        <span>Join Meeting</span>
                                    </a>
                                ) : (
                                    <p className="text-red-600 mt-4">Meeting link expired</p>
                                )
                            )}
                        </>
                    )}
                    {data.assessmentName && (
                        <>
                            <h2 className="text-lg font-semibold mb-2">{data.assessmentName}</h2>
                            <p className="text-gray-600">{data.assessmentType}</p>
                            <p className="text-gray-600">{data.status}</p>
                            {data.assessmentLink && isAssessmentFutureOrPresent ? (
                                <button disabled className="mt-4 inline-block bg-gray-300 text-gray-500 py-1 px-2 rounded flex items-center space-x-1">
                                    <FaLink />
                                    <span>Start Assessment (Unlocks on {formatDateTime(data.assessmentStartDate, data.assessmentStartTime)})</span>
                                </button>
                            ) : (
                                isAssessmentFutureOrPresent ? (
                                    <a href={data.assessmentLink} className="mt-4 inline-block bg-[#27235c] text-white py-1 px-2 rounded hover:bg-[#1f1a48] flex items-center space-x-1" target="_blank" rel="noopener noreferrer">
                                        <FaLink />
                                        <span>Start Assessment</span>
                                    </a>
                                ) : (
                                    <p className="text-red-600 mt-4">Assessment link expired</p>
                                )
                            )}
                        </>
                    )}
                </div>
                <div className="flex flex-col items-end">
                    {data.interviewDate && (
                        <div className="flex items-center mt-2">
                            <FaCalendarAlt className="mr-2 text-[#27235c]" />
                            <p>{`${data.interviewDate}, ${formatTime(data.interviewFromTime)} - ${formatTime(data.interviewToTime)}`}</p>
                        </div>
                    )}
                    {data.assessmentStartDate && data.assessmentEndDate && (
                        <div className="flex items-center mt-2">
                            <FaCalendarAlt className="mr-2 text-[#27235c]" />
                            <p>{`${data.assessmentStartDate}, ${formatTime(data.assessmentStartTime)} - ${data.assessmentEndDate}, ${formatTime(data.assessmentEndTime)}`}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderOfferDetails = (offerData) => {
        if (!offerData) return null;

        const openPDFModal = () => {
            setModalVisible(true);
        };

        const handleAcceptOffer = async () => {
            setShowRejectReasons(false); // Hide rejection reasons if accepting
            setShowConfirmation(true); // Show acceptance confirmation
        };

        const handleRejectOffer = () => {
            setShowConfirmation(false); // Hide acceptance confirmation if rejecting
            setShowRejectReasons(true); // Show rejection reasons dropdown
        };

        const submitRejectionReason = () => {
            if (selectedReason === "Others" && !otherReason) {
                alert("Please specify a reason if 'Others' is selected.");
                return;
            }
            // Construct and display the rejection message
            const reason = selectedReason === "Others" ? otherReason : selectedReason;
            setRejectionMessage(reason);
            setSelectedReason(''); // Reset selected reason
            setOtherReason(''); // Reset other reason
            setShowRejectReasons(false); // Hide the dropdown after submitting
        };

        const confirmAcceptOffer = () => {
            setShowConfirmation(true);
        };

        return (
            <div className="border p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-xl mb-2">Offer Letter Details</h3>
                <p><strong>Candidate Name:</strong> {offerData.candidate.firstName} {offerData.candidate.lastName}</p>
                <p><strong>Email:</strong> {offerData.candidate.email}</p>
                <p><strong>Mobile:</strong> {offerData.candidate.mobileNumber}</p>
                <p><strong>Joining Date:</strong> {offerData.joiningDate}</p>
                <p><strong>Package:</strong> ₹{offerData.offerPackage} LPA</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${offerData.candidateStatus.toLowerCase() === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>{offerData.candidateStatus}</span></p>

                {offerData.candidateStatus.toLowerCase() !== 'accepted' && (
                    <>
                        <button 
                            onClick={handleAcceptOffer} 
                            className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-400"
                        >
                            Accept Offer
                        </button>
                        <button 
                            onClick={handleRejectOffer} 
                            className="mt-4 inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 ml-2"
                        >
                            Reject Offer
                        </button>
                    </>
                )}

                {showConfirmation && (
                    <div className="mt-4 border rounded p-3 bg-white shadow">
                        <p className="mb-2">Are you sure you want to accept the offer? <span className="text-red-500">Before accepting the offer, it is recommended to view the offer and read the terms and conditions.*</span></p>
                        <button 
                            onClick={handleAcceptOffer}
                            className="mr-2 inline-block bg-green-500 text-white py-1 px-3 rounded hover:bg-green-400"
                        >
                            Yes
                        </button>
                        <button 
                            onClick={() => setShowConfirmation(false)}
                            className="inline-block bg-red-500 text-white py-1 px-3 rounded hover:bg-red-400"
                        >
                            No
                        </button>
                    </div>
                )}

                {showRejectReasons && (
                    <div className="mt-4">
                        <label htmlFor="rejection-reason" className="block mb-2">Reasons for Rejection:</label>
                        <select 
                            id="rejection-reason" 
                            value={selectedReason} 
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedReason(value);
                                if (value !== "Others") {
                                    setOtherReason(''); // Reset other reason if an option is selected
                                }
                            }}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select a reason</option>
                            {rejectionReasons.map((reason, index) => (
                                <option key={index} value={reason}>{reason}</option>
                            ))}
                        </select>
                        {selectedReason === "Others" && (
                            <input 
                                type="text" 
                                value={otherReason} 
                                onChange={(e) => setOtherReason(e.target.value)} 
                                placeholder="Please specify" 
                                className="border p-2 rounded w-full mt-2"
                            />
                        )}
                        <button 
                            onClick={submitRejectionReason}
                            className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
                        >
                            Submit
                        </button>
                    </div>
                )}

                {/* Move the rejectionMessage here, below the status */}
                {rejectionMessage && <p className="mt-2 text-red-600">{`Reason for rejection: ${rejectionMessage}`}</p>}

                <button 
                    onClick={openPDFModal} 
                    className="mt-4 inline-block bg-[#27235c] text-white py-2 px-4 rounded hover:bg-[#1f1a48]"
                >
                    <span>View Offer Letter</span>
                </button>
            </div>
        );
    };

    return (
        <div className="p-6">
           {modalVisible && offerDetails && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white shadow-lg rounded-lg p-4 relative max-w-4xl w-full">
            <h2 className="text-lg font-bold">Offer Letter</h2>
            <object
                data={`data:application/pdf;base64,${offerDetails.offerLetter}`}
                type="application/pdf"
                width="100%"
                height="600px"
            >
                <p>Your browser does not support PDF viewing. Please download the PDF <a href={`data:application/pdf;base64,${offerDetails.offerLetter}`}>here</a>.</p>
            </object>
            <button className="absolute top-2 right-2 text-xl" onClick={() => setModalVisible(false)}>✖</button>
        </div>
    </div>
)}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#27235c] mb-4">
                    Application Status - {jobTitle} 
                </h2>
                <ProgressBar
                    stages={stages}
                    currentStage={currentStage}
                    isLoading={isLoading}
                    onStageClick={handleStageClick}
                />
            </div>

            <div className="w-full border-2 border-[#27235c] rounded-lg mt-8 p-4 bg-white">
                <div className="p-3">
                    {congratulationMessage ? (
                        <h1 className="text-xl font-semibold">{congratulationMessage}</h1>
                    ) : detailsData || offerDetails ? ( 
                        <>
                            {offerDetails ? (
                                <div className="border-2 border-[#27235c] rounded-lg p-4 mb-4">
                                    {renderOfferDetails(offerDetails)}
                                </div>
                            ) : null}
                            {detailsData ? (
                                <>
                                    <h1 className="py-4 font-medium text-black/80">
                                        Current Stage: {detailsData.currentStage}
                                    </h1>
                                    <hr className="border-1 border-[#27235c] mb-4" />
                                    {renderDetails(detailsData)}
                                </>
                            ) : null}
                        </>
                    ) : (
                        <h1 className="text-xl font-semibold">No details available for this stage yet.</h1>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppliedJobDetails;


