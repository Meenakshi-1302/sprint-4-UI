import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAdminRole } from '../../../services/Admin/Role/AdminRoleService';
import { getAllDepartments } from '../../../services/Admin/Department/DepartmentService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AdminAddRole = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State for form fields
    const [roleData, setRoleData] = useState({
        roleName: '',
        roleDescription: '',
        departmentId: '',
    });
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state to control error visibility

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const departmentsData = await getAllDepartments();
                const departmentOptions = departmentsData
                    .filter(department => department && department.departmentId && department.departmentName) // Filter out invalid data
                    .map(department => ({
                        value: department.departmentId, // departmentId as value
                        label: department.departmentName, // Only use departmentName for the label
                    }));
                setDepartments(departmentOptions);
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };

        fetchDepartments();
    }, [dispatch]);

    // Reset form fields when modal is closed
    const resetForm = () => {
        setRoleData({
            roleName: '',
            roleDescription: '',
            departmentId: '',
        });
        setErrors({});
        setIsSubmitted(false);
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    // Validate the fields before submission
    const validateFields = () => {
        const newErrors = {};

        if (!roleData.roleName) newErrors.roleName = 'Role Name is required';
        if (!roleData.roleDescription) newErrors.roleDescription = 'Role Description is required';
        if (!roleData.departmentId) newErrors.departmentId = 'Department is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark the form as submitted to show validation errors
        setIsSubmitted(true);

        // Validate the fields
        if (!validateFields()) return; // Stop submission if validation fails

        const dataToSend = {
            roleName: roleData.roleName,
            roleDescription: roleData.roleDescription,
            department: { departmentId: roleData.departmentId },
        };

        try {
            await addAdminRole(dataToSend);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Role added successfully!',
                confirmButtonText: 'Okay',
            }).then(() => {
                navigate("/admindash");
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Failed to add role:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to add role. Please try again.',
                confirmButtonText: 'Okay',
            });
        }
    };

    // Handle input change for fields
    const handleTextInputChange = (e, fieldName) => {
        const value = e.target.value;

        // If field is for Role Description, allow specific symbols
        if (fieldName === 'roleDescription') {
            const textOnlyValue = value.replace(/[^a-zA-Z\s&,/-]/g, ''); // Allow letters, spaces, and specific symbols
            setRoleData({
                ...roleData,
                [fieldName]: textOnlyValue,
            });
        } else {
            // For Role Name, restrict to letters and spaces only
            const textOnlyValue = value.replace(/[^a-zA-Z\s]/g, '');
            setRoleData({
                ...roleData,
                [fieldName]: textOnlyValue,
            });
        }
    };

    // Handle select field change for department
    const handleSelectChange = (selectedOption) => {
        setRoleData({
            ...roleData,
            departmentId: selectedOption ? selectedOption.value : '',
        });

        // Clear error for department field once selection is made
        if (errors.departmentId) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.departmentId;
                return newErrors;
            });
        }
    };

    // Function to apply red outline if there's an error
    const inputClass = (fieldName) => {
        // Apply red border for regular inputs
        if (errors[fieldName] && isSubmitted) {
            return 'border-red-600 focus:ring-red-500 focus:ring-1';
        }

        // Special case for select (dropdown)
        if (fieldName === 'departmentId' && errors.departmentId && isSubmitted) {
            return 'border-red-600 focus:ring-red-500 focus:ring-1';
        }

        return 'border-[#27235E] focus:ring-[#27235E] focus:ring-1';
    };

    // Handle input field focus to reset the border color
    const handleFocus = (fieldName) => {
        if (errors[fieldName]) {
            // Reset the error when the user focuses on the field
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-500">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-3xl font-bold text-red-600 hover:text-red-800 transition-all"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4">Add New Role</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Role Name Input */}
                    <label className="block">
                        <span className="text-gray-700">Role Name</span>
                        <input
                            type="text"
                            value={roleData.roleName}
                            onChange={(e) => handleTextInputChange(e, 'roleName')}
                            onFocus={() => handleFocus('roleName')}
                            placeholder="Enter role name"
                            className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 mt-2 ${inputClass('roleName')}`}
                        />
                        {errors.roleName && isSubmitted && <span className="text-red-600 text-xs mt-1">{errors.roleName}</span>}
                    </label>

                    {/* Role Description Input */}
                    <label className="block">
                        <span className="text-gray-700">Role Description</span>
                        <input
                            type="text"
                            value={roleData.roleDescription}
                            onChange={(e) => handleTextInputChange(e, 'roleDescription')}
                            onFocus={() => handleFocus('roleDescription')}
                            placeholder="Enter role description"
                            className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 mt-2 ${inputClass('roleDescription')}`}
                        />
                        {errors.roleDescription && isSubmitted && <span className="text-red-600 text-xs mt-1">{errors.roleDescription}</span>}
                    </label>

                    {/* Department Select */}
                    <label className="block">
                        <span className="text-gray-700">Department</span>
                        <Select
                            value={departments.find(department => department.value === roleData.departmentId)}
                            onChange={handleSelectChange}
                            options={departments}
                            placeholder="Select Department"
                            isSearchable
                            className={`w-full mt-2 ${inputClass('departmentId')}`}
                        />
                        {errors.departmentId && isSubmitted && <span className="text-red-600 text-xs mt-1">{errors.departmentId}</span>}
                    </label>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-[#27235E] w-full p-2 text-white rounded hover:bg-[#1E1A4D] transition duration-200"
                        // style={{
                        //     background: "linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))",
                        // }}
                    >
                        Add Role
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAddRole;