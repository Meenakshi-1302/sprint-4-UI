// import { faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const InvalidDataModal = ({ isOpen, data, onClose }) => {
//     if (!isOpen) return null;
  
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-semibold text-red-600 flex items-center">
//                 <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
//                 Invalid Records
//               </h3>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//               >
//                 <FontAwesomeIcon icon={faTimes} className="text-xl" />
//               </button>
//             </div>
//           </div>
//           <div className="p-6 overflow-auto max-h-[60vh]">
//             <div className="space-y-4">
//               {data.map((record, index) => (
//                 <div key={index} className="bg-red-50 p-4 rounded-lg">
//                   <h4 className="font-medium text-red-700 mb-2">Record #{index + 1}</h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     {Object.entries(record).map(([key, value]) => (
//                       <div key={key} className="text-sm">
//                         <span className="font-medium text-gray-700">{key}: </span>
//                         <span className="text-red-600">{value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="p-6 border-t border-gray-200">
//             <button
//               onClick={onClose}
//               className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };
  

// import React from 'react'

// function InvalidDataModal() {
    
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default InvalidDataModal
