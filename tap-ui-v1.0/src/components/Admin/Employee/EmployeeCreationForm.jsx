import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createEmployee } from "../../../redux/actions/Admin/Employee/EmployeeActions";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
 
const EmployeeCreation = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const [formData, setFormData] = useState({
        employeeEmail: "",
        employeeName: "",
        workLocation: "",  // Now this will store the location name
        role: { roleId: "" },
        managerId: "" ,
    });
 
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [locations, setLocations] = useState([]);
 
    // Fetch roles, employees, and locations from backend
    useEffect(() => {
        const fetchRolesAndEmployees = async () => {
            try {
                const roleResponse = await fetch("http://localhost:8080/tap/getallrole");
                const roleData = await roleResponse.json();
                setRoles(roleData);
 
                const employeeResponse = await fetch("http://localhost:8080/tap/getallemployee");
                const employeeData = await employeeResponse.json();
 
                const formattedEmployees = employeeData.map(employee => {
                    const email = employee.employeeEmail;
                    const roleName = employee.role ? employee.role.roleName : 'Unknown Role';  // Safely check for role
                    const location = employee.role ? employee.role.workLocation : 'Unknown Location'; // Safely check for location
                    const name = email.split('@')[0]; // Extract name from email
 
                    return {
                        employeeId: employee.employeeId,
                        displayText: `${name} - ${roleName}`,  // Display name and role
                    };
                });
 
                setEmployees(formattedEmployees);
 
                // Fetch locations from the backend
                const locationResponse = await fetch("http://localhost:8080/tap/getallorganizationlocations");
                const locationData = await locationResponse.json();
 
                const formattedLocations = locationData.map(location => ({
                    value: location.locationName,  
                    label: location.locationName,
                }));
 
                setLocations(formattedLocations);
 
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to fetch roles, employees, or locations.",
                    icon: "error",
                    background: "#27235C",
                    color: "#fff",
                    confirmButtonColor: "#1e1c4f",
                });
            }
        };
 
        fetchRolesAndEmployees();
    }, []);
 
    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
 
        validateField(name, value);
    };
 
    // Validate individual field
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
        switch (name) {
            case "employeeEmail":
                if (!emailRegex.test(value)) {
                    newErrors.employeeEmail = "Email is not valid.";
                } else {
                    delete newErrors.employeeEmail;
                }
                break;
            case "employeeName":
                if (!value) {
                    newErrors.employeeName = "Employee name is required.";
                } else {
                    delete newErrors.employeeName;
                }
                break;
            default:
                break;
        }
 
        setErrors(newErrors);
    };
 
    // Validate all fields before submitting the form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.employeeEmail) newErrors.employeeEmail = "Email is required.";
        if (!formData.employeeName) newErrors.employeeName = "Employee name is required.";
        if (!formData.role.roleId) newErrors.role = "Please choose a role.";
        if (!formData.managerId) newErrors.managerId = "Please choose a manager.";
        if (!formData.workLocation) newErrors.workLocation = "Please select a work location.";
        setErrors(newErrors);
        return newErrors;
    };
 
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
 
        const formErrors = validateForm();
 
        if (Object.keys(formErrors).length === 0) {

            const employeeData = {
                employeeEmail: formData.employeeEmail,
                employeeName: formData.employeeName,
                workLocation: formData.workLocation,  // Send location name, not ID
                role: { roleId: formData.role.roleId },
                managerId: formData.managerId ,
            };
            console.log(employeeData);
            dispatch(createEmployee(employeeData))
                .then(() => {
                    Swal.fire({
                        title: "Success!",
                        text: "Employee created successfully.",
                        icon: "success",
                        background: "#27235C",
                        color: "#fff",
                        confirmButtonColor: "#1e1c4f",
                    });
                    setFormData({
                        employeeEmail: "",
                        employeeName: "",
                        workLocation: "", // Clear location field
                        role: { roleId: "" },
                        managerId: "",
                    });
                    setErrors({});
                    onClose();
                    window.location.reload(true);
                    navigate("/ViewEmployee");
                })
                .catch((error) => {
                    Swal.fire({
                        title: "Error!",
                        text: error.message || "Failed to create employee.",
                        icon: "error",
                        background: "#27235C",
                        color: "#fff",
                        confirmButtonColor: "#1e1c4f",
                    });
                });
        } else {
            setErrors(formErrors);
        }
    };
 
    // Format roles for react-select
    const roleOptions = roles.map((role) => ({
        value: role.roleId,
        label: role.roleName,  // Only display role name
    }));
 
    // Format employees for react-select
    const employeeOptions = employees.map((employee) => ({
        value: employee.employeeId,
        label: employee.displayText,  // Display name and role only
    }));
 
    // Format locations for react-select (only location names)
    const locationOptions = locations;
 
    return (
        <div className="container">
            <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    {/* Employee Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-1">Email:</label>
                        <input
                            type="email"
                            name="employeeEmail"
                            value={formData.employeeEmail}
                            onChange={handleChange}
                            className={`border rounded p-2 w-full text-sm ${errors.employeeEmail ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.employeeEmail && <p className="text-red-500 text-xs">{errors.employeeEmail}</p>}
                    </div>
 
                    {/* Employee Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-1">Employee Name:</label>
                        <input
                            type="text"
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleChange}
                            className={`border rounded p-2 w-full text-sm ${errors.employeeName ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors.employeeName && <p className="text-red-500 text-xs">{errors.employeeName}</p>}
                    </div>
 
                    {/* Work Location */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-1">Work Location:</label>
                        <Select
                            name="workLocation"
                            value={locationOptions.find(option => option.value === formData.workLocation)}
                            onChange={(option) => {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    workLocation: option.value,  // Now, this stores only the location name
                                }));
                            }}
                            options={locationOptions}
                            className={`${errors.workLocation ? "border-red-500" : "border-gray-300"} text-sm`}
                            placeholder="Select Location"
                        />
                        {errors.workLocation && <p className="text-red-500 text-xs">{errors.workLocation}</p>}
                    </div>
 
                    {/* Role */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-1">Role:</label>
                        <Select
                            name="role"
                            value={roleOptions.find(option => option.value === formData.role.roleId)}
                            onChange={(option) => {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    role: { roleId: option.value },
                                }));
                            }}
                            options={roleOptions}
                            className={`${errors.role ? "border-red-500" : "border-gray-300"} text-sm`}
                            placeholder="Select Role"
                        />
                        {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
                    </div>
 
                    {/* Manager */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-1">Manager:</label>
                        <Select
                            name="manager"
                            value={employeeOptions.find(option => option.value === formData.managerId)}
                            onChange={(option) => {
                                setFormData((prevState) => ({
                                    ...prevState,
                                    managerId: option.value,
                                }));
                            }}
                            options={employeeOptions}
                            className={`${errors.manager ? "border-red-500" : "border-gray-300"} text-sm`}
                            placeholder="Select Manager"
                        />
                        {errors.manager && <p className="text-red-500 text-xs">{errors.manager}</p>}
                    </div>
 
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-[#27235E] w-full text-white rounded p-2  hover:bg-[#1C1A4E] text-sm transition duration-200"
                        // style={{ background: 'linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))' }}
                    >
                        Create Employee
                    </button>
                </form>
            </div>
        </div>
    );
};
 
export default EmployeeCreation;