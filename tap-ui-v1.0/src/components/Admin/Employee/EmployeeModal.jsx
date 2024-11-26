import React from "react";
import EmployeeCreation from "./EmployeeCreationForm"; // Import your EmployeeCreation component
 
const EmployeeModal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl font-bold"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Create Employee</h2>
            {/* <div className="overflow-hidden"> 
              <EmployeeCreation onClose={onClose} />
            </div> */}
            <EmployeeCreation onClose={onClose}/>
          </div>
        </div>
      )}
    </>
  );
};
 
export default EmployeeModal;