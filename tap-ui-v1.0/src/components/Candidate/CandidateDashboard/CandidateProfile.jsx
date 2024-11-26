
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { FaEdit, FaLinkedin, FaUser } from 'react-icons/fa';
// import { MdWork } from 'react-icons/md';
// import axios from 'axios'; // Ensure you have axios for API calls
// import { getCandidateById, updateCandidateProfile } from '../../../services/Candidate/CandidateDashboardService';

// const CandidateProfile = ({ candidateId }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     firstName: '',
//     lastName: '',
//     mobileNumber: '',
//     email: '',
//     experience: '',
//     resume: '',           // Existing resume field
//     candidateResume: '',  // New candidateResume field
//     source: '',
//     skill: '',
//     location: '',
//     panNumber: '',
//     documentStatus: '',
//     candidateProfileImage: '',
//   });

//   useEffect(() => {
//     const fetchCandidate = async () => {
//       try {
//         const data = await getCandidateById(candidateId);
//         setProfileData(data);
//         console.log(data);
//       } catch (error) {
//         console.error('Error fetching candidate data', error);
//         toast.error('Failed to fetch candidate data.');
//       }
//     };
//     fetchCandidate();
//   }, [candidateId]);

//   const handleInputChange = (e, field) => {
//     setProfileData({ ...profileData, [field]: e.target.value });
//   };

//   const handleFileChange = async (e, field) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (field === 'candidateProfileImage' && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
//       toast.error('Only JPEG/PNG files are allowed for profile images.');
//       return;
//     }
//     if (( field === 'candidateResume') && file.type !== 'application/pdf') {
//       toast.error('Only PDF files are allowed for resumes.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result.split(',')[1]; // Extract the Base64 string
//       setProfileData({ ...profileData, [field]: base64String });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSaveClick = async () => {
//     try {
//       // Send an HTTP PUT request to update the candidate profile
//       const response = await axios.put(`http://localhost:8080/candidates/update/${candidateId}`, profileData);
      
//       if (response.status === 200) {
//         toast.success('Profile updated successfully!');
//         setIsEditing(false);
//       }
//     } catch (error) {
//       console.error('Error updating candidate profile', error);
//       toast.error('Failed to update profile.');
//     }
//   };

//   const renderSourceIcon = (source) => {
//     switch (source) {
//       case 'LinkedIn':
//         return <FaLinkedin className="text-blue-700" />;
//       case 'Naukri':
//       case 'Vendor':
//         return <FaUser className="text-blue-700" />;
//       case 'Job Portal':
//         return <MdWork className="text-blue-700" />;
//       default:
//         return null;
//     }
//   };

//   const renderResume = (resumeData) => {
//     if (!resumeData) return 'No Document Available';

//     const openPDF = () => {
//       const pdfData = resumeData.startsWith('data:application/pdf;base64,')
//         ? resumeData
//         : `data:application/pdf;base64,${resumeData}`;
      
//       const blob = new Blob([Uint8Array.from(atob(pdfData.split(',')[1]), c => c.charCodeAt(0))], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       window.open(url, '_blank');
//     };

//     return (
//       <span
//         style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
//         onClick={openPDF}
//       >
//         View Resume
//       </span>
//     );
//   };

