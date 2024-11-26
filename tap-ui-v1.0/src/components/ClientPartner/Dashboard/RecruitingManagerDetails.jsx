import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// RecruitingManagerDetails Component
function RecruitingManagerDetails({ employee, closeModal }) {
    if (!employee) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 relative">
            <button 
          className="absolute top-2 right-2"
          onClick={closeModal}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} style={{ color: 'red', cursor: 'pointer', fontSize: '1.5rem' }} />
        </button>

                <h2 className="text-xl font-bold text-center mb-4">Recruiting Manager Details</h2>

                <div>
                    <label className="font-semibold text-left">ID:</label>
                    <p className="text-right">{employee.employeeId}</p>

                    <label className="font-semibold text-left">Email:</label>
                    <p className="text-right">{employee.employeeEmail}</p>

                    <label className="font-semibold text-left">Status:</label>
                    <p className="text-right">{employee.employeeStatus}</p>

                    <label className="font-semibold text-left">Role:</label>
                    <p className="text-right">{employee.role?.roleName || 'N/A'}</p>

                    <label className="font-semibold text-left">Department:</label>
                    <p className="text-right">{employee.role?.department?.departmentName || 'N/A'}</p>

                    <label className="font-semibold text-left">Location:</label>
                    <p className="text-right">{employee.role?.workLocation || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}

export default RecruitingManagerDetails;