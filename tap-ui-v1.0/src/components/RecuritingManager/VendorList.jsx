// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import VendorModal from './VendorModal';
// import MRFModal from './MRFModal';
// import VendorDetailModal from './VendorDetailModal';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash, faClipboardList, faUsers, faClipboardCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
// import DeleteModal from './DeleteModal';
// import { deleteVendorById, getAllVendor, getSingleVendor } from '../../services/RecruitingManager/VendorService';
// import RecruitingManagerNavbar from './RecruitingManagerNavbar';
// import { getMrfsResponse } from '../../services/RecruitingManager/MRFService';


// const VendorList = () => {
//   const navigate = useNavigate();
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
//   const [isMRFModalOpen, setIsMRFModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [currentVendor, setCurrentVendor] = useState(null);
//   const [vendorToDelete, setVendorToDelete] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [mrfSearchTerm, setMrfSearchTerm] = useState('');
//   const [hoveredVendorId, setHoveredVendorId] = useState(null);
//   const [vendorDetails, setVendorDetails] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [mrfData, setMrfData] = useState([]);
//   const rmId = sessionStorage.getItem('employeeId') || 1;
//   const itemsPerPage = 3;
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // Toggle function for sidebar
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const response = await getAllVendor();
//         const sortedVendors = response.data.sort((a, b) => b.vendorId - a.vendorId);
//         setVendors(sortedVendors);
//         console.log(response.data);
//       } catch (error) {
//         console.error('Error fetching vendor data:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVendors();
//   }, []);

// useEffect(()=>{
//   const fetchAllMrfs = async (rmId) => {
//     try {
//         const response = await getMrfsResponse(rmId);
//         const sortedMrfs = response.data.sort((a, b) => b.mrfRecruitingManagerId - a.mrfRecruitingManagerId);
//         setMrfData(sortedMrfs);
//         console.log(response.data);

//     } catch (error) {
//         console.error('Error fetching MRF data:', error);
//     } finally {
//         setLoading(false);
//     }
// };
//   fetchAllMrfs(rmId);
// }, []);

//   const handleEdit = async (vendorId) => {
//     try {
//       const response = await getSingleVendor(vendorId);
//       setCurrentVendor(response.data);
//       setIsModalOpen(true);
//       lockScroll();
//     } catch (error) {
//       console.error('Error fetching vendor details:', error);
//       setError(error.message);
//     }
//   };

//   const handleDelete = (vendor) => {
//     setVendorToDelete(vendor);
//     setIsConfirmModalOpen(true);
//     lockScroll();
//   };

//   const confirmDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await deleteVendorById(vendorToDelete.vendorId);
//       setVendors(vendors.filter(vendor => vendor.vendorId !== vendorToDelete.vendorId));
//       setVendorToDelete(null);
//       setIsConfirmModalOpen(false);
//     } catch (error) {
//       console.error('Error deleting vendor:', error);
//       setIsConfirmModalOpen(false);
//     } finally {
//       setIsDeleting(false);
//       unlockScroll();
//     }
//   };

//   const handleAssign = (vendor) => {
//     setIsMRFModalOpen(true);
//     setCurrentVendor(vendor);
//     lockScroll();
//   };

//   const handleShowDetails = async (vendorId) => {
//     try {
//       const response = await getSingleVendor(vendorId);
//       setVendorDetails(response.data);
//       setIsDetailModalOpen(true);
//       lockScroll();
//     } catch (error) {
//       console.error('Error fetching vendor details:', error);
//     }
//   };

//   const filteredVendors = vendors.filter(vendor =>
//     vendor.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
//   const displayedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const lockScroll = () => {
//     document.body.style.overflow = 'hidden';
//   };

//   const unlockScroll = () => {
//     document.body.style.overflow = 'unset';
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <>
//       <RecruitingManagerNavbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> <br />
//       <div className={`flex items-center justify-center min-h-screen bg-[#EEEEEE] p-4 flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>

//         {/* Cards Container */}
//         {/* Cards Container */}
//         <div className="mb-5 mt- grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
//           {[
//             {
//               icon: faUsers,
//               title: 'Total Vendors',
//               value: vendors.length,
//               link:"/listvendors"
//             },
//             {
//               icon: faClipboardList,
//               title: 'Available MRFs',
//               value: mrfData.length,  // Filtering for available MRFs
//               status: 'All',
//               link:"/listMrfsForRecruitingManager"
//             },
//             {
//               icon: faClipboardCheck,
//               title: 'MRFs Assigned',
//               value: vendors.filter(v => v.mrfAssigned).length,
//             },
//             {
//               icon: faTimesCircle,
//               title: 'MRFs Closed',
//               value: vendors.filter(v => v.mrfClosed).length,
//             },
//           ].map((card, index) => (
//             <div
//               key={index}
//               className="bg-[#D3D3D3] hover:bg-[#B0B0B0] transition duration-300 ease-in-out rounded-lg shadow-md p-6 flex items-center justify-center transform hover:scale-105"
//             >
//                 <Link to={card.link} >
//               <div className="flex flex-col items-center">
//                   <FontAwesomeIcon
//                     icon={card.icon}
//                     className="text-5xl text-indigo-900 transition-transform duration-300 hover:scale-125 mb-2"
//                   />
//                   <p className="text-4xl font-bold">{card.value}</p>
//                   <h3 className="text-lg font-semibold text-center">{card.title}</h3>
//               </div>
//                 </Link>
//             </div>
//           ))}
//         </div>
//         {/* Vendor List Card */}
//         <div className="w-full bg-white rounded-lg shadow-lg p-8">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Vendors List</h2>

