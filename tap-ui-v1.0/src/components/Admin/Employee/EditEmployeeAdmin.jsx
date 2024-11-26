import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { updateEmployee, getAllRoles, getEmployees, getAllLocations } from '../../../services/Admin/Employee/EmployeeService';

const AdminEditEmployee = ({ isOpen, onClose, employee }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    employeeEmail: '',
    employeeName: '',
    workLocation: '',
    role: { roleId: '' },
    managerId: '',
  });

  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch roles, employees, and locations from backend
  useEffect(() => {
    const fetchRolesAndEmployees = async () => {
      try {
        const roleResponse = await getAllRoles();
        setRoles(roleResponse);
        const employeeResponse = await getEmployees();
        const formattedEmployees = employeeResponse.map(emp => {
          const email = emp.employeeEmail;
          const roleLabel = emp.role ? emp.role.roleName : 'Unknown Role';
          const employeeName = email.split('@')[0];
          return {
            value: emp.employeeId,
            label: `${employeeName} - ${roleLabel}`,
          };
        });
        setEmployees(formattedEmployees);
        const locationResponse = await getAllLocations();
        const formattedLocations = locationResponse.map(loc => ({
          value: loc.locationName,
          label: loc.locationName,
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

  // Populate state with employee data on modal open
  useEffect(() => {
    if (employee) {
      setEmployeeData({
        employeeEmail: employee.employeeEmail || '',
        employeeName: employee.employeeName || '',
        workLocation: employee.workLocation || '',
        role: { roleId: employee.role?.roleId || '' },
        managerId: employee.managerId || '',
      });
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      employeeEmail: employeeData.employeeEmail,
      employeeName: employeeData.employeeName,
      workLocation: employeeData.workLocation,
      role: { roleId: employeeData.role.roleId },
      managerId: employeeData.managerId,
    };

    console.log(dataToSend);

    try {
      const response = await updateEmployee(employee.employeeId, dataToSend);
      if (response === 'Success') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Employee updated successfully!',
          confirmButtonText: 'Okay',
        }).then(() => {
          onClose(); // Close the modal
          window.location.reload();
        });
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error) {
      console.error('Failed to save employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save employee. Please try again.',
        confirmButtonText: 'Okay',
      });
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  // Ensure the role is displayed properly
  const selectedRole = roles.find(role => role.roleId === employeeData.role.roleId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Employee</h2>
          <button onClick={onClose} className="text-red-600 font-bold text-2xl" aria-label="Close modal">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Employee Email:</label>
            <input
              type="email"
              value={employeeData.employeeEmail}
              readOnly
              className="border rounded p-2 w-full text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Employee Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Employee Name:</label>
            <input
              type="text"
              value={employeeData.employeeName}
              readOnly
              className="border rounded p-2 w-full text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Work Location */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Work Location:</label>
            <Select
              value={locations.find(option => option.value === employeeData.workLocation)}
              onChange={(option) => setEmployeeData(prevState => ({ ...prevState, workLocation: option.value }))}
              options={locations}
              placeholder="Select Work Location"
              className="basic-single"
              classNamePrefix="select"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Role:</label>
            <Select
              value={selectedRole ? { value: selectedRole.roleId, label: selectedRole.roleName } : null}
              onChange={(option) => setEmployeeData(prevState => ({ ...prevState, role: { roleId: option.value } }))}
              options={roles.map(role => ({ value: role.roleId, label: role.roleName }))}
              placeholder="Select Role"
              className="basic-single"
              classNamePrefix="select"
              required
            />
          </div>

          {/* Manager */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Manager:</label>
            <Select
              value={employees.find(option => option.value === employeeData.managerId)}
              onChange={(option) => setEmployeeData(prevState => ({ ...prevState, managerId: option.value }))}
              options={employees}
              placeholder="Select Manager"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          <button
            type="submit"
            className="w-full text-white rounded p-2 text-sm transition duration-200"
            style={{ background: 'linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))' }}
          >
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditEmployee;