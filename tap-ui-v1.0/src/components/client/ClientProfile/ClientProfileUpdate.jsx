// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCamera } from '@fortawesome/free-solid-svg-icons';
// import { Toaster, toast } from 'react-hot-toast';
// import ClientNavbar from '../Dashboard/ClientNavbar';
// import { FaArrowLeft } from 'react-icons/fa';
// import avatar from '../../../assets/forum.png'; // Fallback avatar
 
// const ClientProfileUpdate = () => {
//   const navigate = useNavigate();
 
//   // Data for profile and editable fields
//   const [profileData, setProfileData] = useState(null);
//   const [editableFields, setEditableFields] = useState({
//     clientName: '',
//     organizationLogo: avatar, // Initially set to default avatar
//     organizationAddress: '',
//     clientMobile: '',
//     clientPosition: '',
//   });
 
//   // File and error state management
//   const [logoFile, setLogoFile] = useState(null);
//   const [error, setError] = useState({
//     clientName: '',
//     organizationLogo: '',
//     organizationAddress: '',
//     clientMobile: '',
//     clientPosition: '',
//     fileSize: '', // Added for file size error
//   });
 
//   const clientId = sessionStorage.getItem("vendorId")
//   // Fetch client profile data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/client/client-profile-by-id/${clientId}`);
//         const clientData = response.data;
 
//         setProfileData(clientData);
//         setEditableFields({
//           clientName: clientData.clientName || '',
//           organizationLogo: clientData.clientOrganization?.organizationLogo ?
//             `data:image/jpeg;base64,${clientData.clientOrganization.organizationLogo}` : avatar,
//           organizationAddress: clientData.clientOrganization?.organizationAddress || '',
//           clientMobile: clientData.clientMobile || '',
//           clientPosition: clientData.clientPosition || '',
//         });
//       } catch (error) {
//         console.error('Error fetching client data:', error.message);
//         setError((prev) => ({ ...prev, clientName: error.message }));
//       }
//     };
//     fetchData();
//   }, []);
 
//   // Validate the input fields
//   const validate = () => {
//     let isValid = true;
//     const validationError = {
//       clientName: '',
//       organizationLogo: '',
//       organizationAddress: '',
//       clientMobile: '',
//       clientPosition: '',
//       fileSize: '', // Added for file size validation
//     };
 
//     const nameRegex = /^[A-Za-z\s]*$/;
//     if (!nameRegex.test(editableFields.clientName) || !editableFields.clientName) {
//       validationError.clientName = 'Client Name is required';
//       isValid = false;
//     }
 
//     const mobileRegex = /^[0-9]{10}$/;
//     if (!mobileRegex.test(editableFields.clientMobile) || editableFields.clientMobile.length !== 10) {
//       validationError.clientMobile = 'Client Mobile must be exactly 10 digits';
//       isValid = false;
//     }
 
//     if (!nameRegex.test(editableFields.clientPosition) || !editableFields.clientPosition) {
//       validationError.clientPosition = 'Client Position is required';
//       isValid = false;
//     }
 
//     setError(validationError);
//     return isValid;
//   };
 
