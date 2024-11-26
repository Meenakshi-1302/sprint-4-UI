

 
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { FaCloudUploadAlt, FaHome } from 'react-icons/fa'; 
// import { Toaster, toast } from 'react-hot-toast';
// import * as pdfjsLib from 'pdfjs-dist/webpack';
// import { useLocation } from 'react-router-dom';

// import CandidateNavbar from './CandidateNavbar';

// const CandidateJobApplyFormPage = () => {
//   const { jobId } = useParams();
//   const location = useLocation();
//   const initialJobTitle = location.state?.jobTitle || '';
//   const navigate = useNavigate();

//   // Candidate data state
//   const [candidateData, setCandidateData] = useState({
//     firstName: '',
//     lastName: '',
//     mobileNumber: '',
//     email: '',
//     experience: '',
//     skill: '',
//     location: '',
//     panNumber: '',
//     candidateResume: null,
//   });

//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [errors, setErrors] = useState({});
//   const [jobTitle, setJobTitle] = useState(initialJobTitle);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(false);
//   }, [jobId]);

//   const extractTextFromPDF = async (file) => {
//     const fileReader = new FileReader();
//     return new Promise((resolve, reject) => {
//       fileReader.onload = async (e) => {
//         const arrayBuffer = e.target.result;
//         try {
//           const pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
//           let textContent = '';
//           for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
//             const page = await pdfDocument.getPage(pageNum);
//             const content = await page.getTextContent();
//             content.items.forEach((item) => {
//               textContent += item.str + ' ';
//             });
//           }
//           resolve(textContent);
//         } catch (err) {
//           reject(err);
//         }
//       };
//       fileReader.onerror = (err) => reject(err);
//       fileReader.readAsArrayBuffer(file);
//     });
//   };

//   const populateFieldsFromText = (text) => {
//     const fieldPatterns = {
//       firstName: /(?:First\s*Name):?\s*(.*?)(?:\n|$)/i,
//       lastName: /(?:Last\s*Name):?\s*(.*?)(?:\n|$)/i,
//       email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/i,
//       mobileNumber: /(\b\d{10}\b)/i,
//       experience: /(\d+)\s*(?:years?|year)/i,
//       skill: /(?:Skills|Key Skills):?\s*([^\n]*?)(?=\n|$)/i,
//       location: /(?:Location):?\s*(.*?)(?:\n|$)/i,
//       panNumber: /(?:PAN\s*Number):?\s*(.*?)(?:\n|$)/i,
//     };

//     const updatedData = { ...candidateData };

//     Object.keys(fieldPatterns).forEach((key) => {
//       const match = text.match(fieldPatterns[key]);
//       if (match && match[1]) {
//         updatedData[key] = match[1].trim();
//       }
//     });

//     setCandidateData(updatedData);
//   };

//   // Handle file selection
//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       setFileName(selectedFile.name);
//       setErrors((prev) => ({ ...prev, candidateResume: '' }));

//       // Extract text from PDF and populate the fields
//       try {
//         const text = await extractTextFromPDF(selectedFile);
//         populateFieldsFromText(text); // Populate fields
//       } catch (error) {
//         setErrors((prev) => ({ ...prev, candidateResume: 'Error extracting text from PDF' }));
//         toast.error('Error extracting text from PDF');
//       }
//     } else {
//       setFile(null);
//       setFileName('');
//       setErrors((prev) => ({ ...prev, candidateResume: 'Invalid file type, PDF only' }));
//       toast.error('Please upload a valid PDF file.');
//     }
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setCandidateData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     let newErrors = { ...errors };
//     switch (name) {
//       case 'firstName':
//         newErrors.firstName = value.length < 2 ? 'First Name must be at least 2 characters' : '';
//         break;
//       case 'lastName':
//         newErrors.lastName = value.length < 2 ? 'Last Name must be at least 2 characters' : '';
//         break;
//       case 'mobileNumber':
//         newErrors.mobileNumber = value.length < 10 || !/^\d+$/.test(value) ? 'Mobile Number must be at least 10 digits' : '';
//         break;
//       case 'email':
//         newErrors.email = !/.+@.+\..+/.test(value) ? 'Email is not valid' : '';
//         break;
//       case 'experience':
//         newErrors.experience = value < 0 || !/^\d+$/.test(value) ? 'Experience must be a positive number' : '';
//         break;
//       case 'skill':
//         newErrors.skill = value.length < 2 ? 'Skills must be at least 2 characters' : '';
//         break;
//       case 'location':
//         newErrors.location = value.length < 2 ? 'Location must be at least 2 characters' : '';
//         break;
//       case 'panNumber':
//         newErrors.panNumber = value.length < 10 ? 'PAN Number must be at least 10 characters' : '';
//         break;
//       default:
//         break;
//     }
//     setErrors(newErrors);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const regexMobile = /^\d{10}$/;
//     const regexPAN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10}$/;

//     if (!/^[A-Za-z]+$/.test(candidateData.firstName)) {
//       newErrors.firstName = "First Name must contain only letters.";
//     }
//     if (!/^[A-Za-z]+$/.test(candidateData.lastName)) {
//       newErrors.lastName = "Last Name must contain only letters.";
//     }
//     if (!regexMobile.test(candidateData.mobileNumber)) {
//       newErrors.mobileNumber = "Mobile Number must be exactly 10 digits.";
//     }
//     if (!regexEmail.test(candidateData.email)) {
//       newErrors.email = "Email must contain a valid format (example@example.com).";
//     }
//     if (!/^\d+$/.test(candidateData.experience)) {
//       newErrors.experience = "Experience must be a valid number.";
//     }
//     if (!candidateData.skill) {
//       newErrors.skill = "Skill is required.";
//     }
//     if (!candidateData.location) {
//       newErrors.location = "Location is required.";
//     }
//     if (!regexPAN.test(candidateData.panNumber)) {
//       newErrors.panNumber = "PAN Number must be valid.";
//     }
//     if (!file) {
//       newErrors.candidateResume = "Resume is required.";
//     } else {
//       const { size, type } = file;
//       if (size > 1024 * 1024) {
//         newErrors.candidateResume = "Resume must be less than or equal to 1MB.";
//       }
//       if (type !== 'application/pdf') {
//         newErrors.candidateResume = "Only PDF files are allowed.";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return; 
//     }

//     const data = new FormData();
//     data.append('jobId', jobId);
//     Object.keys(candidateData).forEach((key) => {
//       data.append(key, candidateData[key]);
//     });
//     data.append('candidateResume', file); // Append the file separately

//     try {
//       const response = await axios.post('http://localhost:8080/candidates/applyjob', data, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       console.log("Form submitted successfully:", response.data);
//       toast.success("Application submitted successfully!");
//       resetForm();
//       navigate('/candidatecareerpage');
//     } catch (error) {
//       console.error("Error submitting the form:", error);
//       toast.error("Error submitting the application.");
//     }
//   };

//   const resetForm = () => {
//     setCandidateData({
//       firstName: '',
//       lastName: '',
//       mobileNumber: '',
//       email: '',
//       experience: '',
//       skill: '',
//       location: '',
//       panNumber: '',
//       candidateResume: null,
//     });
//     setFile(null);
//     setFileName('');
//     setErrors({});
//   };

//   const breadcrumbPath = [
//     { label: 'Home', path: '/candidatecareerpage' },
//     { label: 'Jobs', path: '/candidatejobapplypage' },
//     { label: 'Apply', path: '#' }
//   ];

//   return (
//     <div className='w-full'>
//       <CandidateNavbar />
//       <Toaster />
//       <nav className="bg-white p-4 rounded-lg mb-10">
//         <ul className="flex items-center">
//           <li className="inline-flex items-center">
//             <Link to="/" className="text-[#27235C] hover:text-[#524F7D]">
//               <FaHome className="mr-2" />
//             </Link>
//           </li>
//           {breadcrumbPath.map((item, index) => (
//             <li key={index} className="inline-flex items-center">
//               <Link to={item.path} className={`text-[#27235C] hover:text-[#524F7D] ${index === breadcrumbPath.length - 1 ? 'font-medium' : ''}`}>
//                 {item.label}
//               </Link>
//               {index < breadcrumbPath.length - 1 && <span className="mx-2 text-gray-400">/</span>}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <div className="max-w-4xl mx-auto p-2 bg-white rounded-lg shadow-md mt-10 w-full">
//         {loading ? (
//           <h2 className="text-2xl font-bold text-center mb-6">Loading job title...</h2>
//         ) : (
//           <h2 className="text-2xl font-bold text-center text-[#27235C] mb-6">Apply for {jobTitle}</h2>
//         )}
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Resume Upload Field */}
//           <div>
//             <label className="block text-sm font-semibold mb-1" htmlFor="candidateResume">Upload Resume</label>
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               className="hidden"
//               id="candidateResume"
//             />
//             <div 
//               className={`border-2 border-dotted ${fileName ? 'border-green-500' : 'border-gray-300'} rounded-md p-4 text-center`}
//               onClick={() => document.getElementById('candidateResume').click()}
//             >
//               <FaCloudUploadAlt className="text-2xl text-blue-600 mb-2 mx-auto" />
//               {fileName ? (
//                 <span className="text-gray-600">Uploaded: {fileName}</span>
//               ) : (
//                 <span className="text-gray-600">Drag & drop your resume here, or <span className="font-semibold">browse</span></span>
//               )}
//             </div>
//             {errors.candidateResume && <p className="text-red-500 text-xs mt-1">{errors.candidateResume}</p>}
//           </div>

