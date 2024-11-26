// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getUsers } from '../../services/Client/ClientService';
// import { setUsers } from '../../redux/actions/Client/ClientAction';
// import ClientNavbar from '../../components/client/ClientNavbar';
 
// const ClientView = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const users = useSelector(state => state.users.users);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [orgSearchQuery, setOrgSearchQuery] = useState('');
//   const [clientSearchQuery, setClientSearchQuery] = useState('');
 
//   // Fetch users when the component mounts
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getUsers();
//         dispatch(setUsers(response.data));
//         console.log("Setting users:", response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
 
//     fetchUsers();
//   }, [dispatch]);
 
//   const handleEdit = (id) => {
//     console.log('Edit user with id:', id);
//   };
 
//   const handleDelete = (id) => {
//     console.log('Delete user with id:', id);
//   };
 
//   const handleInfo = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };
 
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };
 
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Pending':
//         return '#ff751a';
//       case 'Approved':
//         return '#009933';
//       case 'Rejected':
//         return '#e60000';
//       default:
//         return 'black';
//     }
//   };
 
//   const filteredUsers = users.filter(user =>
//     user.clientOrganization?.organizationName?.toLowerCase().includes(orgSearchQuery.toLowerCase()) &&
//     user.clientName?.toLowerCase().includes(clientSearchQuery.toLowerCase())
//   );
 
//   return (
//     <div className="flex flex-col h-screen">
//       <ClientNavbar />
//       <div className="flex-grow p-4 bg-gradient-to-b from-gray-100 to-gray-200 mt-20 overflow-auto">
//         <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Clients List</h2>
 
//         {/* Search Inputs and Add Client Button */}
//         <div className="mb-6 flex justify-center space-x-4">
//           <input
//             type="text"
//             placeholder="Search by organization name"
//             className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//             value={orgSearchQuery}
//             onChange={(e) => setOrgSearchQuery(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Search by client name"
//             className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//             value={clientSearchQuery}
//             onChange={(e) => setClientSearchQuery(e.target.value)}
//           />
//           <button
//             onClick={() => navigate('/clientcreation')}
//             className="px-4 py-2 text-white rounded-md bg-[#27235C] transition duration-300 transform hover:scale-105"
//           >
//             Add Client
//           </button>
//         </div>
 
//         {/* Displaying Filtered Users */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-5">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map(user => (
//               <div key={user.clientId} className="relative border rounded-lg bg-white shadow-xl transition-all duration-300 transform hover:translate-y-1 hover:shadow-2xl">
//                 <div className="p-4">
//                   <div className="absolute top-2 right-2">
//                     <button onClick={() => handleInfo(user)} className="text-blue-600 hover:text-blue-800 transition duration-200">
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
//                       </svg>
//                     </button>
//                   </div>
//                   <h2 className="font-semibold text-xl text-gray-800">
//                     <span className="text-gray-600">Organization:</span>
//                     <span className="font-bold text-[#000080]"> {user.clientOrganization?.organizationName || 'No Organization'}</span>
//                   </h2>
//                   <h4 className="font-semibold text-gray-700 mt-1">
//                     <span className="text-gray-600">Client:</span>
//                     <span className="font-bold text-[#000080]"> {user.clientName}</span>
//                   </h4>
//                   <p className="text-gray-500">{user.clientEmail}</p>
//                   <p style={{ color: getStatusColor(user.clientStatus) }} className="font-semibold mt-1" title={user.clientStatus}>
//                     {user.clientStatus}
//                   </p>
//                 </div>
               
//                 {/* Action Buttons */}
//                 <div className="flex space-x-4 p-4 border-t">
//                   <button onClick={() => handleEdit(user.clientId)} className="text-green-600 hover:text-green-700 transition duration-200 flex items-center">
//                     <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M3 17.25V21h3.75l12.75-12.75-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.42l-3.29-3.29a1 1 0 00-1.42 0l-1.41 1.41 4.7 4.7 1.42-1.42z" />
//                     </svg>
//                     Edit
//                   </button>
//                   <button onClick={() => handleDelete(user.clientId)} className="text-red-600 hover:text-red-800 transition duration-200 flex items-center">
//                     <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M3 6h18l-1.5 12H4.5L3 6zm2-4h12a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
//                     </svg>
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center text-gray-500">No users found</div>
//           )}
//         </div>
 
