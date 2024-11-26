// import React, { useState, useEffect, useRef } from 'react';
// import { getRoles, saveJobRequirements } from '../../../services/Client/JobRequirementsService';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router';
// import ClientNavbar from '../Dashboard/ClientNavbar';

// const JobRequirementPage = () => {
//   const [roles, setRoles] = useState([]);
//   const [jobRequirements, setJobRequirements] = useState([{ role: '', resourceCount: 1 }]);
//   const [budget, setBudget] = useState('');
//   const [totalCount, setTotalCount] = useState(1);
//   const [timeline, setTimeline] = useState('');
//   const [submittedData, setSubmittedData] = useState(null);
//   const [disableInputs, setDisableInputs] = useState(false);

//   const formRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch roles from API
//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const rolesData = await getRoles();
//         setRoles(rolesData);
//       } catch (error) {
//         console.error('Error fetching roles:', error);
//       }
//     };

//     fetchRoles();
//   }, []);

//   // Update total count based on job requirements
//   useEffect(() => {
//     const count = jobRequirements.reduce((acc, req) => acc + parseInt(req.resourceCount, 10), 0);
//     setTotalCount(count);
//   }, [jobRequirements]);

//   // Handle role change
//   const handleRoleChange = (index, value) => {
//     const newJobRequirements = [...jobRequirements];
//     newJobRequirements[index].role = value;
//     setJobRequirements(newJobRequirements);
//   };

//   // Handle resource count change
//   const handleRequiredCountChange = (index, value) => {
//     const newJobRequirements = [...jobRequirements];
//     newJobRequirements[index].resourceCount = value;
//     setJobRequirements(newJobRequirements);
//   };

//   // Add new job requirement
//   const addJobRequirement = () => {
//     setJobRequirements([...jobRequirements, { role: '', resourceCount: 1 }]);
//   };

//   // Remove job requirement
//   const removeJobRequirement = (index) => {
//     const newJobRequirements = jobRequirements.filter((_, i) => i !== index);
//     setJobRequirements(newJobRequirements);
//   };

