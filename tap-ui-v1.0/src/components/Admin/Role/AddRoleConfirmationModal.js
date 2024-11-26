// import React from 'react';

// const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//             <div className="bg-white p-5 rounded shadow-lg">
//                 <h2 className="text-lg font-semibold">Are you sure you want to submit?</h2>
//                 <div className="flex justify-between mt-4">
//                     <button 
//                         className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
//                         onClick={() => {
//                             onConfirm(); // This will add the role
//                             onClose();   // Close the modal
//                         }}
//                     >
//                         Yes
//                     </button>
//                     <button 
//                         className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
//                         onClick={onClose}
//                     >
//                         No
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ConfirmationModal;