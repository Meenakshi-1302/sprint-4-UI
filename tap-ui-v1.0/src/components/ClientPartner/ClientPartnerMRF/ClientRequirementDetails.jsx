import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
 
const ClientRequirementDetails = () => {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRequirements, setSelectedRequirements] = useState([]);
    const [expandedRequirement, setExpandedRequirement] = useState(null);
    const [subRequirements, setSubRequirements] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [matchingSubRequirementIds, setMatchingSubRequirementIds] = useState([]); // State to store matching IDs
    var organizationNameForModal = 0;
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const response = await axios.get('http://localhost:8080/tap/api/allRequirements');
                setRequirements(response.data);
            } catch (err) {
                console.error('Error fetching requirements:', err);
                setError('Failed to fetch requirement details');
            }
        };
 
        const fetchAllMrfSubRequirementIds = async () => {
            try {
                const response = await axios.get('http://localhost:8080/tap/mrf/getAllMrfSubRequirementId');
                return response.data.map(item => item.subRequirementIds);
            } catch (error) {
                console.error('Error fetching MRF sub-requirement IDs:', error);
                return [];
            }
        };
 
        const fetchAllMrf = async () => {
            try {
                const response = await axios.get('http://localhost:8080/tap/mrf/getAllMrf');
                return response.data.map(item => item.subRequirements ? item.subRequirements.subRequirementId : null).filter(id => id !== null);
            } catch (error) {
                console.error('Error fetching MRFs:', error);
                return [];
            }
        };
 
        const fetchData = async () => {
            await fetchRequirements();
            const mrfSubRequirementIds = await fetchAllMrfSubRequirementIds();
            const allMrfSubRequirementIds = await fetchAllMrf();
 
            const flattenedMrfSubRequirementIds = mrfSubRequirementIds.flat();
            const matchingIds = flattenedMrfSubRequirementIds.filter(id => allMrfSubRequirementIds.includes(id));
            setMatchingSubRequirementIds(matchingIds);
            setLoading(false);
        };
 
        fetchData();
    }, []);
 
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
 
    const handleViewDetails = (requirementsGroup) => {
        setSelectedRequirements(requirementsGroup);
        setShowDetails(true);
    };
 
    const handleViewMoreClick = async (requirementId) => {
        try {
            const response = await axios.get(`http://localhost:8080/tap/api/requirement/${requirementId}`);
            setSubRequirements(response.data.subrequirement);
            setExpandedRequirement(requirementId);
        } catch (err) {
            console.error('Error fetching sub-requirements:', err);
        }
    };
 
    const handleCreateMrfClick = (subReq, requirement) => {
        navigate('/createMrf', {
            state: {
                clientName: requirement.client.clientName,
                orgName: requirement.client.clientOrganization.organizationName,
                requirementDetails: requirement,
                subRequirementDetails: subReq
            }
        });
    };
 
    return (
        <div className="flex h-screen">
            <ClientNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-grow p-4 mt-16 -ml-36 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 ml-44">
                    {Array.from(new Set(requirements.map(req => req.client.clientOrganization.organizationName))).map(orgName => {
                        const orgRequirements = requirements.filter(req => req.client.clientOrganization.organizationName === orgName);
                        const clientName = orgRequirements[0].client.clientName; // Display client name only once
                        organizationNameForModal = orgName;
                        const clientEmail = orgRequirements[0].client.clientEmail;
 
                        return (
                            <div key={orgName} className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                                <h3 className="font-bold text-xl mb-2 text-blue-600">{orgName}</h3>
                                <p className="text-sm"><strong>Client Name:</strong> {clientName}</p>
                                <p className="text-sm"><strong>Email:</strong> {clientEmail}</p>
                                <button
                                    onClick={() => handleViewDetails(orgRequirements)}
                                    className="mt-4 px-4 py-2"
                                    style={{ backgroundColor: '#27235c', color: 'white', borderRadius: '0.25rem', shadow: '0 2px 2px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '0.5rem' }}>
                                        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
                                    </svg>
                                    View Requirements
                                </button>
                            </div>
                        );
                    })}
                </div>
                {showDetails && selectedRequirements.length > 0 && (
    <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
        onClick={() => setShowDetails(false)} 
    >
        <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()} 
        >
            <button
                onClick={() => setShowDetails(false)}
                className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
            >
                &times;
            </button>
           
            <h2 className="text-xl font-bold mb-4 text-center">{organizationNameForModal}  Requirements Details</h2>
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Budget</th>
                        <th className="border border-gray-300 p-2">Timeline</th>
                        <th className="border border-gray-300 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedRequirements.map((req) => (
                        <React.Fragment key={req.requirementId}>
                            <tr>
                                <td className="border border-gray-300 p-2">${req.budget.toFixed(2)}</td>
                                <td className="border border-gray-300 p-2">{req.timeline}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleViewMoreClick(req.requirementId)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
                                    >
                                        View More
                                    </button>
                                </td>
                            </tr>
                            {expandedRequirement === req.requirementId && subRequirements.length > 0 && (
                                <tr>
                                    <td colSpan="3" className="border border-gray-300 p-4 bg-gray-100 relative">
                                        <button
                                            onClick={() => setExpandedRequirement(null)}
                                            className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
                                        >
                                            &times;
                                        </button>
                                        <strong className="block">Sub-requirements:</strong>
                                        <ul className="mt-2">
                                            {subRequirements.map((subReq, index) => (
                                                <li key={index} className="flex justify-between items-center py-1 border-b border-gray-300">
                                                    <div>
                                                        <strong>Role:</strong> {subReq.role}, <strong>Resource Count:</strong> {subReq.resourceCount}
                                                    </div>
                                                    <button
                                                        onClick={() => handleCreateMrfClick(subReq, req)}
                                                        className={`px-2 py-1 rounded shadow ${matchingSubRequirementIds.includes(subReq.subRequirementId) ? 'bg-green-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                                                        disabled={matchingSubRequirementIds.includes(subReq.subRequirementId)}
                                                    >
                                                        {matchingSubRequirementIds.includes(subReq.subRequirementId) ? 'Created' : 'Create MRF'}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)}
            </div>
        </div>
    );
};
 
export default ClientRequirementDetails;

// // src/components/ClientPartner/ClientPartnerMRF/ClientRequirementDetails.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ClientRequirementDetails = () => {
//   const [requirements, setRequirements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedRequirements, setSelectedRequirements] = useState([]);
//   const [subRequirements, setSubRequirements] = useState([]);
//   const [expandedRequirement, setExpandedRequirement] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [matchingSubRequirementIds, setMatchingSubRequirementIds] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchRequirements = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/tap/api/allRequirements');
//         setRequirements(response.data);
//       } catch (err) {
//         console.error('Error fetching requirements:', err);
//         setError('Failed to fetch requirement details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequirements();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-600">{error}</div>;

//   const handleViewDetails = (requirementsGroup) => {
//     setSelectedRequirements(requirementsGroup);
//     setShowDetails(true);
//   };

//   const handleViewMoreClick = async (requirementId) => {
//     try {
//       const response = await axios.get(`http://localhost:8080/tap/api/requirement/${requirementId}`);
//       setSubRequirements(response.data.subrequirement);
//       setExpandedRequirement(requirementId);
//     } catch (err) {
//       console.error('Error fetching sub-requirements:', err);
//     }
//   };

//   const handleCreateMrfClick = (subReq, requirement) => {
//     navigate('/createMrf', {
//       state: {
//         clientName: requirement.client.clientName,
//         orgName: requirement.client.clientOrganization.organizationName,
//         requirementDetails: requirement,
//         subRequirementDetails: subReq
//       }
//     });
//   };

//   return (
//     <div className="mt-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {Array.from(new Set(requirements.map(req => req.client.clientOrganization.organizationName))).map(orgName => {
//           const orgRequirements = requirements.filter(req => req.client.clientOrganization.organizationName === orgName);
//           return (
//             <div key={orgName} className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
//               <h3 className="font-bold text-xl mb-2 text-blue-600">{orgName}</h3>
//               <p><strong>Client Name:</strong> {orgRequirements[0].client.clientName}</p>
//               <p><strong>Email:</strong> {orgRequirements[0].client.clientEmail}</p>
//               <button
//                 onClick={() => handleViewDetails(orgRequirements)}
//                 className="mt-4 px-4 py-2 text-white bg-[#27235C] rounded-md"
//               >
//                 View Requirements
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {showDetails && selectedRequirements.length > 0 && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center" onClick={() => setShowDetails(false)}>
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
//             <button
//               onClick={() => setShowDetails(false)}
//               className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-bold mb-4 text-center">Requirements Details</h2>
//             <table className="min-w-full border-collapse border border-gray-300 mt-4">
//               <thead>
//                 <tr>
//                   <th className="border border-gray-300 p-2">Budget</th>
//                   <th className="border border-gray-300 p-2">Timeline</th>
//                   <th className="border border-gray-300 p-2">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedRequirements.map((req) => (
//                   <React.Fragment key={req.requirementId}>
//                     <tr>
//                       <td className="border border-gray-300 p-2">${req.budget.toFixed(2)}</td>
//                       <td className="border border-gray-300 p-2">{req.timeline}</td>
//                       <td className="border border-gray-300 p-2">
//                         <button
//                           onClick={() => handleViewMoreClick(req.requirementId)}
//                           className="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
//                         >
//                           View More
//                         </button>
//                       </td>
//                     </tr>
//                     {expandedRequirement === req.requirementId && subRequirements.length > 0 && (
//                       <tr>
//                         <td colSpan="3" className="border border-gray-300 p-4 bg-gray-100">
//                           <strong>Sub-requirements:</strong>
//                           <ul className="mt-2">
//                             {subRequirements.map((subReq) => (
//                               <li key={subReq.subRequirementId}>
//                                 <strong>Role:</strong> {subReq.role}, <strong>Resource Count:</strong> {subReq.resourceCount}
//                                 <button
//                                   onClick={() => handleCreateMrfClick(subReq, req)}
//                                   className="ml-4 bg-yellow-500 text-white px-2 py-1 rounded shadow hover:bg-yellow-600"
//                                 >
//                                   Create MRF
//                                 </button>
//                               </li>
//                             ))}
//                           </ul>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClientRequirementDetails;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
 
// const ClientRequirementDetails = () => {
//     const [requirements, setRequirements] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [showDetails, setShowDetails] = useState(false);
//     const [selectedRequirements, setSelectedRequirements] = useState([]);
//     const [expandedRequirement, setExpandedRequirement] = useState(null);
//     const [subRequirements, setSubRequirements] = useState([]);
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [matchingSubRequirementIds, setMatchingSubRequirementIds] = useState([]); // State to store matching IDs
//     var organizationNameForModal = 0;
//     const navigate = useNavigate();
 
//     useEffect(() => {
//         const fetchRequirements = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/tap/api/allRequirements');
//                 setRequirements(response.data);
//             } catch (err) {
//                 console.error('Error fetching requirements:', err);
//                 setError('Failed to fetch requirement details');
//             }
//         };
 
//         // Other fetch functions stay the same ...
 
//         const fetchData = async () => {
//             await fetchRequirements();
//             // Fetching other data remains unchanged
//             setLoading(false);
//         };
 
//         fetchData();
//     }, []);
 
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div className="text-red-600">{error}</div>;
 
//     const handleViewDetails = (requirementsGroup) => {
//         setSelectedRequirements(requirementsGroup);
//         setShowDetails(true);
//     };
 
//     const handleViewMoreClick = async (requirementId) => {
//         try {
//             const response = await axios.get(`http://localhost:8080/tap/api/requirement/${requirementId}`);
//             setSubRequirements(response.data.subrequirement);
//             setExpandedRequirement(requirementId);
//         } catch (err) {
//             console.error('Error fetching sub-requirements:', err);
//         }
//     };
 
//     const handleCreateMrfClick = (subReq, requirement) => {
//         navigate('/createMrf', {
//             state: {
//                 clientName: requirement.client.clientName,
//                 orgName: requirement.client.clientOrganization.organizationName,
//                 requirementDetails: requirement,
//                 subRequirementDetails: subReq
//             }
//         });
//     };
 
//     return (
//         <div className="flex h-screen">
//             <ClientNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//             <div className="flex-grow p-4 mt-16 transition-all duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mx-auto px-4">
//                     {Array.from(new Set(requirements.map(req => req.client.clientOrganization.organizationName))).map(orgName => {
//                         const orgRequirements = requirements.filter(req => req.client.clientOrganization.organizationName === orgName);
//                         const clientName = orgRequirements[0].client.clientName; // Display client name only once
//                         organizationNameForModal = orgName;
//                         const clientEmail = orgRequirements[0].client.clientEmail;
 
//                         return (
//                             <div key={orgName} className="border rounded-lg p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
//                                 <h3 className="font-bold text-xl mb-2 text-blue-600">{orgName}</h3>
//                                 <p className="text-sm"><strong>Client Name:</strong> {clientName}</p>
//                                 <p className="text-sm"><strong>Email:</strong> {clientEmail}</p>
//                                 <button
//                                     onClick={() => handleViewDetails(orgRequirements)}
//                                     className="mt-4 w-full px-4 py-2 bg-[#27235c] text-white rounded shadow transition duration-200 hover:bg-[#202050]"
//                                 >
//                                     <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '0.5rem' }}>
//                                         <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
//                                     </svg>
//                                     View Requirements
//                                 </button>
//                             </div>
//                         );
//                     })}
//                 </div>
//                 {showDetails && selectedRequirements.length > 0 && (
//                     <div
//                         className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
//                         onClick={() => setShowDetails(false)}
//                     >
//                         <div
//                             className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <button
//                                 onClick={() => setShowDetails(false)}
//                                 className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
//                             >
//                                 &times;
//                             </button>
 
//                             <h2 className="text-xl font-bold mb-4 text-center">{organizationNameForModal} Requirements Details</h2>
//                             <table className="min-w-full border-collapse border border-gray-300 mt-4">
//                                 <thead>
//                                     <tr>
//                                         <th className="border border-gray-300 p-2">Budget</th>
//                                         <th className="border border-gray-300 p-2">Timeline</th>
//                                         <th className="border border-gray-300 p-2">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {selectedRequirements.map((req) => (
//                                         <React.Fragment key={req.requirementId}>
//                                             <tr>
//                                                 <td className="border border-gray-300 p-2">${req.budget.toFixed(2)}</td>
//                                                 <td className="border border-gray-300 p-2">{req.timeline}</td>
//                                                 <td className="border border-gray-300 p-2">
//                                                     <button
//                                                         onClick={() => handleViewMoreClick(req.requirementId)}
//                                                         className="bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
//                                                     >
//                                                         View More
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                             {expandedRequirement === req.requirementId && subRequirements.length > 0 && (
//                                                 <tr>
//                                                     <td colSpan="3" className="border border-gray-300 p-4 bg-gray-100 relative">
//                                                         <button
//                                                             onClick={() => setExpandedRequirement(null)}
//                                                             className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
//                                                         >
//                                                             &times;
//                                                         </button>
//                                                         <strong className="block">Sub-requirements:</strong>
//                                                         <ul className="mt-2">
//                                                             {subRequirements.map((subReq, index) => (
//                                                                 <li key={index} className="flex justify-between items-center py-1 border-b border-gray-300">
//                                                                     <div>
//                                                                         <strong>Role:</strong> {subReq.role}, <strong>Resource Count:</strong> {subReq.resourceCount}
//                                                                     </div>
//                                                                     <button
//                                                                         onClick={() => handleCreateMrfClick(subReq, req)}
//                                                                         className={`px-2 py-1 rounded shadow ${matchingSubRequirementIds.includes(subReq.subRequirementId) ? 'bg-green-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
//                                                                         disabled={matchingSubRequirementIds.includes(subReq.subRequirementId)}
//                                                                     >
//                                                                         {matchingSubRequirementIds.includes(subReq.subRequirementId) ? 'Created' : 'Create MRF'}
//                                                                     </button>
//                                                                 </li>
//                                                             ))}
//                                                         </ul>
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
 
// export default ClientRequirementDetails;
