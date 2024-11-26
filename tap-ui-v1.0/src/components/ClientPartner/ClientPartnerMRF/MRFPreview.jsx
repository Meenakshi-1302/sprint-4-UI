// import React, { useState } from 'react';

// import SOWDocument from './SOWDocument';

// const MRFPreview = ({ formData ,requirementDetails , subRequirementDetails}) => {
//   const itemsPerPage = 5; // Number of records per page
//   const [currentPage, setCurrentPage] = useState(0);

//   // Use Object.entries to get an array of [key, value]
//   const entries = Object.entries(formData);
//   const totalRecords = entries.length;

//   // Calculate the starting and ending index of items for the current page
//   const start = currentPage * itemsPerPage;
//   const end = start + itemsPerPage;
//   const currentRecords = entries.slice(start, end);

//   // Function to handle page navigation
//   const handleNext = () => {
//     if ((currentPage + 1) * itemsPerPage < totalRecords) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };



//   return (
//     <div className="overflow-x-auto">
//        <SOWDocument formData1={formData} requirementDetails={requirementDetails} subRequirementDetails={subRequirementDetails}/>
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600">
//             <th className="py-2 px-4 border-b text-left">Field</th>
//             <th className="py-2 px-4 border-b text-left">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map(([key, value]) => (
//             <tr key={key} className="hover:bg-gray-100">
//               <td className="py-2 px-4 border-b font-medium">{key.replace(/([A-Z])/g, " $1")}</td>
//               <td className="py-2 px-4 border-b text-gray-700">
//                 {key === "sla" && value ? value.name : Array.isArray(value) ? value.join(", ") : value || "N/A"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="flex justify-between mt-4">
//         <button
//           onClick={handlePrevious}
//           disabled={currentPage === 0}
//           className={`px-4 py-2 text-white bg-blue-500 rounded ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={(currentPage + 1) * itemsPerPage >= totalRecords}
//           className={`px-4 py-2 text-white bg-blue-500 rounded ${ (currentPage + 1) * itemsPerPage >= totalRecords ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           Next
//         </button>
//       </div>
//       <p className="mt-2 text-gray-600">
//         Page {currentPage + 1} of {Math.ceil(totalRecords / itemsPerPage)}
//       </p>
//     </div>
//   );
// };

// export default MRFPreview;

// import React, { useState } from 'react';
// import SOWDocument from './SOWDocument';

// // Modal component for rendering content
// const Modal = ({ isOpen, onClose, children }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//             <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
//             <div className="bg-white p-5 rounded-lg shadow-xl 
//                 relative overflow-y-auto"
//                 style={{ 
//                     width: '80%', 
//                     maxWidth: '800px', 
//                     maxHeight: '90%' 
//                 }}>
//                 <button 
//                     onClick={onClose} 
//                     className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
//                     aria-label="Close"
//                 >
//                     &times; {/* Close button */}
//                 </button>
//                 <h1 className="text-lg font-bold mb-4 text-center">SOW Document Preview</h1>
//                 <div>{children}</div>
//             </div>
//         </div>
//     );
// };

// const MRFPreview = ({ formData, requirementDetails, subRequirementDetails }) => {
//     const itemsPerPage = 5; // Number of records per page
//     const [currentPage, setCurrentPage] = useState(0);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const entries = Object.entries(formData);
//     const totalRecords = entries.length;

//     const start = currentPage * itemsPerPage;
//     const end = start + itemsPerPage;
//     const currentRecords = entries.slice(start, end);

//     const handleNext = () => {
//         if ((currentPage + 1) * itemsPerPage < totalRecords) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentPage > 0) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     return (
//         <div className="overflow-x-auto">
//             <button
//                 onClick={() => setIsModalOpen(true)} 
//                 className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
//             >
//                 Preview SOW Document
//             </button>

//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <SOWDocument formData1={formData} requirementDetails={requirementDetails} subRequirementDetails={subRequirementDetails} />
//             </Modal>