//           {/* Other Form Fields */}
//           {['firstName', 'lastName', 'mobileNumber', 'email', 'experience', 'skill', 'location', 'panNumber'].map(field => (
//             <div key={field} className="w-full">
//               <label className="block text-sm font-semibold mb-1" htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//               <input
//                 type={field === 'experience' ? 'number' : 'text'}
//                 name={field}
//                 id={field}
//                 value={candidateData[field]}
//                 onChange={handleInputChange}
//                 className={`w-full p-3 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//               />
//               {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
//             </div>
//           ))}
          
//           <div className="text-center">
//             <button
//               type="submit"
//               className="mt-4 bg-[#27235C] text-white py-3 px-6 rounded-lg hover:bg-[#524F7D] transition duration-300"
//             >
//               Submit Application
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CandidateJobApplyFormPage;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import CandidateNavbar from './CandidateNavbar';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
 
const CandidateJobApplyFormPage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const initialJobTitle = location.state?.jobTitle || '';
  const navigate = useNavigate();
 
  const [requiresVisa, setRequiresVisa] = useState(false);
  const [requiresCertificates, setRequiresCertificates] = useState(false);
 
  const [candidateData, setCandidateData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    mobileNumber: '',
    email: '',
    totalExperience: '',
    relevantExperience: '',
    skill: '',
    location: '',
    panNumber: '', // PAN number added here
    sourceId: 0,
    source: '',
    isPasswordChanged: false,
    mrfJdId: '',
    currentCompany: '',
    currentLocation: '',
    currentCTC: '',
    expectedCTC: '',
    employementMode: '',
    previousRole: '',
    noticePeriod: '',
    relocate: '',
    education: '',
    visaType: '',
    certificates: []
  });
 
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/jobs/${jobId}`);
        const jobDetails = response.data;
 
        setRequiresVisa(jobDetails.requiresVisa);
        setRequiresCertificates(jobDetails.requiresCertificate);
 
        setCandidateData(prev => ({
          ...prev,
          mrfJdId: jobDetails.mrfJdId,
        }));
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Error fetching job details.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchJobDetails();
  }, [jobId]);
 
  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        try {
          const pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
          let textContent = '';
          for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const content = await page.getTextContent();
            content.items.forEach((item) => {
              textContent += item.str + ' ';
            });
          }
          resolve(textContent);
        } catch (err) {
          reject(err);
        }
      };
      fileReader.onerror = (err) => reject(err);
      fileReader.readAsArrayBuffer(file);
    });
  };
 
  const populateFieldsFromText = (text) => {
    const fieldPatterns = {
      firstName: /(?:First\s*Name):?\s*(.*?)(?:\n|$)/i,
      lastName: /(?:Last\s*Name):?\s*(.*?)(?:\n|$)/i,
      email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/i,
      mobileNumber: /(\b\d{10}\b)/i,
      panNumber: /(?:PAN\s*Number):?\s*(.*?)(?:\n|$)/i,
      relevantExperience: /(?:Relevant\s*Experience):?\s*(\d+)\s*(?:years?|year)/i,
      skill: /(?:Skills|Key Skills):?\s*([^\n]*?)(?=\n|$)/i,
      location: /(?:Location):?\s*(.*?)(?:\n|$)/i,
      currentCompany: /(?:Current\s*Company):?\s*(.*?)(?:\n|$)/i,
      currentLocation: /(?:Current\s*Location):?\s*(.*?)(?:\n|$)/i,
      education: /(?:Education):?\s*(.*?)(?:\n|$)/i,
    };
 
    const updatedData = { ...candidateData };
 
    Object.keys(fieldPatterns).forEach((key) => {
      const match = text.match(fieldPatterns[key]);
      if (match && match[1]) {
        updatedData[key] = match[1].trim();
      }
    });
 
    setCandidateData(updatedData);
  };
 
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setErrors((prev) => ({ ...prev, resume: '' }));
 
      try {
        const text = await extractTextFromPDF(selectedFile);
        populateFieldsFromText(text);
      } catch (error) {
        setErrors((prev) => ({ ...prev, resume: 'Error extracting text from PDF' }));
        toast.error('Error extracting text from PDF');
      }
    } else {
      setFile(null);
      setFileName('');
      setErrors((prev) => ({ ...prev, resume: 'Invalid file type, PDF only' }));
      toast.error('Please upload a valid PDF file.');
    }
  };
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 
  const handleAddCertificate = () => {
    setCandidateData((prev) => ({
      ...prev,
      certificates: [...prev.certificates, ''],
    }));
  };
 
  const handleCertificateChange = (index, value) => {
    const newCertificates = [...candidateData.certificates];
    newCertificates[index] = value;
    setCandidateData((prev) => ({
      ...prev,
      certificates: newCertificates,
    }));
  };
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!candidateData.firstName) {
      newErrors.firstName = 'First name is required.';
    }
    if (!candidateData.lastName) {
      newErrors.lastName = 'Last name is required.';
    }
    if (!candidateData.gender) {
      newErrors.gender = 'Gender is required.';
    }
    if (!candidateData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(candidateData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number should be 10 digits.';
    }
    if (!candidateData.panNumber) {
      newErrors.panNumber = 'PAN number is required.';
    } else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(candidateData.panNumber)) {
      newErrors.panNumber = 'PAN number is invalid.';
    }
    if (!candidateData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(candidateData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!candidateData.totalExperience) {
      newErrors.totalExperience = 'Total experience is required.';
    }
    if (requiresCertificates) {
      const emptyCertificates = candidateData.certificates.filter(cert => cert.trim() === '');
      if (emptyCertificates.length > 0) {
        newErrors.certificates = 'Certificates cannot be empty.';
      }
    }
    // Add more validations as needed...
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!validateForm()) {
      return;
    }
 
    const data = new FormData();
    Object.keys(candidateData).forEach((key) => {
      data.append(key, candidateData[key]);
    });
    data.append('candidateResume', file);
 
    try {
      const response = await axios.post('http://localhost:8080/candidates/applyjob/resumebank', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Form submitted successfully:", response.data);
      toast.success("Application submitted successfully.");
      resetForm();
      navigate('/candidatecareerpage');
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Error submitting the application.");
    }
  };
 
  const resetForm = () => {
    setCandidateData({
      firstName: '',
      lastName: '',
      gender: '',
      mobileNumber: '',
      email: '',
      totalExperience: '',
      relevantExperience: '',
      skill: '',
      location: '',
      panNumber: '', // Reset PAN number
      source: '',
      sourceId: 0,
      isPasswordChanged: false,
      mrfJdId: '',
      currentCompany: '',
      currentLocation: '',
      currentCTC: '',
      expectedCTC: '',
      employementMode: '',
      previousRole: '',
      noticePeriod: '',
      relocate: '',
      education: '',
      visaType: '',
      certificates: []
    });
    setFile(null);
    setFileName('');
    setErrors({});
  };
 
  const breadcrumbPath = [
    { label: 'Home', path: '/candidatecareerpage' },
    { label: 'Jobs', path: '/candidatejobapplypage' },
    { label: 'Apply', path: '#' }
  ];
 
  return (
    <div>
      <CandidateNavbar />
      <nav className="bg-white p-4 rounded-lg mb-10">
        <ul className="flex items-center">
          <li className="inline-flex items-center">
            <Link to="/" className="text-[#27235C] hover:text-[#524F7D]">
              <FaHome className="mr-2" />
            </Link>
          </li>
          {breadcrumbPath.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              <Link to={item.path} className={`text-[#27235C] hover:text-[#524F7D] ${index === breadcrumbPath.length - 1 ? 'font-medium' : ''}`}>
                {item.label}
              </Link>
              {index < breadcrumbPath.length - 1 && <span className="mx-2 text-gray-400">/</span>}
            </li>
          ))}
        </ul>
      </nav>
 
      <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-center" reverseOrder={false} />
 
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Job Application Form For {initialJobTitle}</h2>
          <form onSubmit={handleSubmit}>
 
            <div
              className={`border-2 border-dotted ${fileName ? 'border-green-500' : 'border-gray-300'} rounded-md p-4 text-center mb-6 cursor-pointer`}
              onClick={() => document.getElementById('resumeUpload').click()}
            >
              <FaCloudUploadAlt className="text-2xl text-blue-600 mb-2 mx-auto" />
              {fileName ? (
                <span className="text-gray-600">Uploaded: {fileName}</span>
              ) : (
                <span className="text-gray-600">Drag & drop your resume here, or <span className="font-semibold">browse</span></span>
              )}
              <input
                type="file"
                accept=".pdf"
                id="resumeUpload"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
 
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={candidateData.firstName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={candidateData.lastName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={candidateData.gender}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not Willing to disclose">Not Willing to disclose</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={candidateData.mobileNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.mobileNumber && <p className="text-red-500 text-xs">{errors.mobileNumber}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={candidateData.panNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.panNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.panNumber && <p className="text-red-500 text-xs">{errors.panNumber}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={candidateData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Experience</label>
                <select
                  name="totalExperience"
                  value={candidateData.totalExperience}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full p-3 border ${errors.totalExperience ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">Fresher</option>
                  <option value="0-1">0-1 Year</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5-7">5-7 Years</option>
                  <option value="7-10">7-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
                {errors.totalExperience && <p className="text-red-500 text-xs">{errors.totalExperience}</p>}
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Relevant Experience</label>
                <input
                  type="text"
                  name="relevantExperience"
                  value={candidateData.relevantExperience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Company</label>
                <input
                  type="text"
                  name="currentCompany"
                  value={candidateData.currentCompany}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Location</label>
                <input
                  type="text"
                  name="currentLocation"
                  value={candidateData.currentLocation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Current CTC</label>
                <select
                  name="currentCTC"
                  value={candidateData.currentCTC}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select CTC</option>
                  <option value="2L">1-3 LPA</option>
                  <option value="3L">3-5 LPA</option>
                  <option value="4L">5-7 LPA</option>
                  <option value="5L">7-9 LPA</option>
                  <option value="5L">9-10 LPA</option>
                  <option value="5L">10+ LPA</option>
                </select>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Expected CTC</label>
                <select
                  name="expectedCTC"
                  value={candidateData.expectedCTC}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select CTC</option>
                  <option value="open">Open</option>
                  <option value="3L">3-5 LPA</option>
                  <option value="4L">5-7 LPA</option>
                  <option value="5L">7-9 LPA</option>
                  <option value="6L">9-10 LPA</option>
                  <option value="6L">10+ LPA</option>
                </select>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Notice Period</label>
                <select
                  name="noticePeriod"
                  value={candidateData.noticePeriod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Notice Period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                </select>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Willing to Relocate</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="relocate"
                    value="Yes"
                    checked={candidateData.relocate === 'Yes'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="mr-4">Yes</label>
                  <input
                    type="radio"
                    name="relocate"
                    value="No"
                    checked={candidateData.relocate === 'No'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label>No</label>
                </div>
              </div>
 
              <div>
                <label className="block text-sm font-medium text-gray-700">Education</label>
                <input
                  type="text"
                  name="education"
                  value={candidateData.education}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
 
            <label className="block text-sm font-medium text-gray-700 mt-6">How did you come across this vacancy?</label>
            <select
              name="source"
              value={candidateData.source}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-None-</option>
              <option value="LinkedIn">Linked-In</option>
              <option value="Naukri">Naukri</option>
              <option value="Career Page">Career Page</option>
            </select>
 
            {/* Visa Details */}
            {requiresVisa && (
              <div className="mt-6">
                <label htmlFor="visaType" className="block text-sm font-medium text-gray-700">
                  Visa Type (if applicable)
                </label>
                <select
                  id="visaType"
                  name="visaType"
                  value={candidateData.visaType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select your visa type</option>
                  <option value="H-1B">H-1B</option>
                  <option value="L-1">L-1</option>
                  <option value="O-1">O-1</option>
                  <option value="TN">TN</option>
                  <option value="B-1/B-2">B-1/B-2 (Visitor Visa)</option>
                  <option value="F-1">F-1 (Student Visa)</option>
                  <option value="J-1">J-1 (Exchange Visitor Visa)</option>
                  <option value="Green Card">Green Card Holder</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
 
            {/* Certificates Section */}
            {requiresCertificates && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700">Certificates</h3>
                {candidateData.certificates.map((certificate, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={certificate}
                      onChange={(e) => handleCertificateChange(index, e.target.value)}
                      className={`mt-1 block w-full p-3 border ${errors.certificates ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Certificate Name"
                    />
                  </div>
                ))}
                {errors.certificates && <p className="text-red-500 text-xs">{errors.certificates}</p>}
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Add Another Certificate
                </button>
              </div>
            )}
 
            <button type="submit" className="mt-6 w-full py-3 bg-[#27235c] text-white font-semibold rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default CandidateJobApplyFormPage;