//         {/* User Details Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//               <h3 className="text-lg font-semibold">Client Details</h3>
//               <div className="mt-4 space-y-2">
//                 <p><strong>Client Name:</strong> {selectedUser?.clientName}</p>
//                 <p><strong>Client Email:</strong> {selectedUser?.clientEmail}</p>
//                 <p><strong>Mobile Number:</strong> {selectedUser?.clientMobile}</p>
//                 <p><strong>Client Position:</strong> {selectedUser?.clientPosition}</p>
//                 <p><strong>Status:</strong> {selectedUser?.clientStatus}</p>
//                 <p><strong>Created:</strong> {selectedUser?.createdAt}</p>
//                 <p><strong>Organization Name:</strong> {selectedUser.clientOrganization?.organizationName || 'N/A'}</p>
//                 <p><strong>Organization Address:</strong> {selectedUser.clientOrganization?.organizationAddress || 'N/A'}</p>
//                 <p><strong>Industry Type:</strong> {selectedUser.clientOrganization?.organizationIndustry || 'N/A'}</p>
//                 <p><strong>Organization Contact Number:</strong> {selectedUser.clientOrganization?.organizationContactNumber || 'N/A'}</p>
//                 <p><strong>Organization Email:</strong> {selectedUser.clientOrganization?.organizationEmail || 'N/A'}</p>
//                 {selectedUser.clientOrganization?.organizationLogo && (
//                   <div className="flex items-center">
//                     <strong>Organization Logo:</strong>
//                     <img
//                       src={`data:image/png;base64,${selectedUser.clientOrganization.organizationLogo}`}
//                       alt="Organization Logo"
//                       className="h-16 w-16 ml-2 rounded-full"
//                     />
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end mt-4">
//                 <button onClick={closeModal} className="px-4 py-2 bg-[#27235C] text-white rounded-md hover:bg-[#1E1A4C] transition duration-200">
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
 
// export default ClientView;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getUsers } from '../../../services/ClientPartner/ClientService';
// import { setUsers } from '../../../redux/actions/ClientPartner/Client/ClientAction';
// import ClientPartnerNavbar from '../../NavbarComponent/ClientPartnerNavbar';
 
// const ClientView = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const users = useSelector(state => state.users.users);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [orgSearchQuery, setOrgSearchQuery] = useState('');
//     const [clientSearchQuery, setClientSearchQuery] = useState('');
//     const [sidebarOpen, setSidebarOpen] = useState(true); // Initial state for sidebar
 
//     // Fetch users when the component mounts
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await getUsers();
//                 dispatch(setUsers(response.data));
//                 console.log("Setting users:", response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };
 
//         fetchUsers();
//     }, [dispatch]);
 
//     const handleEdit = (id) => {
//         console.log('Edit user with id:', id);
//     };
 
//     const handleDelete = (id) => {
//         console.log('Delete user with id:', id);
//     };
 
//     const handleInfo = (user) => {
//         setSelectedUser(user);
//         setIsModalOpen(true);
//     };
 
//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedUser(null);
//     };
 
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'Pending':
//                 return '#ff751a';
//             case 'Approved':
//                 return '#009933';
//             case 'Rejected':
//                 return '#e60000';
//             default:
//                 return 'black';
//         }
//     };
 
//     const filteredUsers = users.filter(user =>
//         user.clientOrganization?.organizationName?.toLowerCase().includes(orgSearchQuery.toLowerCase()) &&
//         user.clientName?.toLowerCase().includes(clientSearchQuery.toLowerCase())
//     );
 
//     return (
//         <div className="flex h-screen">
//             {/* Sidebar (ClientNavbar) */}
//             <ClientPartnerNavbar
//                 sidebarOpen={sidebarOpen}
//                 setSidebarOpen={setSidebarOpen}
//             />
//             <div
//                 className={`flex-grow p-4 mt-16 transition-all duration-300 `}
//                 style={{ backgroundColor: '#eeeeee' }}
//             >
//                 <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-6">Clients List</h2>
 