//             <table className="min-w-full bg-white border border-gray-300">
//                 <thead>
//                     <tr className="bg-gray-200 text-gray-600">
//                         <th className="py-2 px-4 border-b text-left">Field</th>
//                         <th className="py-2 px-4 border-b text-left">Value</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentRecords.map(([key, value]) => (
//                         <tr key={key} className="hover:bg-gray-100">
//                             <td className="py-2 px-4 border-b font-medium">{key.replace(/([A-Z])/g, " $1")}</td>
//                             <td className="py-2 px-4 border-b text-gray-700">
//                                 {key === "sla" && value ? value.name : Array.isArray(value) ? value.join(", ") : value || "N/A"}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>


//             <div className="flex justify-between mt-4">
//                 <button
//                     onClick={handlePrevious}
//                     disabled={currentPage === 0}
//                     className={`px-4 py-2 text-white bg-blue-500 rounded ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     Previous
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     disabled={(currentPage + 1) * itemsPerPage >= totalRecords}
//                     className={`px-4 py-2 text-white bg-blue-500 rounded ${ (currentPage + 1) * itemsPerPage >= totalRecords ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                     Next
//                 </button>
//             </div>
//             <p className="mt-2 text-gray-600">
//                 Page {currentPage + 1} of {Math.ceil(totalRecords / itemsPerPage)}
//             </p>

//         </div>


//     );
// };

// export default MRFPreview;

// import React, { useState } from 'react';
// import SOWDocument from './SOWDocument';
// import { toast } from 'react-toastify'; // Ensure this is imported for notifications

// // Modal component for rendering content
// const Modal = ({ isOpen, onClose, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
//       <div
//         className="bg-white p-5 rounded-lg shadow-xl relative overflow-y-auto"
//         style={{
//           width: '80%',
//           maxWidth: '800px',
//           maxHeight: '90%'
//         }}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
//           aria-label="Close"
//         >
//           &times; {/* Close button */}
//         </button>
//         <h1 className="text-lg font-bold mb-4 text-center">SOW Document Preview</h1>
//         <div>{children}</div>
//       </div>
//     </div>
//   );
// };

// const MRFPreview = ({ formData, requirementDetails, subRequirementDetails, setFormData }) => {
//   const itemsPerPage = 5; // Number of records per page
//   const [currentPage, setCurrentPage] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const entries = Object.entries(formData);
//   const totalRecords = entries.length;

//   const start = currentPage * itemsPerPage;
//   const end = start + itemsPerPage;
//   const currentRecords = entries.slice(start, end);

//   const handleNext = () => {
//     if ((currentPage + 1) * itemsPerPage < totalRecords) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
//       >
//         Preview SOW Document
//       </button>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <SOWDocument formData1={formData} requirementDetails={requirementDetails} subRequirementDetails={subRequirementDetails} />
//       </Modal>

//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200 text-gray-600">
//             <th className="py-2 px-4 border-b text-left">Field</th>
//             <th className="py-2 px-4 border-b text-left">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map(([key, value]) => (
//             <tr key={key} className="hover:bg-gray-100">
//               <td className="py-2 px-4 border-b font-medium">{key.replace(/([A-Z])/g, " $1")}</td>
//               <td className="py-2 px-4 border-b text-gray-700">
//                 {key === "sla" && value ? value.name : Array.isArray(value) ? value.join(", ") : value || "N/A"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="grid grid-cols-1 gap-4">
        
//         {/* Upload field for SLA */}
//         <div className="flex flex-col my-2">
//           <span className="font-medium">Upload SOW PDF (SLA Field):</span>
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) {
//                 // setFormData(prev => ({ ...prev, sla: file })); 
//                 formData.sla = file// Store the uploaded file in the SLA field
//                 toast.success(`${file.name} has been uploaded to SLA!`);
//               }
//             }}
//             className="mt-2 border border-gray-300 rounded-md p-2"
//           />
//         </div>
//       </div>

//       <div className="flex justify-between mt-4">
//         <button
//           onClick={handlePrevious}
//           disabled={currentPage === 0}
//           className={`px-4 py-2 text-white bg-blue-500 rounded ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={(currentPage + 1) * itemsPerPage >= totalRecords}
//           className={`px-4 py-2 text-white bg-blue-500 rounded ${(currentPage + 1) * itemsPerPage >= totalRecords ? 'opacity-50 cursor-not-allowed' : ''}`}
//         >
//           Next
//         </button>
//       </div>
//       <p className="mt-2 text-gray-600">
//         Page {currentPage + 1} of {Math.ceil(totalRecords / itemsPerPage)}
//       </p>
//     </div>
//   );
// };

// export default MRFPreview;


import React, { useState } from 'react';
import SOWDocument from './SOWDocument';
import { toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
            <div
                className="bg-white p-5 rounded-lg shadow-xl relative overflow-y-auto"
                style={{
                    width: '80%',
                    maxWidth: '800px',
                    maxHeight: '90%'
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
                    aria-label="Close"
                >
                    &times; {/* Close button */}
                </button>
                <h1 className="text-lg font-bold mb-4 text-center">SOW Document</h1>
                <div>{children}</div>
            </div>
        </div>
    );
};

const MRFPreview = ({ formData, requirementDetails, subRequirementDetails, setFormData, onSOWDocumentUpload }) => {
    const itemsPerPage = 5; // Number of records per page
    const [currentPage, setCurrentPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const entries = Object.entries(formData);
    const totalRecords = entries.length;

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const currentRecords = entries.slice(start, end);

    const handleNext = () => {
        if ((currentPage + 1) * itemsPerPage < totalRecords) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            formData.sla = file;
            toast.success(`${file.name} has been uploaded to SLA!`);
            // Notify parent component about file upload
            onSOWDocumentUpload(true);
        }
    };

    return (
        <div className="overflow-x-auto">
            

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <SOWDocument formData1={formData} requirementDetails={requirementDetails} subRequirementDetails={subRequirementDetails} />
            </Modal>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200 text-gray-600">
                        <th className="py-2 px-4 border-b text-left">Field</th>
                        <th className="py-2 px-4 border-b text-left">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b font-medium">{key.replace(/([A-Z])/g, " $1")}</td>
                            <td className="py-2 px-4 border-b text-gray-700">
                                {key === "sla" && value ? value.name : Array.isArray(value) ? value.join(", ") : value || "N/A"}
                            </td>
                        </tr>
                    ))}
                    {/* Pagination controls inside the table */}
                    <tr>
                        <td colSpan={2} className="py-4 px-4 text-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 0}
                                className={`mx-2 text-gray-500 hover:text-blue-500 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Previous Page"
                            >
                                &larr; {/* Left arrow */}
                            </button>
                            <span className="text-gray-600">
                                Page {currentPage + 1} of {Math.ceil(totalRecords / itemsPerPage)}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={(currentPage + 1) * itemsPerPage >= totalRecords}
                                className={`mx-2 text-gray-500 hover:text-blue-500 ${ (currentPage + 1) * itemsPerPage >= totalRecords ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Next Page"
                            >
                                &rarr; {/* Right arrow */}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 mt-4 px-4 py-2 bg-[#27235c] text-white rounded"
            >
                SOW Document Creation 
            </button>

            <div className="grid grid-cols-1 gap-4">
                {/* Upload field for SLA */}
                <div className="flex flex-col my-2">
                    <span className="font-medium">Upload SOW PDF:</span>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        // onChange={(e) => {
                        //     const file = e.target.files[0];
                        //     if (file) {
                        //         formData.sla = file; // Store the uploaded file in the SLA field
                        //         toast.success(`${file.name} has been uploaded to SLA!`);
                        //     }
                        // }}
                        className="mt-2 border border-gray-300 rounded-md p-2"
                    />
                </div>
            </div>
        </div>
    );
};

export default MRFPreview;