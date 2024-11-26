// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ClientNavbar from '../Dashboard/ClientNavbar';
// import { Toaster, toast } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft } from 'react-icons/fa'; // Importing the arrow icon
// import avatar from "../../../assets/forum.png";

// const ClientProfileView = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [error, setError] = useState('');
//   const [organizationLogoURL, setOrganizationLogoURL] = useState('');
//   const navigate = useNavigate();
//   const clientId = sessionStorage.getItem("vendorId");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/client/client-profile-by-id/${clientId}`);
//         setProfileData(response.data);
        
//         // Handle Blob to URL for organization logo if it's present
//         const organizationLogo = response.data.clientOrganization?.organizationLogo;
//         if (organizationLogo instanceof Blob) {
//           const url = URL.createObjectURL(organizationLogo);
//           setOrganizationLogoURL(url);
//         }
//       } catch (error) {
//         setError('Error fetching data, please try again.');
//         toast.error(error.response?.data?.message || 'Error fetching data');
//       }
//     };

//     fetchData();

//     // Cleanup function to revoke the object URL when the component unmounts
//     return () => {
//       if (organizationLogoURL) {
//         URL.revokeObjectURL(organizationLogoURL);
//       }
//     };
//   }, [clientId, organizationLogoURL]);

//   const handleEditProfile = () => {
//     navigate('/clientProfileUpdate');
//   };

//   const handleGoBack = () => {
//     navigate(-1); // Navigate back one step in history
//   };

//   if (!profileData) return <div>Loading...</div>;

//   // Safely accessing the organization data
//   const clientOrganization = profileData.clientOrganization || {}; // Default to an empty object if null
//   const organizationLogoBase64 = clientOrganization.organizationLogo
//                                     ? `data:image/jpeg;base64,${clientOrganization.organizationLogo}`
//                                     : avatar;

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
//       <ClientNavbar />
//       <Toaster />

//       <div className="max-w-5xl w-full p-6 bg-white rounded-lg shadow-lg mt-16 mb-5">
//         {/* Header with Go Back Button */}
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={handleGoBack}
//             className="text-[#27235C] hover:text-[#1C1A4E] transition duration-200"
//           >
//             <FaArrowLeft size={24} />
//           </button>
//           <h1 className="text-3xl font-bold text-[#27235C] text-center flex-grow">Client Profile</h1>
//         </div>

//         {/* User Icon (Logo) */}
//         <div className="flex flex-col justify-center items-center mb-6">
//           <div className="relative">
//             <div className="w-40 h-40 rounded-full border-4 border-[#27235C] flex justify-center items-center overflow-hidden">
//               <img
//                 src={organizationLogoBase64} // Use the Blob URL or fallback to avatar
//                 alt="Organization Logo"
//                 className="object-cover w-full h-full"
//               />
//             </div>
//           </div>
//           {/* Organization Name and Client Name */}
//           <div className="text-center mt-4">
//             <h2 className="text-2xl font-bold text-[#27235C]">
//               {clientOrganization.organizationName || "Organization Name Not Available"}
//             </h2>
//             <h3 className="text-xl text-gray-400">{profileData.clientName || "Client Name Not Available"}</h3>
//           </div>
//         </div>

//         {/* Display Client Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <ProfileField label="Organization Industry" value={clientOrganization.organizationIndustry || "N/A"} />
//           <ProfileField label="Client Position" value={profileData.clientPosition || "N/A"} />
//           <ProfileField label="Organization Address" value={clientOrganization.organizationAddress || "N/A"} />
//           <ProfileField label="Organization Contact Number" value={clientOrganization.organizationContactNumber || "N/A"} />
//           <ProfileField label="Client Mobile" value={profileData.clientMobile || "N/A"} />
//           <ProfileField label="Client Email" value={profileData.clientEmail || "N/A"} />
//         </div>