//           <div className="mb-4 flex justify-between items-center">
//             <input
//               type="text"
//               placeholder="Search by Organization Name"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
//             />
//             <button
//               onClick={() => navigate('/VendorForm')}
//               className="bg-indigo-900 text-white py-1 px-4 rounded-lg shadow-md hover:bg-indigo-800 transition duration-200"
//             >
//               Vendor+
//             </button>
//           </div>

//           <div className="grid grid-cols-1 gap-6">
//             {displayedVendors.map((vendor) => (
//               <div
//                 key={vendor.vendorId}
//                 className="bg-white rounded-lg shadow-md p-4 relative transition duration-200 cursor-pointer"
//                 onMouseEnter={() => setHoveredVendorId(vendor.vendorId)}
//                 onMouseLeave={() => setHoveredVendorId(null)}
//                 onClick={() => handleShowDetails(vendor.vendorId)}
//               >
//                 {hoveredVendorId === vendor.vendorId && (
//                   <div className="absolute top-2 right-2 flex space-x-2">
//                     <button
//                       onClick={(e) => { e.stopPropagation(); handleEdit(vendor.vendorId); }}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <FontAwesomeIcon icon={faEdit} />
//                     </button>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); handleDelete(vendor); }}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </div>
//                 )}

//                 <h3 className="text-xl font-semibold text-gray-800">{vendor.organizationName || 'Organization Name Not Available'}</h3>
//                 <p className="text-gray-600">{vendor.email || 'Email Not Available'}</p>

//                 {hoveredVendorId === vendor.vendorId && (
//                   <button
//                     onClick={(e) => { e.stopPropagation(); handleAssign(vendor); }}
//                     className="absolute bottom-2 right-2 bg-indigo-900 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-800 transition duration-200"
//                   >
//                     Assign
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 hover:bg-green-500 transition duration-200"
//             >
//               Previous
//             </button>
//             <span className="self-center">Page {currentPage} of {totalPages}</span>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 hover:bg-blue-500 transition duration-200"
//             >
//               Next
//             </button>
//           </div>
//         </div>

//         <VendorModal
//           isOpen={isModalOpen}
//           onClose={() => { setIsModalOpen(false); unlockScroll(); }}
//           vendor={currentVendor}
//         />
//         <DeleteModal
//           isOpen={isConfirmModalOpen}
//           onClose={() => { setIsConfirmModalOpen(false); unlockScroll(); }}
//           onConfirm={confirmDelete}
//           isDeleting={isDeleting}
//         />
//         <MRFModal
//           isOpen={isMRFModalOpen}
//           onClose={() => { setIsMRFModalOpen(false); unlockScroll(); }}
//           vendorid={currentVendor}
//           searchTerm={mrfSearchTerm}
//           setSearchTerm={setMrfSearchTerm}
//         />
//         <VendorDetailModal
//           isOpen={isDetailModalOpen}
//           onClose={() => { setIsDetailModalOpen(false); unlockScroll(); }}
//           vendor={vendorDetails}
//         />
//       </div >
//     </>
//   );
// };

// export default VendorList;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VendorModal from './VendorModal';
import MRFModal from './MRFModal';
import VendorDetailModal from './VendorDetailModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faClipboardList, faUsers, faClipboardCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './DeleteModal';
import { deleteVendorById, getAllVendor, getSingleVendor } from '../../services/RecruitingManager/VendorService';
import RecruitingManagerNavbar from './RecruitingManagerNavbar';
import { getMrfsResponse } from '../../services/RecruitingManager/MRFService';