//                 <div className="mb-6 flex justify-center space-x-4">
//                     <input
//                         type="text"
//                         placeholder="Search by organization name"
//                         className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                         value={orgSearchQuery}
//                         onChange={(e) => setOrgSearchQuery(e.target.value)}
//                     />
//                     <input
//                         type="text"
//                         placeholder="Search by client name"
//                         className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                         value={clientSearchQuery}
//                         onChange={(e) => setClientSearchQuery(e.target.value)}
//                     />
//                     <button
//                         onClick={() => {
//                             window.location.href = '/clientcreation'; // Route change can be handled by react-router instead
//                         }}
//                         className="px-4 py-2 text-white rounded-md bg-[#27235C] transition duration-300 transform hover:scale-105"
//                     >
//                         Add Client
//                     </button>
//                 </div>
 
//                 {/* Displaying Filtered Users */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-5">
//                     {filteredUsers.length > 0 ? (
//                         filteredUsers.map(user => (
//                             <div key={user.clientId} className="relative border rounded-lg bg-white shadow-xl transition-all duration-300 transform hover:translate-y-1 hover:shadow-2xl flex flex-col">
//                                 {/* Button positioned at the top right */}
//                                 <button
//                                     onClick={() => handleInfo(user)}
//                                     className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition duration-200 flex items-center"
//                                 >
//                                     {/* Info icon */}
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                                         <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
//                                     </svg>
//                                 </button>
                               
//                                 <div className="p-4 flex-grow">
//                                     <h2 className="font-semibold text-xl text-gray-800">
//                                         <span className="text-gray-600">Organization:</span>
//                                         <span className="font-bold text-[#000080]"> {user.clientOrganization?.organizationName || 'No Organization'}</span>
//                                     </h2>
//                                     <h4 className="font-semibold text-gray-700 mt-1">
//                                         <span className="text-gray-600">Client:</span>
//                                         <span className="font-bold text-[#000080]"> {user.clientName}</span>
//                                     </h4>
//                                     <p className="text-gray-500">{user.clientEmail}</p>
//                                     <p style={{ color: getStatusColor(user.clientStatus) }} className="font-semibold mt-1" title={user.clientStatus}>
//                                         {user.clientStatus}
//                                     </p>
//                                 </div>
 
//                                 {/* Action Buttons */}
//                                 <div className="flex space-x-4 p-4 border-t">
//                                     <button onClick={() => handleEdit(user.clientId)} className="text-green-600 hover:text-green-700 transition duration-200 flex items-center">
//                                         {/* Edit icon */}
//                                         <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                                             <path d="M3 17.25V21h3.75l12.75-12.75-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.42l-3.29-3.29a1 1 0 00-1.42 0l-1.41 1.41 4.7 4.7 1.42-1.42z" />
//                                         </svg>
//                                     </button>
//                                     <button onClick={() => handleDelete(user.clientId)} className="text-red-600 hover:text-red-800 transition duration-200 flex items-center">
//                                         {/* Delete icon */}
//                                         <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                                             <path d="M3 6h18l-1.5 12H4.5L3 6zm2-4h12a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
//                                         </svg>
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="col-span-full text-center text-gray-500">No users found</div>
//                     )}
//                 </div>
 
//                 {/* User Details Modal */}
//                 {isModalOpen && (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                         <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md border border-gray-300">
//                             <div className="flex flex-col items-center">
//                                 <h3 className="text-xl font-semibold text-gray-800 mb-4">Client Details</h3>
//                                 {/* Organization Logo */}
//                                 {selectedUser.clientOrganization?.organizationLogo && (
//                                     <img
//                                         src={`data:image/png;base64,${selectedUser.clientOrganization.organizationLogo}`}
//                                         alt="Organization Logo"
//                                         className="h-24 w-24 rounded-full border border-gray-300 mb-4 shadow-md"
//                                     />
//                                 )}
//                             </div>
//                             <div className="space-y-3">
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Client Name:</span>
//                                     <span>{selectedUser?.clientName}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Client Email:</span>
//                                     <span>{selectedUser?.clientEmail}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Mobile Number:</span>
//                                     <span>{selectedUser?.clientMobile}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Client Position:</span>
//                                     <span>{selectedUser?.clientPosition}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Status:</span>
//                                     <span style={{ color: getStatusColor(selectedUser?.clientStatus) }}>{selectedUser?.clientStatus}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Created:</span>
//                                     <span>{new Date(selectedUser?.createdAt).toLocaleDateString()}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Organization Name:</span>
//                                     <span>{selectedUser.clientOrganization?.organizationName || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Organization Address:</span>
//                                     <span>{selectedUser.clientOrganization?.organizationAddress || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Industry Type:</span>
//                                     <span>{selectedUser.clientOrganization?.organizationIndustry || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Organization Contact Number:</span>
//                                     <span>{selectedUser.clientOrganization?.organizationContactNumber || 'N/A'}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="font-medium">Organization Email:</span>
//                                     <span>{selectedUser.clientOrganization?.organizationEmail || 'N/A'}</span>
//                                 </div>
//                             </div>
//                             <div className="flex justify-end mt-6">
//                                 <button onClick={closeModal} className="px-5 py-2 bg-[#27235C] text-white rounded-md hover:bg-[#1E1A4C] transition duration-200 shadow-md transform hover:scale-105">
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
 
