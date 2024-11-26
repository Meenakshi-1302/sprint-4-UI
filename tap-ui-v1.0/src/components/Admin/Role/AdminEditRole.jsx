// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { getRoleById, updateAdminRole, addAdminRole } from '../../../services/Admin/Role/AdminRoleService';
// import { getAllDepartments } from '../../../services/Admin/Department/DepartmentService';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import Select from 'react-select';
 
// const AdminEditRole = ({ isOpen, onClose, roleId }) => {
//   const dispatch = useDispatch();
//   const [roleData, setRoleData] = useState({
//     roleName: '',
//     roleDescription: '',
//     departmentId: '',
//   });
//   const [departments, setDepartments] = useState([]);
//   const navigate = useNavigate();
 
//   useEffect(() => {
//     if (!roleId) return; // Don't run if roleId is not provided
 
//     console.log('Fetching data for roleId:', roleId);
 
//     // Fetch departments for the dropdown
//     const fetchDepartments = async () => {
//       try {
//         const departmentsData = await getAllDepartments();
//         const departmentOptions = departmentsData
//           .filter(department => department && department.departmentId && department.departmentName)
//           .map(department => ({
//             value: department.departmentId,
//             label: department.departmentName,
//           }));
//         setDepartments(departmentOptions);
//       } catch (error) {
//         console.error('Failed to fetch departments:', error);
//       }
//     };
 
//     // Fetch role data by roleId
//     const fetchRoleData = async () => {
//       try {
//         const role = await getRoleById(roleId);
//         console.log('Fetched role data:', role);  // Log fetched data for debugging
//         setRoleData({
//           roleName: role.roleName,
//           roleDescription: role.roleDescription,
//           departmentId: role.department ? role.department.departmentId : '',
//         });
//       } catch (error) {
//         console.error('Failed to fetch role:', error);
//       }
//     };
 
//     fetchDepartments();  // Fetch departments once
//     fetchRoleData();     // Fetch role data if roleId is provided
//   }, [roleId]); // Only rerun when roleId changes
 
//   // Handle department selection change
//   const handleChange = (selectedOption) => {
//     setRoleData({
//       ...roleData,
//       departmentId: selectedOption ? selectedOption.value : '',
//     });
//   };
  
 
//   // Handle form submission
//   // Handle form submission
// const handleSubmit = async (e) => {
//     e.preventDefault();
 
//     const dataToSend = {
//       roleName: roleData.roleName,
//       roleDescription: roleData.roleDescription,
//       department: { departmentId: roleData.departmentId },
//     };
 
//     try {
//       if (roleId) {
//         // Update existing role with roleId in URL path
//         const response = await updateAdminRole(roleId, dataToSend);
       
//         // Checking if response contains the expected success message
//         if (response === 'Success') {
//           Swal.fire({
//             icon: 'success',
//             title: 'Success!',
//             text: 'Role updated successfully!',
//             confirmButtonText: 'Okay',
//           }).then(() => {
//             navigate("/admindash")
//           });
//         } else {
//           throw new Error('Failed to update role');
//         }
//       } else {
//         // Add new role
//         const newRole = await addAdminRole(dataToSend);
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: 'Role added successfully!',
//           confirmButtonText: 'Okay',
//         }).then(() => {
//           window.location.reload(true);
//           navigate('/AdminViewRole');
//         });
//       }
 
//       // Reset form data after successful operation
//       setRoleData({ roleName: '', roleDescription: '', departmentId: '' });
//       onClose();
//     } catch (error) {
//       console.error('Failed to save role:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to save role. Please try again.',
//         confirmButtonText: 'Okay',
//       });
//     }
//   };
 
 
//   // If the modal is not open, return null to not render it
//   if (!isOpen) return null;
 
//   return (
//     <div className="container">
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-500">
//       <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-3xl font-bold text-red-600 hover:text-red-800 transition-all"
//                 >
//                     &times;
//                 </button>
//         <h2 className="text-2xl font-semibold text-center mb-4">Edit Role</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label className="block">
//             <span className="text-gray-700">Role Name</span>
//             <input
//               type="text"
//               name="roleName"
//               placeholder="Role Name"
//               value={roleData.roleName}
//               onChange={(e) => setRoleData({ ...roleData, roleName: e.target.value })}
//               required
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Role Description</span>
//             <input
//               type="text"
//               name="roleDescription"
//               placeholder="Role Description"
//               value={roleData.roleDescription}
//               onChange={(e) => setRoleData({ ...roleData, roleDescription: e.target.value })}
//               required
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Department</span>
//             <Select
//               name="departmentId"
//               value={departments.find(department => department.value === roleData.departmentId)}
//               onChange={handleChange}
//               options={departments}
//               placeholder="Select Department"
//               isSearchable
//               required
//               className="w-full"
//             />
//           </label>
//           <button
//             type="submit"
//             className="w-full p-2 text-white rounded hover:bg-[#1E1A4D] transition duration-200"
//             style={{
//               background: "linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))",
//             }}
//           >
//             {roleId ? 'Update Role' : 'Add Role'}
//           </button>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// };
 
