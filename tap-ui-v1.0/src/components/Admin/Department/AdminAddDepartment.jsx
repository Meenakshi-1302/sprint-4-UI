import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAdminDepartmentAction } from '../../../redux/actions/Admin/Department/AdminDepartmentActions'; // Import action creator
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';

const AdminAddDepartment = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for form fields
  const [departmentName, setDepartmentName] = useState('');
  const [description, setDescription] = useState('');
  // Error state for field validation
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state to control error visibility

  // Function to reset form fields when modal is closed
  const resetForm = () => {
    setDepartmentName('');
    setDescription('');
    setErrors({});
    setIsSubmitted(false);
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Function to validate all fields before submission
  const validateFields = () => {
    const newErrors = {};

    if (!departmentName) newErrors.departmentName = 'Department Name is required';
    if (!description) newErrors.description = 'Department Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    if (!validateFields()) return; // Stop submission if validation fails

    // Prepare the data to be dispatched
    const newDepartment = {
      departmentName,
      description,
    };

    // Dispatch action to add the department
    try {
      dispatch(addAdminDepartmentAction(newDepartment))
        .then(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Department added successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate("/admindash");
            onClose();
          });
        });
    } catch (error) {
      // Show error Swal message if there is an issue with the submission
      Swal.fire({
        title: 'Error!',
        text: error?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Handle change for fields that should accept only text (no numbers or symbols for Department Name)
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

  // Function to apply red outline if there's an error
  const inputClass = (fieldName) => {
    if (errors[fieldName] && isSubmitted) {
      return 'border-red-600 focus:ring-red-500 focus:ring-1';
    }

    return 'border-[#27235E] focus:ring-[#27235E] focus:ring-1';
  };

  // Handle input field focus to reset the border color
  const handleFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-500"
          style={{
            transform: isOpen ? 'scale(1)' : 'scale(0.8)', // Minimized to full size on open
            opacity: isOpen ? 1 : 0, // Fade in/out effect
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-[#27235E]">Add New Department</h3>
            <button
              onClick={() => {
                onClose();
                resetForm(); // Reset form state when closing the modal
              }}
              className="text-3xl font-bold text-red-600 hover:text-red-800 transition-all p-2"
              style={{ lineHeight: '1', padding: '10px' }}
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Department Name Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[#27235E]">Department Name</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => handleTextInputChange(e, setDepartmentName)}
                onFocus={() => handleFocus('departmentName')}
                placeholder="Enter department name"
                className={`border p-3 rounded-lg shadow-sm focus:outline-none h-12 mt-2 ${inputClass('departmentName')}`}
              />
              {errors.departmentName && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.departmentName}</span>
              )}
            </div>

            {/* Department Description Input */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[#27235E]">Department Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => handleTextInputChange(e, setDescription, true)} // Call with true to allow specific characters
                onFocus={() => handleFocus('description')}
                placeholder="Enter department description"
                className={`border p-3 rounded-lg shadow-sm focus:outline-none h-12 mt-2 ${inputClass('description')}`}
              />
              {errors.description && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.description}</span>
              )}
            </div>

            {/* Create Department Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-[#27235E] w-full p-2 text-white rounded-lg  hover:bg-[#1C1A4E] text-sm transition duration-200"
                // style={{
                //   background: 'linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))',
                // }}
              >
                Create Department
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AdminAddDepartment;