//   // Handle file input for logo
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 80000) {
//         setLogoFile(file);
//         // Set the logo URL from the newly uploaded file
//         setEditableFields((prev) => ({
//           ...prev,
//           organizationLogo: URL.createObjectURL(file),
//         }));
//         setError((prev) => ({ ...prev, organizationLogo: '', fileSize: '' })); // Reset errors
//       } else if (file.size > 80000) {
//         setError((prev) => ({ ...prev, fileSize: 'Logo must be a JPEG or PNG file under 80KB' }));
//         // Clear file size error after 3 seconds
//         setTimeout(() => {
//           setError((prev) => ({ ...prev, fileSize: '' }));
//         }, 3000);
//       } else {
//         setError((prev) => ({ ...prev, organizationLogo: 'Logo must be a JPEG or PNG file' }));
//         // Clear organization logo error after 3 seconds
//         setTimeout(() => {
//           setError((prev) => ({ ...prev, organizationLogo: '' }));
//         }, 3000);
//       }
//     }
//   };
 
//   // Handle change of input fields
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
 
//     if (name === 'clientMobile' && /^[0-9]*$/.test(value) && value.length <= 10) {
//       setEditableFields((prev) => ({ ...prev, [name]: value }));
//       if (value.length === 10) {
//         setError((prev) => ({ ...prev, clientMobile: '' }));
//       }
//     } else if ((name === 'clientName' || name === 'clientPosition') && /^[A-Za-z\s]*$/.test(value)) {
//       setEditableFields((prev) => ({ ...prev, [name]: value }));
//       if (name === 'clientName') {
//         setError((prev) => ({ ...prev, clientName: '' }));
//       } else if (name === 'clientPosition') {
//         setError((prev) => ({ ...prev, clientPosition: '' }));
//       }
//     }
//   };
 
//   // Save the uploaded logo
//   const handleSaveLogo = async () => {
//     if (logoFile && validate()) {
//       try {
//         const formData = new FormData();
//         formData.append('organizationLogo', logoFile);
 
//         const response = await axios.patch(
//           `http://localhost:8080/client/client-logo-update-by-id/${clientId}/logo`,
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
 
//         if (response.status === 200) {
//           toast.success("Logo updated successfully!");
//           // Refresh the logo in state
//           const newLogoUrl = URL.createObjectURL(logoFile);
//           setEditableFields((prev) => ({ ...prev, organizationLogo: newLogoUrl }));
//         } else {
//           toast.error("Error updating logo, please try again.");
//         }
//       } catch (error) {
//         console.error('Error updating logo:', error.response?.data || error.message);
//         toast.error("Error updating logo, please try again.");
//       }
//     }
//   };
 
//   // Save the client profile data
//   const handleSave = async () => {
//     if (validate()) {
//       await handleSaveLogo(); // First, save logo if it has been updated
 
//       try {
//         const clientId = profileData.clientId; // Get clientId from profileData
//         const dataToUpdate = {
//           clientName: editableFields.clientName,
//           organizationAddress: profileData.clientOrganization?.organizationAddress || '', // Use optional chaining
//           clientMobile: editableFields.clientMobile,
//           clientPosition: editableFields.clientPosition,
//           organizationName: profileData.clientOrganization?.organizationName || '', // Use optional chaining
//           organizationIndustry: profileData.clientOrganization?.organizationIndustry || '', // Use optional chaining
//           organizationContactNumber: profileData.clientOrganization?.organizationContactNumber || '', // Use optional chaining
//           clientEmail: profileData.clientEmail,
//         };
 
//         console.log('Updating client data:', dataToUpdate); // Debug log
 
//         const response = await axios.patch(`http://localhost:8080/client/client-profile-update-by-id/${clientId}`, dataToUpdate);
       
//         if (response.status === 200) {
//           toast.success("Profile updated successfully!");
//           navigate('/clientProfileView'); // Redirect to ClientProfileView page
//         } else {
//           toast.error("Error updating profile, please try again.");
//         }
//       } catch (error) {
//         console.error('Error updating profile:', error.response?.data || error.message);
//         toast.error("Error updating profile, please try again.");
//       }
//     }
//   };
 
//   // Cancel the operation and reset fields
//   const handleCancel = () => {
//     setEditableFields({
//       clientName: profileData?.clientName || '',
//       organizationAddress: profileData?.clientOrganization?.organizationAddress || '',
//       clientMobile: profileData?.clientMobile || '',
//       clientPosition: profileData?.clientPosition || '',
//     });
//     setError({
//       clientName: '',
//       organizationLogo: '',
//       organizationAddress: '',
//       clientMobile: '',
//       clientPosition: '',
//       fileSize: '', // Reset file size error on cancel
//     });
//     navigate(-1);
//   };
 
//   if (!profileData) return <div>Loading...</div>;
 
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
//       <ClientNavbar />
//       <Toaster />
 
//       <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg mt-16 mb-5">
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-[#27235C] hover:text-[#1C1A4E] transition duration-200"
//           >
//             <FaArrowLeft size={24} />
//           </button>
//           <h1 className="text-2xl font-bold text-[#27235C] text-center flex-grow">Profile Update</h1>
//         </div>
 
//         {/* User Icon with Camera */}
//         <div className="flex justify-center items-center mb-6">
//           <div className="relative">
//             <div className="w-32 h-32 rounded-full border-4 border-[#27235C] flex justify-center items-center overflow-hidden">
//               <img
//                 src={editableFields.organizationLogo || avatar}
//                 alt="Update your logo here"
//                 className="object-cover w-full h-full"
//               />
//             </div>
//             {/* Camera Icon for logo upload */}
//             <label className="absolute cursor-pointer bottom-0 right-0 bg-white p-1 rounded-full shadow-lg hover:bg-gray-200">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 onClick={(e) => e.stopPropagation()}
//               />
//               <FontAwesomeIcon
//                 icon={faCamera}
//                 className="text-[#27235C] text-xl"
//               />
//             </label>
//           </div>
//         </div>
 
//         {/* Display error message for file size */}
//         {error.fileSize && <p className="text-red-500">{error.fileSize}</p>} {/* Error for file size */}
 
//         {/* Editable Fields */}
//         <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <ProfileField
//               label="Client Name"
//               value={editableFields.clientName}
//               onChange={handleInputChange}
//               name="clientName"
//               error={error.clientName}
//               readonly={false}
//             />
//             <ProfileField label="Organization Name" value={profileData.clientOrganization?.organizationName || ''} readonly />
//             <ProfileField label="Organization Industry" value={profileData.clientOrganization?.organizationIndustry || ''} readonly />
//             <ProfileField
//               label="Client Position"
//               value={editableFields.clientPosition}
//               onChange={handleInputChange}
//               name="clientPosition"
//               error={error.clientPosition}
//             />
//             <ProfileField
//               label="Organization Address"
//               value={profileData.clientOrganization?.organizationAddress || ''}
//               readonly
//             />
//             <ProfileField label="Organization Contact Number" value={profileData.clientOrganization?.organizationContactNumber || ''} readonly />
//             <ProfileField
//               label="Client Mobile"
//               value={editableFields.clientMobile}
//               onChange={handleInputChange}
//               name="clientMobile"
//               error={error.clientMobile}
//             />
//             <ProfileField label="Client Email" value={profileData.clientEmail} readonly />
//           </div>
 
//           {/* Save and Cancel Buttons */}
//           <div className="flex justify-center mt-6">
//             <button
//               onClick={handleSave}
//               className="bg-[#27235E] text-white rounded-lg px-4 py-2 shadow-lg hover:bg-[#1C1A4E] mr-4"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 shadow-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
 
// // ProfileField Component
// const ProfileField = ({ label, value, onChange, name, readonly, error }) => (
//   <div>
//     <label className="block font-semibold text-[#27235C]">{label}</label>
//     <input
//       type="text"
//       value={value}
//       onChange={onChange}
//       name={name}
//       readOnly={readonly}
//       className={`w-full p-2 mt-1 rounded-lg border ${
//         readonly ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
//       } ${error ? 'border-red-500' : ''}`}
//     />
//     {error && <p className="text-red-500 text-sm">{error}</p>}
//   </div>
// );
 
// export default ClientProfileUpdate;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import avatar from '../../../assets/forum.png';
import { Menu, SunMoon, Languages, List, FilePlus, Key, LayoutDashboard } from 'lucide-react';
import Logo from '../../../assets/RelevantzBlue.PNG'; // Sidebar logo

const ClientProfileUpdate = () => {
  const [profileData, setProfileData] = useState(null);
  const [editableFields, setEditableFields] = useState({
    clientName: '',
    organizationLogo: avatar,
    organizationAddress: '',
    clientMobile: '',
    clientPosition: '',
  });
  const [error, setError] = useState({
    clientName: '',
    organizationLogo: '',
    organizationAddress: '',
    clientMobile: '',
    clientPosition: '',
    fileSize: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const clientId = sessionStorage.getItem('vendorId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/client/client-profile-by-id/${clientId}`);
        const clientData = response.data;

        setProfileData(clientData);
        setEditableFields({
          clientName: clientData.clientName || '',
          organizationLogo: clientData.clientOrganization?.organizationLogo
            ? `data:image/jpeg;base64,${clientData.clientOrganization.organizationLogo}` 
            : avatar,
          organizationAddress: clientData.clientOrganization?.organizationAddress || '',
          clientMobile: clientData.clientMobile || '',
          clientPosition: clientData.clientPosition || '',
        });
      } catch (error) {
        setError({ ...error, clientName: 'Error fetching profile data' });
        toast.error(error.response?.data?.message || 'Error fetching data');
      }
    };
    fetchData();
  }, [clientId]);

  const validateFields = () => {
    let isValid = true;
    const validationError = {
      clientName: '',
      organizationLogo: '',
      organizationAddress: '',
      clientMobile: '',
      clientPosition: '',
      fileSize: '',
    };

    const nameRegex = /^[A-Za-z\s]*$/;

    if (!nameRegex.test(editableFields.clientName) || !editableFields.clientName) {
      validationError.clientName = 'Client Name is required';
      isValid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(editableFields.clientMobile) || editableFields.clientMobile.length !== 10) {
      validationError.clientMobile = 'Client Mobile must be exactly 10 digits';
      isValid = false;
    }

    if (!nameRegex.test(editableFields.clientPosition) || !editableFields.clientPosition) {
      validationError.clientPosition = 'Client Position is required';
      isValid = false;
    }

    setError(validationError);
    return isValid;
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 80000) {
        setLogoFile(file);
        setEditableFields(prev => ({
          ...prev,
          organizationLogo: URL.createObjectURL(file),
        }));
        setError(prev => ({ ...prev, organizationLogo: '', fileSize: '' }));
      } else {
        setError(prev => ({ ...prev, fileSize: 'Logo must be a JPEG or PNG file under 80KB' }));
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditableFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (validateFields()) {
      try {
        // Save updated information
        const dataToUpdate = {
          clientName: editableFields.clientName,
          organizationAddress: editableFields.organizationAddress,
          clientMobile: editableFields.clientMobile,
          clientPosition: editableFields.clientPosition,
        };

        await axios.patch(`http://localhost:8080/client/client-profile-update-by-id/${clientId}`, dataToUpdate);
        toast.success('Profile updated successfully!');
        navigate('/clientProfileView');
      } catch (error) {
        toast.error('Error updating profile, please try again.');
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in history
  };

  // Render loading state
  if (!profileData) return <div>Loading...</div>;

  // Sidebar Component
  const Sidebar = () => (
    <div className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? "w-64" : "w-16"}`} style={{ backgroundColor: "#27235C" }}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-10 mr-10 mt-2">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
            <Menu className="w-7 h-7" />
          </button>
          {isSidebarOpen && <img src={Logo} alt="Organization Logo" className="ml-3 mr-2 h-12 mt-3" />}
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
            <button key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors hover:bg-gray-700`}>
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
            <h1 className="text-2xl font-bold text-gray-800">Profile Update</h1>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <SunMoon className="w-6 h-6" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Languages className="w-6 h-6" />
              </button>
              <div style={{ position: "relative", zIndex: 50 }}>
                <button onClick={() => setProfileDropdownOpen((prev) => !prev)}>
                  <img
                    src={avatar} // Use default avatar
                    alt="Profile"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                </button>
                {profileDropdownOpen && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    marginTop: "8px",
                    width: "192px",
                    background: "white",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    padding: "8px",
                  }}>
                    <a href="/clientprofileview" style={{
                      display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none"
                    }}>
                      Profile
                    </a>
                    <a href="/inbox" style={{
                      display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none"
                    }}>
                      Inbox
                    </a>
                    <a href="/" onClick={() => {
                      sessionStorage.clear();
                      navigate("/login");
                    }} style={{
                      display: "flex", alignItems: "center", padding: "8px", color: "#333", textDecoration: "none"
                    }}>
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
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleGoBack} className="text-[#27235C] hover:text-[#1C1A4E] transition duration-200">
              <FaArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-[#27235C] text-center flex-grow">Profile Update</h1>
          </div>

          {/* User Icon (Logo) */}
          <div className="flex flex-col justify-center items-center mb-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-[#27235C] flex justify-center items-center overflow-hidden">
                <img
                  src={editableFields.organizationLogo} // Use the logo file or fallback to avatar
                  alt="Organization Logo"
                  className="object-cover w-full h-full"
                />
              </div>
              <label className="absolute cursor-pointer bottom-0 right-0 bg-white p-1 rounded-full shadow-lg hover:bg-gray-200">
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" onClick={(e) => e.stopPropagation()} />
                <span className="text-[#27235C] text-xl">📷</span>
              </label>
            </div>
          </div>

          {/* Editable Fields */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Client Name" value={editableFields.clientName} onChange={handleInputChange} name="clientName" error={error.clientName} />
              <ProfileField label="Organization Name" value={profileData.clientOrganization?.organizationName || ''} readonly />
              <ProfileField label="Organization Industry" value={profileData.clientOrganization?.organizationIndustry || ''} readonly />
              <ProfileField label="Client Position" value={editableFields.clientPosition} onChange={handleInputChange} name="clientPosition" error={error.clientPosition} />
              <ProfileField label="Organization Address" value={editableFields.organizationAddress} onChange={handleInputChange} name="organizationAddress" error={error.organizationAddress} />
              <ProfileField label="Client Mobile" value={editableFields.clientMobile} onChange={handleInputChange} name="clientMobile" error={error.clientMobile} />
              <ProfileField label="Client Email" value={profileData.clientEmail || ''} readonly />
            </div>

            <div className="flex justify-center mt-6">
              <button onClick={handleSave} className="bg-[#27235C] text-white rounded-lg px-4 py-2 hover:bg-[#1C1A4E] transition duration-200 mr-4">
                Save
              </button>
              <button type="button" onClick={handleGoBack} className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, onChange, name, readonly, error }) => (
  <div>
    <label className="block font-semibold text-[#27235C]">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      name={name}
      readOnly={readonly}
      className={`w-full p-2 mt-1 rounded-lg border ${
        readonly ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
      } ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default ClientProfileUpdate;

