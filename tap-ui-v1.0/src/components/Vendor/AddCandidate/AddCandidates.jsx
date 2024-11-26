import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
 
// Set the app element for the modal
Modal.setAppElement('#root');
 
// Add Candidate Parse Component
const AddCandidateParse = () => {
  const vendorId = sessionStorage.getItem("vendorId");
  const [candidateData, setCandidateData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    experience: '',
    candidateResume: null,
    skill: '',
    location: '',
    panNumber: '',
    status: 'SCREENED',
    isPasswordChanged: false,
    source: 'VENDOR',
    sourceId: vendorId
  });
 
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [pdfText, setPdfText] = useState('');
 
  // Handle file selection
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setErrors((prev) => ({ ...prev, resume: '' }));
 
      try {
        const text = await extractTextFromPDF(selectedFile);
        setPdfText(text);
        populateFieldsFromText(text); // Populate fields
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
          reject('Failed to extract text from PDF');
        }
      };
      fileReader.onerror = (err) => reject(err);
      fileReader.readAsArrayBuffer(file);
    });
  };
 
  const populateFieldsFromText = (text) => {
    const fieldPatterns = {
      firstName: /(?:First\s*Name|\bName\b):?[\s]*(.*?)(?:\n|$)/i,
      lastName: /(?:Last\s*Name|\bSurname\b):?[\s]*(.*?)(?:\n|$)/i,
      email: /(\b[A-Za-z0-9._%+-]+@gmail\.com\b)/i,
      mobileNumber: /(\b\d{10}\b)/i,
      experience: [
        /(\d{1,2}\s*(?:years?|yr|yrs?|Y|y))/gi,
        /(from\s+\w+\s+\d{4}\s+to\s+\w+\s+\d{4}|(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:\w+\s+\d{1,2},?\s+\d{4}))\s*-\s*(?:\w+\s+\d{1,2},?\s+\d{4}|(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}))|\d{4}\s*-\s*\d{4})/gi,
        /(worked\s*at\s*(?:[^,.]+)(?:\s+for\s*\d+\s*(?:years?|yr|yrs?))?)/gi,
        /(\d+\s*(?:years?|year)\s*of\s*experience)/gi
      ],
      skill: /(?:Skills|Key Skills|Technical Skills|Skills Summary|Core Competencies|Relevant Skills|Expertise|SKILLS):?\s*([^\n]*?)(?=\n|$)|(?:•|-)\s*([^\n]*?)(?=\n|$)|(Proficient|Experienced|Skilled|Familiar|Expert) in ([^\.\n]*?)(?=\n|$)|(?:Technical Skills:?)\s*[-]*\s*([^\n]*?)(?=\n|$)/gi,
      location: /((\b\w+\b)\s*[-\s]*(\d{6})\b)/,
      panNumber: /(?:PAN\s*Number):?[\s]*(.*?)(?:\n|$)/i,
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
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidateData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };
 
  // const validateField = (name, value) => {
  //   let newErrors = { ...errors };
  //   switch (name) {
  //     case 'firstName':
  //       newErrors.firstName = value.length < 2 ? 'First Name must be at least 2 characters' : '';
  //       break;
  //     case 'lastName':
  //       newErrors.lastName = value.length < 2 ? 'Last Name must be at least 2 characters' : '';
  //       break;
  //     case 'mobileNumber':
  //       newErrors.mobileNumber = value.length < 10 || !/^\d+$/.test(value) ? 'Mobile Number must be at least 10 digits' : '';
  //       break;
  //     case 'email':
  //       newErrors.email = !/.+@.+\..+/.test(value) ? 'Email is not valid' : '';
  //       break;
  //     case 'experience':
  //       newErrors.experience = value < 0 || !/^\d+$/.test(value) ? 'Experience must be a positive number' : '';
  //       break;
  //     case 'skill':
  //       newErrors.skill = value.length < 2 ? 'Skills must be at least 2 characters' : '';
  //       break;
  //     case 'location':
  //       newErrors.location = value.length < 2 ? 'Location must be at least 2 characters' : '';
  //       break;
  //     case 'panNumber':
  //       newErrors.panNumber = value.length < 10 ? 'PAN Number must be at least 10 characters' : '';
  //       break;
  //     default:
  //       break;
  //   }
  //   setErrors(newErrors);
  // };
 
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'firstName':
        newErrors.firstName = value.length < 2 ? 'First Name must be at least 2 characters' : '';
        break;
      case 'lastName':
        newErrors.lastName = value.length < 2 ? 'Last Name must be at least 2 characters' : '';
        break;
      case 'mobileNumber':
        newErrors.mobileNumber = !/^\d{10}$/.test(value) ? 'Mobile Number must be exactly 10 digits' : '';
        break;
      case 'email':
        newErrors.email = !/.+@.+\..+/.test(value) || !value.endsWith('@gmail.com') ? 'Email is not valid and must end with @gmail.com' : '';
        break;
      case 'experience':
        newErrors.experience = value < 0 || !/^\d+$/.test(value) ? 'Experience must be a positive number' : '';
        break;
      case 'skill':
        newErrors.skill = value.length < 2 ? 'Skills must be at least 2 characters' : '';
        break;
      case 'location':
        newErrors.location = value.length < 2 ? 'Location must be at least 2 characters' : '';
        break;
      case 'panNumber':
        newErrors.panNumber = /[^A-Za-z0-9]/.test(value) || value.length < 10 ? 'PAN Number must be at least 10 characters and cannot contain special characters' : '';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };
 
 
  const handleSingleAddSubmit = async (event) => {
    event.preventDefault();
 
    const formData = new FormData();
    Object.keys(candidateData).forEach((key) => {
      if (key === 'candidateResume') {
        formData.append(key, file);
      } else {
        formData.append(key, candidateData[key]);
      }
    });
 
    try {
      const response = await fetch('http://localhost:8080/api/vendors/add-candidate-by-vendor', {
        method: 'POST',
        body: formData,
      });
 
      if (response.ok) {
        toast.success('Single Candidate Added Successfully!');
        resetSingleAddForm();
      } else {
        toast.error('Error adding candidate. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error adding candidate. Please check your network.');
    }
  };
 
 
  const resetSingleAddForm = () => {
    setCandidateData({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      experience: '',
      candidateResume: null,
      skill: '',
      location: '',
      panNumber: '',
      status: 'SCREENED',
      isPasswordChanged: false,
      source: 'VENDOR',
      sourceId: vendorId
    });
    setFile(null);
    setErrors({});
  };
 
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-white rounded-lg shadow-lg">
      <Toaster />
      {/* <h2 className="text-2xl font-semibold text-[#27235C] mb-6 text-center">Add Candidates</h2> */}
 
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF only)</label>
        <div className="relative w-1/2 mb-4 ">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex items-center h-20 justify-center py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
            {fileName ? (
              <span className="text-gray-600">{fileName}</span>
            ) : (
              <span className="text-gray-400">No file chosen</span>
            )}
            <FaUpload className="ml-2 text-[#27235C]" />
          </div>
        </div>
        {errors.resume && <span className="text-red-500 text-sm">{errors.resume}</span>}
      </div>
 
      <form onSubmit={handleSingleAddSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {['firstName', 'lastName', 'mobileNumber', 'email', 'experience', 'skill', 'location', 'panNumber'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'experience' ? 'number' : 'text'}
                name={field}
                value={candidateData[field]}
                onChange={handleInputChange}
                id={field}
                required
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className={`w-full p-2 border rounded-lg shadow-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#27235C] transition duration-150`}
              />
              {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
            </div>
          ))}
        </div>
 
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="bg-[#27235C] text-white px-6 py-2 justify-center rounded-lg shadow-md hover:bg-[#1C1A4E] transition duration-300"
          >
            Add Candidate
          </button>
        </div>
      </form>
    </div>
  );
};
 
// // Bulk Add Candidate Component
// const BulkAddCandidate = () => {
//   const [candidates, setCandidates] = useState([]);
//   const [editableCandidates, setEditableCandidates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fileName, setFileName] = useState('');
//   const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
//   const [errorMessages, setErrorMessages] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5; // Adjust as needed
 
//   const onDrop = (files) => {
//     const file = files[0];
//     setFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const firstSheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[firstSheetName];
//       const json = XLSX.utils.sheet_to_json(worksheet);
//       setCandidates(json);
//       setEditableCandidates(json);
//     };
//     reader.readAsArrayBuffer(file);
//   };
 
//   const { getRootProps, getInputProps } = useDropzone({ onDrop });
 
//   const downloadTemplate = () => {
//     const data = [{
//       firstName: '',
//       lastName: '',
//       mobileNumber: '',
//       email: '',
//       experience: '',
//       resume: '',
//       skill: '',
//       location: '',
//       panNumber: '',
//     }];
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
//     const fileBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const file = new Blob([fileBlob], { type: 'application/octet-stream' });
//     saveAs(file, 'Bulk_Add_Candidate_Template.xlsx');
//   };
 
//   const handleChange = (index, key, value) => {
//     const updatedCandidates = editableCandidates.map((candidate, i) =>
//       i === index ? { ...candidate, [key]: value } : candidate
//     );
//     setEditableCandidates(updatedCandidates);
//   };
 