//   // Handle submit
//   const clientId = sessionStorage.getItem("vendorId")
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const formData = {
//       totalRequiredResourceCount: totalCount,
//       timeline,
//       budget: parseFloat(budget),
//       client:  { clientId: clientId } ,
//       subrequirement: jobRequirements,
//     };

//     try {
//       const updatedData = await saveJobRequirements(formData);
//       console.log('Form Submitted Successfully', updatedData);
//       setSubmittedData(formData);
//       toast.success('Requirement added successfully!');
//       setTimeout(() => {
//         navigate('/JobRequirementsTable');
//       }, 2000);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Failed to add requirement. Please try again.');
//     }
//   };

//   // Validation functions
//   const isValidRole = (role) => /^[a-zA-Z\s]+$/.test(role);
//   const isValidRequiredCount = (count) => count > 0;
//   const isValidBudget = (budgetValue) => /^[+]?\d+(\.\d+)?$/.test(budgetValue) && parseFloat(budgetValue) > 0;

//   const isFormValid = () => {
//     return (
//       jobRequirements.every((req) => isValidRole(req.role) && isValidRequiredCount(req.resourceCount)) &&
//       isValidBudget(budget) && timeline
//     );
//   };

//   // Auto-focus on the next field
//   const handleFocusNext = (e, nextField) => {
//     if (nextField) {
//       nextField.focus();
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-20 py-8">
//         <div className="max-w-4xl w-full px-6 py-10 bg-white rounded-lg shadow-lg border border-gray-200">
//           <h2 className="text-3xl font-semibold mb-8 text-center text-gray-700">Job Requirement Page</h2>

//           <form onSubmit={handleSubmit} ref={formRef}>
//             {/* Job Requirements Section */}
//             <div className="mb-8">
//               <h3 className="text-2xl font-semibold mb-4 text-gray-800">Job Requirements</h3>
//               {jobRequirements.map((jobRequirement, index) => (
//                 <div key={index} className="mb-6 flex items-center space-x-6">
//                   <div className="w-full sm:w-1/2">
//                     <label className="block text-gray-700 mb-2">Role</label>
//                     <input
//                       type="text"
//                       value={jobRequirement.role}
//                       onChange={(e) => handleRoleChange(index, e.target.value)}
//                       list={`role-suggestions-${index}`}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                       placeholder="Enter role"
//                       disabled={disableInputs}
//                       onKeyUp={(e) => handleFocusNext(e, jobRequirement.resourceCount ? e.target.nextElementSibling : null)}
//                     />
//                     <datalist id={`role-suggestions-${index}`}>
//                       {roles.length === 0 ? (
//                         <option value="">Loading roles...</option>
//                       ) : (
//                         roles
//                           .filter(
//                             (roleObj) =>
//                               roleObj.role &&
//                               jobRequirement.role &&
//                               jobRequirement.role.toLowerCase() &&
//                               roleObj.role.toLowerCase().includes(jobRequirement.role.toLowerCase())
//                           )
//                           .map((roleObj, roleIndex) => (
//                             <option key={roleIndex} value={roleObj.role} />
//                           ))
//                       )}
//                     </datalist>
//                     {/* Validation for Role */}
//                     {!isValidRole(jobRequirement.role) && jobRequirement.role && (
//                       <p className="text-red-500 text-sm">Role must contain only letters and spaces.</p>
//                     )}
//                   </div>

//                   <div className="w-full sm:w-1/4">
//                     <label className="block text-gray-700 mb-2">Required Count</label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={jobRequirement.resourceCount}
//                       onChange={(e) => handleRequiredCountChange(index, e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                       placeholder="Enter count"
//                       disabled={disableInputs}
//                       onKeyUp={(e) => handleFocusNext(e, jobRequirements[index + 1] ? e.target.nextElementSibling : null)}
//                     />
//                     {/* Validation for Required Count */}
//                     {jobRequirement.resourceCount <= 0 && (
//                       <p className="text-red-500 text-sm">Required count must be a positive number.</p>
//                     )}
//                   </div>

//                   {/* Remove button only visible if there's more than one job requirement */}
//                   {jobRequirements.length > 1 && index > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => removeJobRequirement(index)}
//                       className="ml-5 px-4 pt-5 text-3xl text-red-600 font-bold"
//                       disabled={disableInputs}
//                     >
//                       &times;
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <div className="flex justify-between mt-4">
//                 <button
//                   type="button"
//                   onClick={addJobRequirement}
//                   className="px-6 py-2 bg-[#27235c] text-white font-semibold rounded-md"
//                   disabled={disableInputs || !jobRequirements.every(req => req.role && req.resourceCount > 0)}
//                 >
//                   Add+
//                 </button>
//               </div>
//             </div>

//             {/* Budget and Timeline Section */}
//             <div className="mt-8">
//               <h3 className="text-2xl font-semibold mb-4 text-gray-800">Budget and Timeline</h3>

//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2">Total Count</label>
//                 <input
//                   type="text"
//                   value={totalCount}
//                   readOnly
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   disabled={disableInputs}
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2">Budget (In Crs)</label>
//                 <input
//                   type="text"
//                   value={budget}
//                   onChange={(e) => setBudget(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Enter budget"
//                   disabled={disableInputs}
//                 />
//                 {/* Validation for Budget */}
//                 {!isValidBudget(budget) && (
//                   <p className="text-red-500 text-sm">Budget must be a valid number greater than 0.</p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-gray-700 mb-2">Timeline</label>
//                 <div className="flex items-center">
//                   <label className="flex items-center mr-4">
//                     <input
//                       type="radio"
//                       name="timeline"
//                       value="Immediate"
//                       checked={timeline === 'Immediate'}
//                       onChange={(e) => setTimeline(e.target.value)}
//                       disabled={disableInputs}
//                     />
//                     <span className="ml-2">Immediate</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="timeline"
//                       value="30Days"
//                       checked={timeline === '30Days'}
//                       onChange={(e) => setTimeline(e.target.value)}
//                       disabled={disableInputs}
//                     />
//                     <span className="ml-2">30 Days</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="mt-6 text-center">
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-[#27235c] text-white font-semibold rounded-md hover:bg-[#1d1b44] transition"
//                   disabled={disableInputs || !isFormValid()}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </form>

//           {/* Display Submitted Data */}
//           {submittedData && (
//             <div className="mt-8 p-6 bg-gray-100 rounded-lg">
//               <h3 className="text-2xl font-semibold mb-4 text-gray-800">Submitted Job Requirements</h3>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default JobRequirementPage;

import React, { useState, useEffect, useRef } from "react";
import {
  getRoles,
  saveJobRequirements,
} from "../../../services/Client/JobRequirementsService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  SunMoon,
  Languages,
  FilePlus,
  List,
  Key,
  LayoutDashboard,
} from "lucide-react";
import Logo from "../../../assets/RelevantzBlue.PNG";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faUser } from "@fortawesome/free-solid-svg-icons";

