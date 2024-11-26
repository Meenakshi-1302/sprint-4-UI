import React, { useState, useEffect } from 'react';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { uploadCandidateDocuments } from '../../../services/Candidate/UploadDocumentService';
 
const CandidateUploadDocumentPage = () => {
    const [documents, setDocuments] = useState({});
    const candidateId = sessionStorage.getItem("candidateId");
    const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
 
    const handleFileChange = (doc, e) => {
        const file = e.target.files[0];
        if (file) {
            if (documents[doc]) {
                alert(`${doc} has already been uploaded. You cannot upload it again.`);
                e.target.value = '';
                return;
            }
 
            const newDoc = {
                name: file.name,
                url: URL.createObjectURL(file)
            };
            setDocuments(prevDocuments => ({
                ...prevDocuments,
                [doc]: newDoc
            }));
        }
    };
 
    useEffect(() => {
        setAllDocumentsUploaded(Object.keys(documents).length === 7); // Adjust according to expected documents
    }, [documents]);
 
    const handleUpload = async () => {
        if (!candidateId) {
            alert('Candidate ID not found in session storage.');
            return;
        }
 
        setIsUploading(true);
       
        try {
            const response = await uploadCandidateDocuments(candidateId, Object.values(documents));
            console.log('Documents uploaded successfully:', response);
            alert('Documents uploaded successfully!');
            setDocuments({});
            setAllDocumentsUploaded(false);
        } catch (error) {
            console.error('Error uploading documents:', error);
            alert(`Error uploading documents: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };
 
    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white relative">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 p-2 rounded-full text-[#27235C]"
            >
                <FaArrowLeft size={20} />
            </button>
 
            <h1 className="text-2xl font-bold mb-6 text-center text-[#27235C]">Upload Documents</h1>
 
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mx-auto"> {/* Centered the grid */}
 
                {/* 10th Marksheet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        10th Marksheet
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("10th Marksheet", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["10th Marksheet"] ? (
                                <span className="text-gray-600 truncate">{documents["10th Marksheet"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* Repeating for other documents */}
                {/* 12th Marksheet */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        12th Marksheet
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("12th Marksheet", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["12th Marksheet"] ? (
                                <span className="text-gray-600 truncate">{documents["12th Marksheet"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* UG Certificate */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        UG Certificate
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("UG Certificate", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["UG Certificate"] ? (
                                <span className="text-gray-600 truncate">{documents["UG Certificate"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* PAN Card */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        PAN Card
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("PAN Card", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["PAN Card"] ? (
                                <span className="text-gray-600 truncate">{documents["PAN Card"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* Experience Letter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Experience Letter
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("Experience Letter", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["Experience Letter"] ? (
                                <span className="text-gray-600 truncate">{documents["Experience Letter"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* Payslip */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Payslip
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("Payslip", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["Payslip"] ? (
                                <span className="text-gray-600 truncate">{documents["Payslip"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* Aadhar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Aadhar
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("Aadhar", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["Aadhar"] ? (
                                <span className="text-gray-600 truncate">{documents["Aadhar"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
 
                {/* Passport */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Passport
                    </label>
                    <div className="relative w-full">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange("Passport", e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
                            {documents["Passport"] ? (
                                <span className="text-gray-600 truncate">{documents["Passport"].name}</span>
                            ) : (
                                <span className="text-gray-400 flex items-center">
                                    No file chosen
                                    <FaUpload className="ml-2 text-[#27235C]" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
 
            <p className="text-red-500 text-sm mt-4 text-center">
                * Only PDF files are allowed
            </p>
 
            {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mx-auto max-w-md">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}
 
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleUpload}
                    disabled={!allDocumentsUploaded || isUploading}
                    className={`text-white px-6 py-2 rounded-lg transition duration-300 ${allDocumentsUploaded ? 'bg-[#27235C] hover:bg-[#1C1A4E]' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </div>
    );
};
 
export default CandidateUploadDocumentPage;


// import React, { useState, useEffect } from 'react';
// import { FaUpload, FaArrowLeft } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { uploadCandidateDocuments } from '../../../services/Candidate/UploadDocumentService';

// const CandidateUploadDocumentPage = () => {
//     const [documents, setDocuments] = useState({});
//     const candidateId = sessionStorage.getItem("candidateId");
//     const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [isUploading, setIsUploading] = useState(false);
//     const navigate = useNavigate();

//     const handleFileChange = (doc, e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (documents[doc]) {
//                 alert(`${doc} has already been uploaded. You cannot upload it again.`);
//                 e.target.value = '';
//                 return;
//             }

//             const newDoc = {
//                 name: file.name,
//                 url: URL.createObjectURL(file), // Keep this for displaying purposes if needed
//                 data: file // Include the raw file object here
//             };

//             setDocuments(prevDocuments => ({
//                 ...prevDocuments,
//                 [doc]: newDoc
//             }));
//         }
//     };

//     useEffect(() => {
//         // Check the total number of uploaded documents
//         setAllDocumentsUploaded(Object.keys(documents).length === 8); // There are 8 documents to upload
//     }, [documents]);

//     const handleUpload = async () => {
//         if (!candidateId) {
//             alert('Candidate ID not found in session storage.');
//             return;
//         }

//         setIsUploading(true);

//         // Create FormData object to send all files
//         const formData = new FormData();
//         formData.append('candidateId', candidateId); // Add candidateId

//         // Append each document's file to FormData
//         Object.keys(documents).forEach(doc => {
//             formData.append(doc, documents[doc].data); // Append each file
//         });

//         for (const [key, value] of formData.entries()) {
//             console.log(`${key}:`, value); // Log each key-value pair
//         }

//         try {
//             const response = await uploadCandidateDocuments(formData, setUploadProgress);
//             console.log('Documents uploaded successfully:', response);
//             alert('Documents uploaded successfully!');
//             setDocuments({});
//             setAllDocumentsUploaded(false);
//         } catch (error) {
//             console.error('Error uploading documents:', error);
//             alert(`Error uploading documents: ${error.message}`);
//         } finally {
//             setIsUploading(false);
//             setUploadProgress(0);
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white relative">
//             <button
//                 onClick={() => navigate(-1)}
//                 className="absolute top-4 left-4 p-2 rounded-full text-[#27235C]"
//             >
//                 <FaArrowLeft size={20} />
//             </button>

//             <h1 className="text-2xl font-bold mb-6 text-center text-[#27235C]">Upload Documents</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mx-auto">

//                 {/* 10th Marksheet */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         10th Marksheet
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("10th Marksheet", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["10th Marksheet"] ? (
//                                 <span className="text-gray-600 truncate">{documents["10th Marksheet"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* 12th Marksheet */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         12th Marksheet
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("12th Marksheet", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["12th Marksheet"] ? (
//                                 <span className="text-gray-600 truncate">{documents["12th Marksheet"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* UG Certificate */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         UG Certificate
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("UG Certificate", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["UG Certificate"] ? (
//                                 <span className="text-gray-600 truncate">{documents["UG Certificate"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* PAN Card */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         PAN Card
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("PAN Card", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["PAN Card"] ? (
//                                 <span className="text-gray-600 truncate">{documents["PAN Card"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Experience Letter */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         Experience Letter
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("Experience Letter", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["Experience Letter"] ? (
//                                 <span className="text-gray-600 truncate">{documents["Experience Letter"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Payslip */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         Payslip
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("Payslip", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["Payslip"] ? (
//                                 <span className="text-gray-600 truncate">{documents["Payslip"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Aadhar */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         Aadhar
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("Aadhar", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["Aadhar"] ? (
//                                 <span className="text-gray-600 truncate">{documents["Aadhar"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Passport */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
//                         Passport
//                     </label>
//                     <div className="relative w-full">
//                         <input
//                             type="file"
//                             accept=".pdf"
//                             onChange={(e) => handleFileChange("Passport", e)}
//                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div className="flex items-center justify-between px-4 py-2 border-2 border-dashed border-[#27235C] rounded-md bg-gray-50 cursor-pointer transition duration-300 hover:border-blue-500">
//                             {documents["Passport"] ? (
//                                 <span className="text-gray-600 truncate">{documents["Passport"].name}</span>
//                             ) : (
//                                 <span className="text-gray-400 flex items-center">
//                                     No file chosen
//                                     <FaUpload className="ml-2 text-[#27235C]" />
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//             </div>

//             <p className="text-red-500 text-sm mt-4 text-center">
//                 * Only PDF files are allowed
//             </p>

//             {isUploading && (
//                 <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mx-auto max-w-md">
//                     <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
//                 </div>
//             )}

//             <div className="flex justify-center mt-6">
//                 <button
//                     onClick={handleUpload}
//                     disabled={!allDocumentsUploaded || isUploading}
//                     className={`text-white px-6 py-2 rounded-lg transition duration-300 ${allDocumentsUploaded ? 'bg-[#27235C] hover:bg-[#1C1A4E]' : 'bg-gray-400 cursor-not-allowed'}`}
//                 >
//                     {isUploading ? 'Uploading...' : 'Upload'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default CandidateUploadDocumentPage;