//   const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
//   const validateEmail = (email) => email.endsWith('@gmail.com');
//   const validatePanNumber = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };
 
//   const validateForm = () => {
//     const errors = {};
//     editableCandidates.forEach((candidate, index) => {
//       Object.keys(candidate).forEach((key) => {
//         if (!candidate[key]) {
//           errors[index] = errors[index] || {};
//           errors[index][key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`;
//         }
//       });
//       if (!validatePhoneNumber(candidate.mobileNumber)) {
//         errors[index] = errors[index] || {};
//         errors[index].mobileNumber = "Mobile number must be 10 digits.";
//       }
//       if (!validateEmail(candidate.email)) {
//         errors[index] = errors[index] || {};
//         errors[index].email = "Email must end with @gmail.com.";
//       }
//       if (!validatePanNumber(candidate.panNumber)) {
//         errors[index] = errors[index] || {};
//         errors[index].panNumber = "Invalid PAN number format.";
//       }
//       if (!isValidUrl(candidate.resume)) {
//         errors[index] = errors[index] || {};
//         errors[index].resume = "Resume must be a valid URL.";
//       }
//     });
//     setErrorMessages(errors);
//     return Object.keys(errors).length === 0;
//   };
 
//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       toast.error('Please fix the errors in the form.');
//       return;
//     }
 
//     setLoading(true);
//     const vendorId = sessionStorage.getItem("vendorId");
//     const candidatesToSubmit = editableCandidates.map(candidate => ({
//       ...candidate,
//       status: "SCREENED",
//       isPasswordChanged: false,
//       source: 'VENDOR',
//       sourceId: vendorId
//     }));
 
//     for (const candidate of candidatesToSubmit) {
//       try {
//         await axios.post('http://localhost:8080/candidates/post', candidate);
//       } catch (error) {
//         console.error('Error submitting candidate:', error);
//       }
//     }
 
//     toast.success('Bulk add success!');
//     setEditableCandidates([]);
//     setFileName('');
//     setLoading(false);
//   };
 
//   const toggleSelected = (index) => {
//     const newSelected = new Set(selectedForDeletion);
//     if (newSelected.has(index)) {
//       newSelected.delete(index);
//     } else {
//       newSelected.add(index);
//     }
//     setSelectedForDeletion(newSelected);
//   };
 
//   const deleteSelectedCandidates = () => {
//     const updatedCandidates = editableCandidates.filter((_, index) => !selectedForDeletion.has(index));
//     setEditableCandidates(updatedCandidates);
//     setSelectedForDeletion(new Set());
//   };
 
//   const getDuplicates = () => {
//     const panNumbers = new Set();
//     const phoneNumbers = new Set();
//     const emails = new Set();
//     const duplicates = {};
//     editableCandidates.forEach((candidate, index) => {
//       if (panNumbers.has(candidate.panNumber)) {
//         duplicates[index] = duplicates[index] || {};
//         duplicates[index].panNumber = "Duplicate PAN Number.";
//       } else {
//         panNumbers.add(candidate.panNumber);
//       }
 
//       if (phoneNumbers.has(candidate.mobileNumber)) {
//         duplicates[index] = duplicates[index] || {};
//         duplicates[index].mobileNumber = "Duplicate Mobile Number.";
//       } else {
//         phoneNumbers.add(candidate.mobileNumber);
//       }
 
//       if (emails.has(candidate.email)) {
//         duplicates[index] = duplicates[index] || {};
//         duplicates[index].email = "Duplicate Email.";
//       } else {
//         emails.add(candidate.email);
//       }
//     });
//     return duplicates;
//   };
 
//   const duplicates = getDuplicates();
//   const hasDuplicates = Object.keys(duplicates).length > 0;
 
//   const removeFile = () => {
//     setEditableCandidates([]);
//     setFileName('');
//   };
 
//   const filteredCandidates = editableCandidates.filter(candidate =>
//     candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );
 
//   return (
//     <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-4 text-center">Bulk Add Candidate</h2>
//       <div {...getRootProps({ className: 'border-2 border-dashed border-[#27235C] rounded-lg p-6 mb-4 cursor-pointer' })}>
//         <input {...getInputProps()} />
//         <p className="text-center">{fileName || "Drag 'n' drop some files here, or click to select files"}</p>
//       </div>
//       <div className="flex justify-between mb-4">
//         <button onClick={removeFile} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out mr-4">
//           Remove File
//         </button>
//         <button onClick={downloadTemplate} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out">
//           Download Template
//         </button>
//       </div>
 
//       <input
//         type="text"
//         placeholder="Search"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
//       />
 
//       {editableCandidates.length > 0 && (
//         <>
//           <h3 className="text-xl font-semibold mb-2">Candidate Preview - Showing {filteredCandidates.length} Candidates</h3>
 