// export default AdminEditRole;





import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getRoleById, updateAdminRole, addAdminRole } from '../../../services/Admin/Role/AdminRoleService';
import { getAllDepartments } from '../../../services/Admin/Department/DepartmentService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
 
const AdminEditRole = ({ isOpen, onClose, roleId }) => {
  const dispatch = useDispatch();
  const [roleData, setRoleData] = useState({
    roleName: '',
    roleDescription: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!roleId) return; // Don't run if roleId is not provided
 
    console.log('Fetching data for roleId:', roleId);
 
    // Fetch departments for the dropdown
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getAllDepartments();
        const departmentOptions = departmentsData
          .filter(department => department && department.departmentId && department.departmentName)
          .map(department => ({
            value: department.departmentId,
            label: department.departmentName,
          }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
 
    // Fetch role data by roleId
    const fetchRoleData = async () => {
      try {
        const role = await getRoleById(roleId);
        console.log('Fetched role data:', role);  // Log fetched data for debugging
        setRoleData({
          roleName: role.roleName,
          roleDescription: role.roleDescription,
          departmentId: role.department ? role.department.departmentId : '',
        });
      } catch (error) {
        console.error('Failed to fetch role:', error);
      }
    };
 
    fetchDepartments();  // Fetch departments once
    fetchRoleData();     // Fetch role data if roleId is provided
  }, [roleId]);

  // Handle department selection change
  const handleChange = (selectedOption) => {
    setRoleData({
      ...roleData,
      departmentId: selectedOption ? selectedOption.value : '',
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const dataToSend = {
      roleName: roleData.roleName,
      roleDescription: roleData.roleDescription,
      department: { departmentId: roleData.departmentId },
    };
 
    try {
      if (roleId) {
        // Update existing role with roleId in URL path
        const response = await updateAdminRole(roleId, dataToSend);
       
        // Checking if response contains the expected success message
        if (response === 'Success') {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Role updated successfully!',
            confirmButtonText: 'Okay',
          }).then(() => {
            navigate("/admindash");
          });
        } else {
          throw new Error('Failed to update role');
        }
      } else {
        // Add new role
        const newRole = await addAdminRole(dataToSend);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Role added successfully!',
          confirmButtonText: 'Okay',
        }).then(() => {
          window.location.reload(true);
          navigate('/AdminViewRole');
        });
      }
 
      // Reset form data after successful operation
      setRoleData({ roleName: '', roleDescription: '', departmentId: '' });
      onClose();
    } catch (error) {
      console.error('Failed to save role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save role. Please try again.',
        confirmButtonText: 'Okay',
      });
    }
  };

  // Input change handler for Role Name and Role Description
  const handleTextInputChange = (e, fieldName) => {
    const value = e.target.value;

    if (fieldName === 'roleName') {
      // Allow only alphabetic characters and spaces for Role Name
      const filteredValue = value.replace(/[^a-zA-Z\u00C0-\u017F\s]/g, ''); 
      setRoleData(prevState => ({
        ...prevState,
        [fieldName]: filteredValue,
      }));
    } else if (fieldName === 'roleDescription') {
      // Allow letters, spaces, &, -, /, and , for Role Description
      const filteredValue = value.replace(/[^a-zA-Z\u00C0-\u017F\s&\-\/,]/g, ''); 
      setRoleData(prevState => ({
        ...prevState,
        [fieldName]: filteredValue,
      }));
    }
  };
 
  // If the modal is not open, return null to not render it
  if (!isOpen) return null;
 
  return (
    <div className="container">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl font-bold text-red-600 hover:text-red-800 transition-all"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold text-center mb-4">Edit Role</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Role Name</span>
              <input
                type="text"
                name="roleName"
                placeholder="Role Name"
                value={roleData.roleName}
                onChange={(e) => handleTextInputChange(e, 'roleName')}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Role Description</span>
              <input
                type="text"
                name="roleDescription"
                placeholder="Role Description"
                value={roleData.roleDescription}
                onChange={(e) => handleTextInputChange(e, 'roleDescription')}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Department</span>
              <Select
                name="departmentId"
                value={departments.find(department => department.value === roleData.departmentId)}
                onChange={handleChange}
                options={departments}
                placeholder="Select Department"
                isSearchable
                required
                className="w-full"
              />
            </label>
            <button
              type="submit"
              className="bg-[#27235E] w-full p-2 text-white rounded hover:bg-[#1E1A4D] transition duration-200"
              // style={{
              //   background: "linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))",
              // }}
            >
              {roleId ? 'Update Role' : 'Add Role'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default AdminEditRole;