// export default ClientView;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getUsers } from '../../../services/ClientPartner/ClientService';
// import { setUsers } from '../../../redux/actions/ClientPartner/Client/ClientAction';
// import ClientPartnerNavbar from '../../NavbarComponent/ClientPartnerNavbar';

// const ClientView = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const users = useSelector(state => state.users.users);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [orgSearchQuery, setOrgSearchQuery] = useState('');
//     const [clientSearchQuery, setClientSearchQuery] = useState('');
//     const [sidebarOpen, setSidebarOpen] = useState(false); // Initial state for sidebar
//     const [loading, setLoading] = useState(true); // Loading state for fetching users

//     // Fetch users when the component mounts
//     useEffect(() => {
//         const fetchUsers = async () => {
//             setLoading(true); // Set loading to true when starting to fetch
//             try {
//                 const response = await getUsers();
//                 dispatch(setUsers(response.data));
//                 console.log("Setting users:", response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             } finally {
//                 setLoading(false); // Set loading to false after fetching completes
//             }
//         };

//         fetchUsers();
//     }, [dispatch]);

//     const handleEdit = (id) => {
//         console.log('Edit user with id:', id);
//     };

//     const handleDelete = (id) => {
//         console.log('Delete user with id:', id);
//     };

//     const handleInfo = (user) => {
//         setSelectedUser(user);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedUser(null);
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'Pending':
//                 return '#ff751a';
//             case 'Approved':
//                 return '#009933';
//             case 'Rejected':
//                 return '#e60000';
//             default:
//                 return 'black';
//         }
//     };

//     const filteredUsers = users.filter(user =>
//         user.clientOrganization?.organizationName?.toLowerCase().includes(orgSearchQuery.toLowerCase()) &&
//         user.clientName?.toLowerCase().includes(clientSearchQuery.toLowerCase())
//     );

//     return (
//         <div className="flex h-screen">
//             {/* Sidebar (ClientPartnerNavbar) */}
//             <ClientPartnerNavbar
//                 sidebarOpen={sidebarOpen}
//                 setSidebarOpen={setSidebarOpen}
//             />
//             {/* Main Content Area */}
//             <div
//                 className={`flex-grow p-4 mt-16 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
//                 style={{ backgroundColor: '#eeeeee' }}
//             >
//                 <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-6">Clients List</h2>

//                 {loading ? (
//                     <div className="text-center">Loading...</div> // Loading state
//                 ) : (
//                     <>
//                         <div className="mb-6 flex justify-center space-x-4">
//                             <input
//                                 type="text"
//                                 placeholder="Search by organization name"
//                                 className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                                 value={orgSearchQuery}
//                                 onChange={(e) => setOrgSearchQuery(e.target.value)}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Search by client name"
//                                 className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                                 value={clientSearchQuery}
//                                 onChange={(e) => setClientSearchQuery(e.target.value)}
//                             />
//                             <button
//                                 onClick={() => { navigate('/clientcreation'); }}
//                                 className="px-4 py-2 text-white rounded-md bg-[#27235C] transition duration-300 transform hover:scale-105"
//                             >
//                                 Add Client
//                             </button>
//                         </div>