//           <table className="min-w-full border-collapse border border-gray-300 mb-4">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="border-b border-gray-400 p-2 text-left">Select</th>
//                 {['First Name', 'Last Name', 'Mobile Number', 'Email', 'Experience', 'Resume', 'Skill', 'Location', 'PAN Number'].map((itm, idx) => (
//                   <th key={idx} className="border-b border-gray-400 p-2 text-left">{itm}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCandidates.map((candidate, index) => (
//                 <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${duplicates[index] ? 'bg-yellow-300 font-bold' : ''}`}>
//                   <td className="border border-gray-400 p-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedForDeletion.has(index)}
//                       onChange={() => toggleSelected(index)}
//                       className="form-checkbox h-5 w-5 text-blue-600"
//                     />
//                   </td>
//                   {['firstName', 'lastName', 'mobileNumber', 'email', 'experience', 'resume', 'skill', 'location', 'panNumber'].map((field, idx) => (
//                     <td key={idx} className="border border-gray-400 p-2">
//                       <input
//                         type={field === 'email' ? 'email' : 'text'}
//                         value={candidate[field]}
//                         onChange={(e) => handleChange(index, field, e.target.value)}
//                         className={`border-2 rounded-lg w-full p-2 transition-all duration-150 focus:outline-none focus:ring-2 ${errorMessages[index] && errorMessages[index][field] ? 'border-red-500' : 'border-gray-300'} focus:ring-[#27235C]`}
//                         placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
//                       />
//                       {duplicates[index] && duplicates[index][field] && (
//                         <p className="text-red-600 text-xs mt-1">{duplicates[index][field]}</p>
//                       )}
//                       {errorMessages[index] && errorMessages[index][field] && (
//                         <p className="text-red-600 text-xs mt-1">{errorMessages[index][field]}</p>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="flex justify-between mb-4">
//             <button onClick={deleteSelectedCandidates} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out mr-4">
//               Delete Selected Candidates
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out"
//               disabled={loading}
//             >
//               {loading ? 'Submitting...' : hasDuplicates ? 'Submit (Fix Duplicates)' : 'Submit Candidates'}
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
 
 
const BulkAddCandidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [editableCandidates, setEditableCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedForDeletion, setSelectedForDeletion] = useState(new Set());
  const [errorMessages, setErrorMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Adjust as needed
 
  const onDrop = (files) => {
    const file = files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setCandidates(json);
      setEditableCandidates(json);
    };
    reader.readAsArrayBuffer(file);
  };
 
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
 
  const downloadTemplate = () => {
    const data = [{
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      experience: '',
      resume: '',
      skill: '',
      location: '',
      panNumber: '',
    }];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');
    const fileBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([fileBlob], { type: 'application/octet-stream' });
    saveAs(file, 'Bulk_Add_Candidate_Template.xlsx');
  };
 
  const handleChange = (index, key, value) => {
    const updatedCandidates = editableCandidates.map((candidate, i) =>
      i === index ? { ...candidate, [key]: value } : candidate
    );
    setEditableCandidates(updatedCandidates);
  };
 
  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => email.endsWith('@gmail.com');
  const validatePanNumber = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };
 
  const validateForm = () => {
    const errors = {};
    editableCandidates.forEach((candidate, index) => {
      Object.keys(candidate).forEach((key) => {
        if (!candidate[key]) {
          errors[index] = errors[index] || {};
          errors[index][key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`;
        }
      });
      if (!validatePhoneNumber(candidate.mobileNumber)) {
        errors[index] = errors[index] || {};
        errors[index].mobileNumber = "Mobile number must be 10 digits.";
      }
      if (!validateEmail(candidate.email)) {
        errors[index] = errors[index] || {};
        errors[index].email = "Email must end with @gmail.com.";
      }
      if (!validatePanNumber(candidate.panNumber)) {
        errors[index] = errors[index] || {};
        errors[index].panNumber = "Invalid PAN number format.";
      }
      if (!isValidUrl(candidate.resume)) {
        errors[index] = errors[index] || {};
        errors[index].resume = "Resume must be a valid URL.";
      }
    });
    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };
 
  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     toast.error('Please fix the errors in the form.');
  //     return;
  //   }
 
  //   setLoading(true);
  //   const vendorId = sessionStorage.getItem("vendorId");
  //   const candidatesToSubmit = editableCandidates.map(candidate => ({
  //     ...candidate,
  //     status: "SCREENED",
  //     isPasswordChanged: false,
  //     source: 'VENDOR',
  //     sourceId: vendorId
  //   }));
 
  //   for (const candidate of candidatesToSubmit) {
  //     try {
  //       await axios.post('http://localhost:8080/candidates/post', candidate);
  //     } catch (error) {
  //       console.error('Error submitting candidate:', error);
  //     }
  //   }
 
  //   toast.success('Bulk add success!');
  //   setEditableCandidates([]);
  //   setFileName('');
  //   setLoading(false);
  // };
 
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
 
    setLoading(true);
    const vendorId = sessionStorage.getItem("vendorId");
    const candidatesToSubmit = editableCandidates.map(candidate => ({
      ...candidate,
      status: "SCREENED",
      isPasswordChanged: false,
      source: 'VENDOR',
      sourceId: vendorId
    }));
 
    for (const candidate of candidatesToSubmit) {
      try {
        await axios.post('http://localhost:8080/candidates/post', candidate);
      } catch (error) {
        console.error('Error submitting candidate:', error);
      }
    }
 
    toast.success('Bulk add success!');
    setEditableCandidates([]);
    setFileName('');
    setLoading(false);
  };
 
  const toggleSelected = (index) => {
    const newSelected = new Set(selectedForDeletion);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedForDeletion(newSelected);
  };
 
  const deleteSelectedCandidates = () => {
    const updatedCandidates = editableCandidates.filter((_, index) => !selectedForDeletion.has(index));
    setEditableCandidates(updatedCandidates);
    setSelectedForDeletion(new Set());
  };
 
  const getDuplicates = () => {
    const panNumbers = new Set();
    const phoneNumbers = new Set();
    const emails = new Set();
    const duplicates = {};
    editableCandidates.forEach((candidate, index) => {
      if (panNumbers.has(candidate.panNumber)) {
        duplicates[index] = duplicates[index] || {};
        duplicates[index].panNumber = "Duplicate PAN Number.";
      } else {
        panNumbers.add(candidate.panNumber);
      }
 
      if (phoneNumbers.has(candidate.mobileNumber)) {
        duplicates[index] = duplicates[index] || {};
        duplicates[index].mobileNumber = "Duplicate Mobile Number.";
      } else {
        phoneNumbers.add(candidate.mobileNumber);
      }
 
      if (emails.has(candidate.email)) {
        duplicates[index] = duplicates[index] || {};
        duplicates[index].email = "Duplicate Email.";
      } else {
        emails.add(candidate.email);
      }
    });
    return duplicates;
  };
 
  const duplicates = getDuplicates();
  const hasDuplicates = Object.keys(duplicates).length > 0;
 
  const removeFile = () => {
    setEditableCandidates([]);
    setFileName('');
  };
 
  const filteredCandidates = editableCandidates.filter(candidate =>
    candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.mobileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);
  const displayedCandidates = filteredCandidates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* <h2 className="text-2xl font-bold mb-4 text-center">Bulk Add Candidate</h2> */}
      <div {...getRootProps({ className: 'border-2  border-dashed border-[#27235C] rounded-lg p-6 mb-4 cursor-pointer' })}>
        <input {...getInputProps()} />
        <p className="text-center">{fileName || "Drag 'n' drop some files here, or click to select files"}</p>
      </div>
      <div className="flex justify-between mb-4">
        <button onClick={removeFile} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out mr-4">
          Remove File
        </button>
        <button onClick={downloadTemplate} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out">
          Download Template
        </button>
      </div>
 
     
 
      {editableCandidates.length > 0 && (
        <>
         <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      />
          <h3 className="text-xl font-semibold mb-2">Candidate Preview - Showing {displayedCandidates.length} Candidates</h3>
 
          <table className="min-w-full border-collapse border border-gray-300 mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-b border-gray-400 p-2 text-left">Select</th>
                {['First Name', 'Last Name', 'Mobile Number', 'Email', 'Experience', 'Resume', 'Skill', 'Location', 'PAN Number'].map((itm, idx) => (
                  <th key={idx} className="border-b border-gray-400 p-2 text-left">{itm}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedCandidates.map((candidate, index) => (
                <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${duplicates[index] ? 'bg-yellow-300 font-bold' : ''}`}>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="checkbox"
                      checked={selectedForDeletion.has(index)}
                      onChange={() => toggleSelected(index)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  {['firstName', 'lastName', 'mobileNumber', 'email', 'experience', 'resume', 'skill', 'location', 'panNumber'].map((field, idx) => (
                    <td key={idx} className="border border-gray-400 p-2">
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={candidate[field]}
                        onChange={(e) => handleChange(index, field, e.target.value)}
                        className={`border-2 rounded-lg w-full p-2 transition-all duration-150 focus:outline-none focus:ring-2 ${errorMessages[index] && errorMessages[index][field] ? 'border-red-500' : 'border-gray-300'} focus:ring-[#27235C]`}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
                      />
                      {duplicates[index] && duplicates[index][field] && (
                        <p className="text-red-600 text-xs mt-1">{duplicates[index][field]}</p>
                      )}
                      {errorMessages[index] && errorMessages[index][field] && (
                        <p className="text-red-600 text-xs mt-1">{errorMessages[index][field]}</p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div className="flex justify-between mb-4">
            <button onClick={deleteSelectedCandidates} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out mr-4">
              Delete Selected Candidates
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Submitting...' : hasDuplicates ? 'Submit (Fix Duplicates)' : 'Submit Candidates'}
            </button>
          </div> */}
 
          <div className="flex justify-between mb-4">
            <button onClick={deleteSelectedCandidates} className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out mr-4">
              Delete Selected Candidates
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out"
              disabled={loading || hasDuplicates} // Disable the button when there are duplicates
            >
              {loading ? 'Submitting...' : hasDuplicates ? 'Submit (After fix Duplication)' : 'Submit Candidates'}
            </button>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out mr-2"
            >
              Previous
            </button>
            <span className="mt-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#332c94] transition duration-200 ease-in-out ml-2"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
 
 
// Main Component
const CandidateManagement = () => {
  const [isBulkAdd, setIsBulkAdd] = useState(false);
 
  const toggleMode = () => {
    setIsBulkAdd((prev) => !prev);
  };
 
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Add Candidate</h1>
      <div className="flex justify-center mb-4 space-x-4">
        <button
          className={`py-2 px-4 rounded-lg ${!isBulkAdd ? 'bg-[#27235C] text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={toggleMode}
        >
          Add Candidate
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${isBulkAdd ? 'bg-[#27235C] text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={toggleMode}
        >
          Bulk Add Candidates
        </button>
      </div>
      {isBulkAdd ? <BulkAddCandidate /> : <AddCandidateParse />}
    </div>
  );
};
 
export default CandidateManagement;