//   return (
//     <div className="p-4 border rounded-lg shadow-lg bg-white w-full" style={{ fontSize: '14px' }}>
//       <div className="flex flex-col items-center mb-4">
//         <label htmlFor="image-upload" className={`cursor-pointer relative ${isEditing ? '' : 'pointer-events-none'}`}>
//           {profileData.candidateProfileImage ? (
//             <img
//               src={`data:image/png;base64,${profileData.candidateProfileImage}`}
//               alt="Profile"
//               className="w-24 h-24 rounded-full mb-4"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gray-200">
//               <FaEdit className="text-gray-500" />
//             </div>
//           )}
//           {isEditing && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
//               <FaEdit className="text-white" />
//             </div>
//           )}
//           <input
//             type="file"
//             id="image-upload"
//             accept=".jpg, .jpeg, .png"
//             onChange={(e) => handleFileChange(e, 'candidateProfileImage')}
//             className="hidden"
//           />
//         </label>
//         <h2 className="text-lg font-bold text-center">{`${profileData.firstName} ${profileData.lastName}`}</h2>
//       </div>
//       <div className="text-center mb-4">
//         {profileData.location} | {profileData.mobileNumber}
//         <div>{profileData.email}</div>
//         <div className="mt-2 flex items-center justify-center">
//           {renderSourceIcon(profileData.source)}
//           {profileData.source && (
//             <span className="ml-2 inline-block">From {profileData.source}</span>
//           )}
//         </div>
//       </div>
//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         {['experience', 'skill'].map((field) => (
//           <div key={field} className="mb-4">
//             <div className="flex justify-between items-center">
//               <h3 className="font-semibold capitalize">{field}</h3>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={profileData[field]}
//                   onChange={(e) => handleInputChange(e, field)}
//                   className="border-b-2 border-[#27235C] outline-none w-2/3 bg-transparent"
//                 />
//               ) : (
//                 <p className="border-b-2 border-transparent w-2/3">{profileData[field]}</p>
//               )}
//             </div>
//           </div>
//         ))}
//         <div className="mb-4">
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold capitalize">PAN Number</h3>
//             <input
//               type="text"
//               value={profileData.panNumber}
//               readOnly
//               className="border-b-2 border-transparent w-2/3 bg-transparent"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         {/* <div className="mb-4">
//           <h3 className="font-semibold capitalize">Resume:</h3>
//           {profileData.resume ? renderResume(profileData.resume) : 'No Document Available'}
//           {isEditing && (
//             <div className="mt-2">
//               <input
//                 type="file"
//                 id="resume-upload"
//                 onChange={(e) => handleFileChange(e, 'resume')}
//                 accept="application/pdf"
//                 className="hidden"
//               />
//               <label htmlFor="resume-upload" className="text-blue-500 cursor-pointer">
//                 {profileData.resume ? 'Change Resume' : 'Upload Resume'}
//               </label>
//             </div>
//           )}
//         </div> */}
//         <div className="mb-4">
//           <h3 className="font-semibold capitalize">Candidate Resume:</h3>
//           {profileData.candidateResume ? renderResume(profileData.candidateResume) : 'No Document Available'}
//           {isEditing && (
//             <div className="mt-2">
//               <input
//                 type="file"
//                 id="candidate-resume-upload"
//                 onChange={(e) => handleFileChange(e, 'candidateResume')}
//                 accept="application/pdf"
//                 className="hidden"
//               />
//               <label htmlFor="candidate-resume-upload" className="text-blue-500 cursor-pointer">
//                 {profileData.candidateResume ? 'Change Candidate Resume' : 'Upload Candidate Resume'}
//               </label>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="bg-gray-100 p-4 rounded-lg">
//         <div className="mb-4">
//           <h3 className="font-semibold capitalize">Document Status:</h3>
//           {profileData.documentStatus ? (
//             <p>{profileData.documentStatus}</p>
//           ) : (
//             <p>No documents uploaded. <a href="/upload-documents" className="text-blue-500">Upload Documents</a></p>
//           )}
//         </div>
//       </div>
//       <div className="flex justify-between mt-4">
//         {isEditing ? (
//           <button
//             className="bg-[#27235c] text-white px-4 py-2 rounded transition duration-300 hover:bg-[#1e1b4b]"
//             onClick={handleSaveClick}
//           >
//             Save
//           </button>
//         ) : (
//           <button
//             className="bg-[#27235c] text-white px-4 py-2 rounded transition duration-300 hover:bg-[#1e1b4b]"
//             onClick={() => setIsEditing(true)}
//           >
//             Edit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CandidateProfile;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaLinkedin, FaUser } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import axios from 'axios'; // Ensure you have axios for API calls
import { getCandidateById, updateCandidateProfile } from '../../../services/Candidate/CandidateDashboardService';