//                         {/* Displaying Filtered Users */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-5">
//                             {filteredUsers.length > 0 ? (
//                                 filteredUsers.map(user => (
//                                     <div key={user.clientId} className="relative border rounded-lg bg-white shadow-xl transition-all duration-300 transform hover:translate-y-1 hover:shadow-2xl">
//                                         <button onClick={() => handleInfo(user)} className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition duration-200">
//                                             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                                                 <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
//                                             </svg>
//                                         </button>
//                                         <div className="p-4">
//                                             <h2 className="font-semibold text-xl text-gray-800">
//                                                 <span className="text-gray-600">Organization:</span>
//                                                 <span className="font-bold text-[#000080]"> {user.clientOrganization?.organizationName || 'No Organization'}</span>
//                                             </h2>
//                                             <h4 className="font-semibold text-gray-700 mt-1">
//                                                 <span className="text-gray-600">Client:</span>
//                                                 <span className="font-bold text-[#000080]"> {user.clientName}</span>
//                                             </h4>
//                                             <p className="text-gray-500">{user.clientEmail}</p>
//                                             <p style={{ color: getStatusColor(user.clientStatus) }} className="font-semibold mt-1" title={user.clientStatus}>
//                                                 {user.clientStatus}
//                                             </p>
//                                         </div>
//                                         <div className="flex space-x-4 p-4 border-t">
//                                             <button onClick={() => handleEdit(user.clientId)} className="text-green-600 hover:text-green-700 transition duration-200 flex items-center">
//                                                 <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M3 17.25V21h3.75l12.75-12.75-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.42l-3.29-3.29a1 1 0 00-1.42 0l-1.41 1.41 4.7 4.7 1.42-1.42z" />
//                                                 </svg>
//                                                 Edit
//                                             </button>
//                                             <button onClick={() => handleDelete(user.clientId)} className="text-red-600 hover:text-red-800 transition duration-200 flex items-center">
//                                                 <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                                                     <path d="M3 6h18l-1.5 12H4.5L3 6zm2-4h12a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
//                                                 </svg>
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="col-span-full text-center text-gray-500">No users found</div>
//                             )}
//                         </div>

//                         {/* User Details Modal */}
//                         {isModalOpen && (
//                             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//                                 <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md border border-gray-300">
//                                     <h3 className="text-xl font-semibold mb-4">Client Details</h3>
//                                     <div className="space-y-3">
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Client Name:</span>
//                                             <span>{selectedUser?.clientName}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Client Email:</span>
//                                             <span>{selectedUser?.clientEmail}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Mobile Number:</span>
//                                             <span>{selectedUser?.clientMobile}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Client Position:</span>
//                                             <span>{selectedUser?.clientPosition}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Status:</span>
//                                             <span style={{ color: getStatusColor(selectedUser?.clientStatus) }}>
//                                                 {selectedUser?.clientStatus}
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Created:</span>
//                                             <span>{new Date(selectedUser?.createdAt).toLocaleDateString()}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Organization Name:</span>
//                                             <span>{selectedUser.clientOrganization?.organizationName || 'N/A'}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Organization Address:</span>
//                                             <span>{selectedUser.clientOrganization?.organizationAddress || 'N/A'}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Industry Type:</span>
//                                             <span>{selectedUser.clientOrganization?.organizationIndustry || 'N/A'}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Organization Contact Number:</span>
//                                             <span>{selectedUser.clientOrganization?.organizationContactNumber || 'N/A'}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="font-medium">Organization Email:</span>
//                                             <span>{selectedUser.clientOrganization?.organizationEmail || 'N/A'}</span>
//                                         </div>
//                                     </div>
//                                     <div className="flex justify-end mt-6">
//                                         <button onClick={closeModal} className="px-5 py-2 bg-[#27235C] text-white rounded-md hover:bg-[#1E1A4C] transition duration-200 shadow-md transform hover:scale-105">
//                                             Close
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ClientView;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../../services/ClientPartner/ClientService';
import { setUsers } from '../../../redux/actions/ClientPartner/Client/ClientAction';
import ClientPartnerNavbar from '../../NavbarComponent/ClientPartnerNavbar';
 