const VendorList = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMRFModalOpen, setIsMRFModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mrfSearchTerm, setMrfSearchTerm] = useState('');
  const [hoveredVendorId, setHoveredVendorId] = useState(null);
  const [vendorDetails, setVendorDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mrf, setMrf] = useState([])

  const rmId = sessionStorage.getItem('employeeId') || 1;

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {

    const fetchAllMrfs = async (rmId) => {
      try {
        const response = await getMrfsResponse(rmId);
        const sortedMrfs = response.data.sort((a, b) => b.mrfRecruitingManagerId - a.mrfRecruitingManagerId);
        setMrf(sortedMrfs);
        console.log(response.data);

      } catch (error) {
        console.error('Error fetching MRF data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await getAllVendor();
        const sortedVendors = response.data.sort((a, b) => b.vendorId - a.vendorId);
        setVendors(sortedVendors);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMrfs(rmId);
    fetchVendors();
  }, []);

  const handleEdit = async (vendorId) => {
    try {
      const response = await getSingleVendor(vendorId);
      setCurrentVendor(response.data);
      setIsModalOpen(true);
      lockScroll();
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      setError(error.message);
    }
  };

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setIsConfirmModalOpen(true);
    lockScroll();
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteVendorById(vendorToDelete.vendorId);
      setVendors(vendors.filter(vendor => vendor.vendorId !== vendorToDelete.vendorId));
      setVendorToDelete(null);
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error('Error deleting vendor:', error);
      setIsConfirmModalOpen(false);
    } finally {
      setIsDeleting(false);
      unlockScroll();
    }
  };

  const handleAssign = (vendor) => {
    setIsMRFModalOpen(true);
    setCurrentVendor(vendor);
    lockScroll();
  };

  const handleShowDetails = async (vendorId) => {
    try {
      const response = await getSingleVendor(vendorId);
      setVendorDetails(response.data);
      setIsDetailModalOpen(true);
      lockScroll();
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const displayedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const lockScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.body.style.overflow = 'unset';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <RecruitingManagerNavbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> <br />
      <div className={`flex items-center justify-center min-h-screen bg-[#EEEEEE] p-4 flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>

        {/* Cards Container */}
        {/* Cards Container */}
        <div className="mt-16 mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {[
            {
              icon: faUsers,
              title: 'Total Vendors',
              value: vendors.length,
              link: "/listvendors"
            },
            {
              icon: faClipboardList,
              title: 'Available MRF"s',
              value: mrf.length,
              link: "/listMrfsForRecruitingManager"
            },
            {
              icon: faClipboardCheck,
              title: 'MRFs Assigned',
              value: vendors.filter(v => v.mrfAssigned).length,
            },
            {
              icon: faTimesCircle,
              title: 'MRFs Closed',
              value: vendors.filter(v => v.mrfClosed).length,
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-[#D3D3D3] hover:bg-[#B0B0B0] transition duration-300 ease-in-out rounded-lg shadow-md p-6 flex items-center justify-center transform hover:scale-105"
            >
              <Link to={card.link} >
                <div className="flex flex-col items-center">
                  <FontAwesomeIcon
                    icon={card.icon}
                    className="text-5xl text-indigo-900 transition-transform duration-300 hover:scale-125 mb-2"
                  />
                  <p className="text-4xl font-bold">{card.value}</p>
                  <h3 className="text-lg font-semibold text-center">{card.title}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Vendor List Card */}
        <div className="w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Vendors List</h2>

          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by Organization Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
            />
            <button
              onClick={() => navigate('/VendorForm')}
              className="bg-indigo-900 text-white py-1 px-4 rounded-lg shadow-md hover:bg-indigo-800 transition duration-200"
            >
              Vendor+
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {displayedVendors.map((vendor) => (
              <div
                key={vendor.vendorId}
                className="bg-white rounded-lg shadow-md p-4 relative transition duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredVendorId(vendor.vendorId)}
                onMouseLeave={() => setHoveredVendorId(null)}
                onClick={() => handleShowDetails(vendor.vendorId)}
              >
                {hoveredVendorId === vendor.vendorId && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(vendor.vendorId); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(vendor); }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-800">{vendor.organizationName || 'Organization Name Not Available'}</h3>
                <p className="text-gray-600">{vendor.email || 'Email Not Available'}</p>

                {hoveredVendorId === vendor.vendorId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAssign(vendor); }}
                    className="absolute bottom-2 right-2 bg-indigo-900 text-white py-1 px-3 rounded-lg shadow-md hover:bg-indigo-800 transition duration-200"
                  >
                    Assign
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 hover:bg-green-500 transition duration-200"
            >
              Previous
            </button>
            <span className="self-center">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 hover:bg-blue-500 transition duration-200"
            >
              Next
            </button>
          </div>
        </div>

        <VendorModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); unlockScroll(); }}
          vendor={currentVendor}
        />
        <DeleteModal
          isOpen={isConfirmModalOpen}
          onClose={() => { setIsConfirmModalOpen(false); unlockScroll(); }}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
        <MRFModal
          isOpen={isMRFModalOpen}
          onClose={() => { setIsMRFModalOpen(false); unlockScroll(); }}
          vendorid={currentVendor}
          searchTerm={mrfSearchTerm}
          setSearchTerm={setMrfSearchTerm}
        />
        <VendorDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => { setIsDetailModalOpen(false); unlockScroll(); }}
          vendor={vendorDetails}
        />
      </div >
    </>
  );
};

export default VendorList;