const CandidateProfile = ({ candidateId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    experience: '',
    resume: '',           // Existing resume field
    candidateResume: '',  // New candidateResume field
    source: '',
    skill: '',
    location: '',
    panNumber: '',
    documentStatus: '',
    candidateProfileImage: '',
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await getCandidateById(candidateId);
        setProfileData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching candidate data', error);
        toast.error('Failed to fetch candidate data.');
      }
    };
    fetchCandidate();
  }, [candidateId]);

  const handleInputChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (field === 'candidateProfileImage' && !file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast.error('Only JPEG/PNG files are allowed for profile images.');
      return;
    }
    if (field === 'candidateResume' && file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for resumes.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Extract the Base64 string
      setProfileData({ ...profileData, [field]: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClick = async () => {
    try {
      // Send an HTTP PUT request to update the candidate profile
      const response = await axios.put(`http://localhost:8080/candidates/update/${candidateId}`, profileData);
      
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating candidate profile', error);
      toast.error('Failed to update profile.');
    }
  };

  const renderSourceIcon = (source) => {
    switch (source) {
      case 'LinkedIn':
        return <FaLinkedin className="text-blue-700" />;
      case 'Naukri':
      case 'Vendor':
        return <FaUser className="text-blue-700" />;
      case 'Job Portal':
        return <MdWork className="text-blue-700" />;
      default:
        return null;
    }
  };

  const renderResume = (resumeData) => {
    if (!resumeData) return 'No Document Available';

    const openPDF = () => {
      const pdfData = resumeData.startsWith('data:application/pdf;base64,')
        ? resumeData
        : `data:application/pdf;base64,${resumeData}`;
      
      const blob = new Blob([Uint8Array.from(atob(pdfData.split(',')[1]), c => c.charCodeAt(0))], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };

    return (
      <span
        style={{ color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
        onClick={openPDF}
      >
        View Resume
      </span>
    );
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white w-full" style={{ fontSize: '14px' }}>
      <div className="flex flex-col items-center mb-4">
        <label htmlFor="image-upload" className={`cursor-pointer relative ${isEditing ? '' : 'pointer-events-none'}`}>
          {profileData.candidateProfileImage ? (
            <img
              src={`data:image/png;base64,${profileData.candidateProfileImage}`}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center bg-gray-200">
              <FaEdit className="text-gray-500" />
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <FaEdit className="text-white" />
            </div>
          )}
          <input
            type="file"
            id="image-upload"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => handleFileChange(e, 'candidateProfileImage')}
            className="hidden"
          />
        </label>
        <h2 className="text-lg font-bold text-center">{`${profileData.firstName} ${profileData.lastName}`}</h2>
      </div>

      <div className="text-center mb-4">
        {/* Editable First Name Field */}
        {isEditing ? (
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleInputChange(e, 'firstName')}
            className="border-b-2 border-[#27235C] outline-none w-full bg-transparent mb-2"
            placeholder="First Name"
          />
        ) : (
          <div>{profileData.firstName}</div>
        )}
        
        {/* Editable Last Name Field */}
        {isEditing ? (
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleInputChange(e, 'lastName')}
            className="border-b-2 border-[#27235C] outline-none w-full bg-transparent mb-2"
            placeholder="Last Name"
          />
        ) : (
          <div>{profileData.lastName}</div>
        )}

        <div>{profileData.mobileNumber}</div>
        
        {/* Non-Editable Email Field */}
        <div>{profileData.email}</div>

        {/* Editable Location Field */}
        {isEditing ? (
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => handleInputChange(e, 'location')}
            className="border-b-2 border-[#27235C] outline-none w-full bg-transparent mb-2"
            placeholder="Location"
          />
        ) : (
          <div>{profileData.location}</div>
        )}

        <div className="mt-2 flex items-center justify-center">
          {renderSourceIcon(profileData.source)}
          {profileData.source && (
            <span className="ml-2 inline-block">From {profileData.source}</span>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        {['experience', 'skill'].map((field) => (
          <div key={field} className="mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold capitalize">{field}</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData[field]}
                  onChange={(e) => handleInputChange(e, field)}
                  className="border-b-2 border-[#27235C] outline-none w-2/3 bg-transparent"
                />
              ) : (
                <p className="border-b-2 border-transparent w-2/3">{profileData[field]}</p>
              )}
            </div>
          </div>
        ))}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold capitalize">PAN Number</h3>
            <input
              type="text"
              value={profileData.panNumber}
              readOnly
              className="border-b-2 border-transparent w-2/3 bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="mb-4">
          <h3 className="font-semibold capitalize">Candidate Resume:</h3>
          {profileData.candidateResume ? renderResume(profileData.candidateResume) : 'No Document Available'}
          {isEditing && (
            <div className="mt-2">
              <input
                type="file"
                id="candidate-resume-upload"
                onChange={(e) => handleFileChange(e, 'candidateResume')}
                accept="application/pdf"
                className="hidden"
              />
              <label htmlFor="candidate-resume-upload" className="text-blue-500 cursor-pointer">
                {profileData.candidateResume ? 'Change Candidate Resume' : 'Upload Candidate Resume'}
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="mb-4">
          <h3 className="font-semibold capitalize">Document Status:</h3>
          {profileData.documentStatus ? (
            <p>{profileData.documentStatus}</p>
          ) : (
            <p>No documents uploaded. <a href="/upload-documents" className="text-blue-500">Upload Documents</a></p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        {isEditing ? (
          <button
            className="bg-[#27235c] text-white px-4 py-2 rounded transition duration-300 hover:bg-[#1e1b4b]"
            onClick={handleSaveClick}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-[#27235c] text-white px-4 py-2 rounded transition duration-300 hover:bg-[#1e1b4b]"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;