const JobRequirementPage = () => {
  const [roles, setRoles] = useState([]);
  const [jobRequirements, setJobRequirements] = useState([
    { role: "", resourceCount: 1 },
  ]);
  const [budget, setBudget] = useState("");
  const [totalCount, setTotalCount] = useState(1);
  const [timeline, setTimeline] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [disableInputs, setDisableInputs] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("post-requirements");

  const formRef = useRef(null);
  const navigate = useNavigate();

  const isValidRole = (role) => /^[a-zA-Z\s]+$/.test(role);
  const isValidRequiredCount = (count) => count > 0;
  const isValidBudget = (budgetValue) =>
    /^[+]?\d+(\.\d+)?$/.test(budgetValue) && parseFloat(budgetValue) > 0;

  const isFormValid = () => {
    return (
      jobRequirements.every(
        (req) =>
          isValidRole(req.role) && isValidRequiredCount(req.resourceCount)
      ) &&
      isValidBudget(budget) &&
      timeline
    );
  };

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Update total count based on job requirements
  useEffect(() => {
    const count = jobRequirements.reduce(
      (acc, req) => acc + parseInt(req.resourceCount, 10),
      0
    );
    setTotalCount(count);
  }, [jobRequirements]);

  // Handle role change
  const handleRoleChange = (index, value) => {
    const newJobRequirements = [...jobRequirements];
    newJobRequirements[index].role = value;
    setJobRequirements(newJobRequirements);
  };

  // Handle resource count change
  const handleRequiredCountChange = (index, value) => {
    const newJobRequirements = [...jobRequirements];
    newJobRequirements[index].resourceCount = value;
    setJobRequirements(newJobRequirements);
  };

  // Add new job requirement
  const addJobRequirement = () => {
    setJobRequirements([...jobRequirements, { role: "", resourceCount: 1 }]);
  };

  // Remove job requirement
  const removeJobRequirement = (index) => {
    const newJobRequirements = jobRequirements.filter((_, i) => i !== index);
    setJobRequirements(newJobRequirements);
  };

  // Handle submit
  const clientId = sessionStorage.getItem("vendorId");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      totalRequiredResourceCount: totalCount,
      timeline,
      budget: parseFloat(budget),
      client: { clientId: clientId },
      subrequirement: jobRequirements,
    };

    try {
      const updatedData = await saveJobRequirements(formData);
      console.log("Form Submitted Successfully", updatedData);
      setSubmittedData(formData);
      toast.success("Requirement added successfully!");
      setTimeout(() => {
        navigate("/JobRequirementsTable");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add requirement. Please try again.");
    }
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-20 ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
      style={{ backgroundColor: "#27235C" }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-10 mr-10 mt-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-7 h-7" />
          </button>
          {isSidebarOpen && (
            <img
              src={Logo}
              alt="Organization Logo"
              className="ml-3 mr-2 h-12 mt-3"
            />
          )}
        </div>
        <nav>
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: LayoutDashboard,
              path: "/clientdashboard",
            },
            {
              id: "post-requirements",
              label: "Post Requirements",
              icon: FilePlus,
              path: "/requirement",
            },
            {
              id: "view-requirements",
              label: "View All Requirements",
              icon: List,
              path: "/jobRequirementsTable",
            },
            {
              id: "reset-password",
              label: "Reset Password",
              icon: Key,
              path: "/resetpassword",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (item.id === "post-requirements") {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                activeTab === item.id ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div
      className={`flex h-screen ${
        isSidebarOpen ? "ml-64" : "ml-16"
      }`}
    >
      <Sidebar />
      <div className="flex-1">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Job Requirement Page
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <SunMoon className="w-6 h-6" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <Languages className="w-6 h-6" />
              </button>
              <div style={{ position: "relative", zIndex: 50 }}>
                <button
                  onClick={toggleProfileDropdown}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                </button>
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      marginTop: "8px",
                      width: "192px",
                      background: "white",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      padding: "8px",
                    }}
                  >
                    <a
                      href="#"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        color: "#333",
                        textDecoration: "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "8px" }}
                      />
                      Profile
                    </a>
                    <a
                      href="#"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        color: "#333",
                        textDecoration: "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faInbox}
                        style={{ marginRight: "8px" }}
                      />
                      Inbox
                    </a>
                    <a
                      href="/"
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        color: "#333",
                        textDecoration: "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "8px" }}
                      />
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gray-100 py-8">
          <div className="max-w-4xl w-full px-6 py-10 bg-white rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-3xl font-semibold mb-8 text-center text-gray-700">
              Job Requirement Page
            </h2>

            <form onSubmit={handleSubmit} ref={formRef}>
              {/* Job Requirements Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Job Requirements
                </h3>
                {jobRequirements.map((jobRequirement, index) => (
                  <div key={index} className="mb-6 flex items-center space-x-6">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        value={jobRequirement.role}
                        onChange={(e) =>
                          handleRoleChange(index, e.target.value)
                        }
                        list={`role-suggestions-${index}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter role"
                        disabled={disableInputs}
                      />
                      <datalist id={`role-suggestions-${index}`}>
                        {roles.length === 0 ? (
                          <option value="">Loading roles...</option>
                        ) : (
                          roles
                            .filter(
                              (roleObj) =>
                                roleObj.role &&
                                jobRequirement.role &&
                                jobRequirement.role.toLowerCase() &&
                                roleObj.role
                                  .toLowerCase()
                                  .includes(jobRequirement.role.toLowerCase())
                            )
                            .map((roleObj, roleIndex) => (
                              <option key={roleIndex} value={roleObj.role} />
                            ))
                        )}
                      </datalist>
                    </div>

                    <div className="w-full sm:w-1/4">
                      <label className="block text-gray-700 mb-2">
                        Required Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={jobRequirement.resourceCount}
                        onChange={(e) =>
                          handleRequiredCountChange(index, e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter count"
                        disabled={disableInputs}
                      />
                    </div>

                    {/* Remove button only visible if there's more than one job requirement */}
                    {jobRequirements.length > 1 && index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeJobRequirement(index)}
                        className="ml-5 px-4 pt-5 text-3xl text-red-600 font-bold"
                        disabled={disableInputs}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={addJobRequirement}
                    className="px-6 py-2 bg-[#27235c] text-white font-semibold rounded-md"
                    disabled={
                      disableInputs ||
                      !jobRequirements.every(
                        (req) => req.role && req.resourceCount > 0
                      )
                    }
                  >
                    Add+
                  </button>
                </div>
              </div>

              {/* Budget and Timeline Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Budget and Timeline
                </h3>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Total Count
                  </label>
                  <input
                    type="text"
                    value={totalCount}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={disableInputs}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Budget (In Crs)
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter budget"
                    disabled={disableInputs}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Timeline</label>
                  <div className="flex items-center">
                    <label className="flex items-center mr-4">
                      <input
                        type="radio"
                        name="timeline"
                        value="Immediate"
                        checked={timeline === "Immediate"}
                        onChange={(e) => setTimeline(e.target.value)}
                        disabled={disableInputs}
                      />
                      <span className="ml-2">Immediate</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="timeline"
                        value="30Days"
                        checked={timeline === "30Days"}
                        onChange={(e) => setTimeline(e.target.value)}
                        disabled={disableInputs}
                      />
                      <span className="ml-2">30 Days</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#27235c] text-white font-semibold rounded-md hover:bg-[#1d1b44] transition"
                    disabled={disableInputs || !isFormValid()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>

            {/* Display Submitted Data */}
            {submittedData && (
              <div className="mt-8 p-6 bg-gray-100 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Submitted Job Requirements
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRequirementPage;