const ClientView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(state => state.users.users);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orgSearchQuery, setOrgSearchQuery] = useState('');
    const [clientSearchQuery, setClientSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Initial state for sidebar
    const [loading, setLoading] = useState(true); // Loading state for fetching users
 
    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Set loading to true when starting to fetch
            try {
                const response = await getUsers();
                dispatch(setUsers(response.data));
                console.log("Setting users:", response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching completes
            }
        };
 
        fetchUsers();
    }, [dispatch]);
 
    const handleEdit = (id) => {
        console.log('Edit user with id:', id);
    };
 
    const handleDelete = (id) => {
        console.log('Delete user with id:', id);
    };
 
    const handleInfo = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
 
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };
 
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#ff751a';
            case 'Approved':
                return '#009933';
            case 'Rejected':
                return '#e60000';
            default:
                return 'black';
        }
    };
 
    const filteredUsers = users.filter(user =>
        user.clientOrganization?.organizationName?.toLowerCase().includes(orgSearchQuery.toLowerCase()) &&
        user.clientName?.toLowerCase().includes(clientSearchQuery.toLowerCase())
    );
 
    return (
        <div className="flex h-screen">
            {/* Sidebar (ClientPartnerNavbar) */}
            <ClientPartnerNavbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            {/* Main Content Area */}
            <div
                className={`flex-grow pl-8 mt-16 -ml-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
           >
                 <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 mt-20 md:mt-6">Clients List</h2>
                {loading ? (
                    <div className="text-center">Loading...</div> // Loading state
                ) : (
                    <>
                        <div className="mb-6 flex justify-center space-x-4">
                            <input
                                type="text"
                                placeholder="Search by organization name"
                                className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={orgSearchQuery}
                                onChange={(e) => setOrgSearchQuery(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Search by client name"
                                className="border border-gray-300 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                value={clientSearchQuery}
                                onChange={(e) => setClientSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={() => { navigate('/clientcreation'); }}
                                className="px-4 py-2 text-white rounded-md bg-[#27235C] transition duration-300 transform hover:scale-105"
                            >
                                Add Client
                            </button>
                        </div>
 
                        {/* Displaying Filtered Users */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <div key={user.clientId} className="relative border rounded-lg bg-white shadow-xl transition-all duration-300 transform hover:translate-y-1 hover:shadow-2xl">
                                        <button onClick={() => handleInfo(user)} className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition duration-200">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
                                            </svg>
                                        </button>
                                        <div className="p-4">
                                            <h2 className="font-semibold text-xl text-gray-800">
                                                <span className="text-gray-600">Organization:</span>
                                                <span className="font-bold text-[#000080]"> {user.clientOrganization?.organizationName || 'No Organization'}</span>
                                            </h2>
                                            <h4 className="font-semibold text-gray-700 mt-1">
                                                <span className="text-gray-600">Client:</span>
                                                <span className="font-bold text-[#000080]"> {user.clientName}</span>
                                            </h4>
                                            <p className="text-gray-500">{user.clientEmail}</p>
                                            <p style={{ color: getStatusColor(user.clientStatus) }} className="font-semibold mt-1" title={user.clientStatus}>
                                                {user.clientStatus}
                                            </p>
                                        </div>
                                        <div className="flex space-x-4 p-4 border-t">
                                            <button onClick={() => handleEdit(user.clientId)} className="text-green-600 hover:text-green-700 transition duration-200 flex items-center">
                                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 17.25V21h3.75l12.75-12.75-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.42l-3.29-3.29a1 1 0 00-1.42 0l-1.41 1.41 4.7 4.7 1.42-1.42z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(user.clientId)} className="text-red-600 hover:text-red-800 transition duration-200 flex items-center">
                                                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M3 6h18l-1.5 12H4.5L3 6zm2-4h12a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500">No users found</div>
                            )}
                        </div>
 
                        {/* User Details Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md border border-gray-300">
                                    <h3 className="text-xl font-semibold mb-4">Client Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Client Name:</span>
                                            <span>{selectedUser?.clientName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Client Email:</span>
                                            <span>{selectedUser?.clientEmail}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Mobile Number:</span>
                                            <span>{selectedUser?.clientMobile}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Client Position:</span>
                                            <span>{selectedUser?.clientPosition}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Status:</span>
                                            <span style={{ color: getStatusColor(selectedUser?.clientStatus) }}>
                                                {selectedUser?.clientStatus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Created:</span>
                                            <span>{new Date(selectedUser?.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Organization Name:</span>
                                            <span>{selectedUser.clientOrganization?.organizationName || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Organization Address:</span>
                                            <span>{selectedUser.clientOrganization?.organizationAddress || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Industry Type:</span>
                                            <span>{selectedUser.clientOrganization?.organizationIndustry || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Organization Contact Number:</span>
                                            <span>{selectedUser.clientOrganization?.organizationContactNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Organization Email:</span>
                                            <span>{selectedUser.clientOrganization?.organizationEmail || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button onClick={closeModal} className="px-5 py-2 bg-[#27235C] text-white rounded-md hover:bg-[#1E1A4C] transition duration-200 shadow-md transform hover:scale-105">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
 
export default ClientView;