//         {/* Edit Profile Button */}
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleEditProfile}
//             className="bg-[#27235C] text-white rounded-lg px-4 py-2 hover:bg-[#1C1A4E] transition duration-200"
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProfileField = ({ label, value }) => (
//   <div className="flex justify-between">
//     <span className="block font-semibold text-[#27235C]">{label}:</span>
//     <span className="block text-[#27235C]">{value}</span>
//   </div>
// );

// export default ClientProfileView;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Importing the arrow icon
import avatar from "../../../assets/forum.png";
import { Menu, SunMoon, Languages, List, FilePlus, Key, LayoutDashboard } from "lucide-react";
import Logo from "../../../assets/RelevantzBlue.PNG";

const ClientProfileView = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [organizationLogoURL, setOrganizationLogoURL] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const navigate = useNavigate();
  const clientId = sessionStorage.getItem("vendorId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/client/client-profile-by-id/${clientId}`);
        setProfileData(response.data);
        
        // Handle Blob to URL for organization logo if it's present
        const organizationLogo = response.data.clientOrganization?.organizationLogo;
        if (organizationLogo instanceof Blob) {
          const url = URL.createObjectURL(organizationLogo);
          setOrganizationLogoURL(url);
        }
      } catch (error) {
        setError('Error fetching data, please try again.');
        toast.error(error.response?.data?.message || 'Error fetching data');
      }
    };

    fetchData();

    // Cleanup function to revoke the object URL when the component unmounts
    return () => {
      if (organizationLogoURL) {
        URL.revokeObjectURL(organizationLogoURL);
      }
    };
  }, [clientId, organizationLogoURL]);

  const handleEditProfile = () => {
    navigate('/clientProfileUpdate');
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in history
  };

  // Render loading state
  if (!profileData) return <div>Loading...</div>;

  // Safely accessing the organization data
  const clientOrganization = profileData.clientOrganization || {}; // Default to an empty object if null
  const organizationLogoBase64 = clientOrganization.organizationLogo
                                    ? `data:image/jpeg;base64,${clientOrganization.organizationLogo}`
                                    : avatar;

  // Sidebar Component
  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? "w-64" : "w-16"}`}
      style={{ backgroundColor: "#27235C" }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-10 mr-10 mt-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>
          {isSidebarOpen && (
            <img
              src={Logo}
              alt="Organization Logo"
              className="ml-3 mr-2 h-12 mt-3"
            />
          )}
        </div>
        <nav>
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: LayoutDashboard,
              path: "/clientdashboard",
            },
            {
              id: "post-requirements",
              label: "Post Requirements",
              icon: FilePlus,
              path: "/requirement",
            },
            {
              id: "view-requirements",
              label: "View All Requirements",
              icon: List,
              path: "/jobRequirementsTable",
            },
            {
              id: "reset-password",
              label: "Reset Password",
              icon: Key,
              path: "/resetpassword",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"}`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className={`flex bg-gray-100 h-screen ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
      <Sidebar />
      <div className="flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold text-gray-800">Client Profile</h1>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <SunMoon className="w-6 h-6" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Languages className="w-6 h-6" />
              </button>
              <div style={{ position: "relative", zIndex: 50 }}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                </button>
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      marginTop: "8px",
                      width: "192px",
                      background: "white",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      padding: "8px",
                    }}
                  >
                    <a href="clientprofileview" style={{ display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none" }}>
                      {/* Profile link */}
                      Profile
                    </a>
                    <a href="#" style={{ display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none" }}>
                      {/* Inbox link */}
                      Inbox
                    </a>
                    <a href="/" onClick={() => {
                      sessionStorage.clear();
                      navigate("/login");
                    }} style={{ display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none" }}>
                      {/* Logout link */}
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Toaster />

        <div className="max-w-5xl w-full p-6 bg-white rounded-lg shadow-lg mt-2 ml-36 mb-5">
          {/* Header with Go Back Button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleGoBack}
              className="text-[#27235C] hover:text-[#1C1A4E] transition duration-200"
            >
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-[#27235C] text-center flex-grow">Client Profile</h1>
          </div>

          {/* User Icon (Logo) */}
          <div className="flex flex-col justify-center items-center mb-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-[#27235C] flex justify-center items-center overflow-hidden">
                <img
                  src={organizationLogoBase64} // Use the Blob URL or fallback to avatar
                  alt="Organization Logo"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            {/* Organization Name and Client Name */}
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-[#27235C]">
                {clientOrganization.organizationName || "Organization Name Not Available"}
              </h2>
              <h3 className="text-xl text-gray-400">{profileData.clientName || "Client Name Not Available"}</h3>
            </div>
          </div>

          {/* Display Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileField label="Organization Industry" value={clientOrganization.organizationIndustry || "N/A"} />
            <ProfileField label="Client Position" value={profileData.clientPosition || "N/A"} />
            <ProfileField label="Organization Address" value={clientOrganization.organizationAddress || "N/A"} />
            <ProfileField label="Organization Contact Number" value={clientOrganization.organizationContactNumber || "N/A"} />
            <ProfileField label="Client Mobile" value={profileData.clientMobile || "N/A"} />
            <ProfileField label="Client Email" value={profileData.clientEmail || "N/A"} />
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleEditProfile}
              className="bg-[#27235C] text-white rounded-lg px-4 py-2 hover:bg-[#1C1A4E] transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="block font-semibold text-[#27235C]">{label}:</span>
    <span className="block text-[#27235C]">{value}</span>
  </div>
);

export default ClientProfileView;