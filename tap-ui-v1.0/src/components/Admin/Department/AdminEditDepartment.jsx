import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateDepartmentAction } from '../../../redux/actions/Admin/Department/AdminDepartmentActions'; // Action to update department
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from "react-router-dom";

const AdminEditDepartment = ({ isOpen, onClose, department }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(''); // Add error message state

  useEffect(() => {
    if (isOpen && department) {
      setDepartmentName(department.departmentName);
      setDescription(department.description);
      setErrors({}); // Reset errors when editing a new department
      setErrorMessage(''); // Reset error message
    }
  }, [isOpen, department]);

  // Validate fields before submitting
  const validateFields = () => {
    const newErrors = {};
    if (!departmentName.trim()) newErrors.departmentName = 'Department Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateFields()) return;

    setIsLoading(true); // Set loading state to true while the department is being updated
    setErrorMessage(''); // Reset any previous error messages

    const updatedDepartment = {
      departmentName: departmentName.trim(),
      description: description.trim(),
    };

    try {
      await dispatch(updateDepartmentAction(department.departmentId, updatedDepartment)); // Dispatch update action
      setIsLoading(false);
      Swal.fire({
        title: 'Success!',
        text: 'Department updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        onClose();
        navigate("/admindash");
      });
    } catch (error) {
      setIsLoading(false); // Stop loading state
      setErrorMessage('Failed to update department. Please try again later.');
    }
  };

  // Handle change for fields that accept specific characters
  const handleTextInputChange = (e, setterFunction, allowSpecificChars = false) => {
    const value = e.target.value;
    if (allowSpecificChars) {
      // Allow letters, spaces, &, /, -, and ,
      const textOnlyValue = value.replace(/[^a-zA-Z\s&,/-]/g, ''); 
      setterFunction(textOnlyValue);
    } else {
      // Allow letters and spaces only for the Department Name
      const textOnlyValue = value.replace(/[^a-zA-Z\s]/g, '');
      setterFunction(textOnlyValue);
    }
  };

  // Input class for validation
  const inputClass = (fieldName) => {
    if (errors[fieldName] && isSubmitted) {
      return 'border-red-600 focus:ring-red-500 focus:ring-1';
    }
    return 'border-[#27235E] focus:ring-[#27235E] focus:ring-1';
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#27235E]">Edit Department</h3>
            <button
              onClick={() => {
                onClose();
                setDepartmentName('');
                setDescription('');
                setErrors({});
                setIsSubmitted(false);
                setErrorMessage('');
              }}
              className="text-3xl font-bold text-red-600 hover:text-red-800 transition-all p-2"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">

            {/* Department Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-[#27235E]">Department Name</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => handleTextInputChange(e, setDepartmentName)} // Use handleTextInputChange here
                className={`border p-2 rounded-lg shadow-sm focus:outline-none h-10 ${inputClass('departmentName')}`}
              />
              {errors.departmentName && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.departmentName}</span>
              )}
            </div>

            {/* Department Description */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-[#27235E]">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => handleTextInputChange(e, setDescription, true)} // Use handleTextInputChange here with true
                className={`border p-2 rounded-lg shadow-sm focus:outline-none h-10 ${inputClass('description')}`}
              />
              {errors.description && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.description}</span>
              )}
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
            )}

            {/* Update Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isLoading} // Disable the button while loading
                className={`bg-[#27235E] text-white rounded-lg px-6 py-3 shadow-lg hover:bg-[#1C1A4E] w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Updating...' : 'Update Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AdminEditDepartment;