// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import Select from 'react-select';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   'Financials',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: '',
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//   });

//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);

//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const handleSkillChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value).join(', ') : '';
//     setFormData({ ...formData, requiredSkills: values });
//     setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = skillOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };

//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills || null,
//       mrfCriteria: {
//           employmentMode: formData.employmentMode || null,
//           educationalQualification: formData.educationalQualification || null,
//           yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//           minimumCTC: parseFloat(formData.minCTC) || 0.0,
//           maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//           contractStartDate: formData.contractStartDate || null,
//           closureDate: formData.closureDate || null,
//           jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//           mrfApprovalStatus: formData.approvalStatus || null,
//           mrfStage: formData.mrfStage || null,
//           mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//           billingCycle: formData.billingCycle || null,
//           proposedBudget: formData.proposedBudget || null,
//           negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//           requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//           employeeId: parseInt(employeeId, 10), // Ensure correct type
//       },
//       clientPartner: {
//           employeeId: parseInt(employeeId, 10), // Ensure correct type
//       },
//       subRequirements: {
//           subRequirementId: subRequirementDetails.subRequirementId || ''
//       }
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: '',
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//                 disabled
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
//               <Select
//                 isMulti
//                 options={skillOptions}
//                 value={skillOptions.filter(option => formData.requiredSkills.split(', ').includes(option.value))}
//                 onChange={handleSkillChange}
//                 className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Upload SOW Document</label>
//               <input
//                 type="file"
//                 accept=".pdf, .docx"
//                 onChange={(e) => handleChange("sla", e.target.files[0])}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.sla ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.sla && <p className="text-red-500 text-sm">{errors.sla}</p>}
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(formData).map(([key, value]) => (
//               <div key={key} className="flex justify-between my-2">
//                 <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
//                 <span className="text-right">{key === "sla" && value ? value.name : value || "N/A"}</span>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />

//       {/* Card for Organization and Client Details */}
//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setDetailModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>

//       {/* Right Side - Form for MRF Creation */}
//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}
//                 >
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRFformCreation;

//subash work for JD


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   'Financials',
//   'Skill Parameters',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   // Initialize requiredSkills as an empty array
//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [], // Ensure this is initialized as an array
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//   });

//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);

//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const handleSkillChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData((prevData) => ({
//       ...prevData,
//       requiredSkills: values, // Store as an array
//     }));
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     const filtered = skillOptions.filter(tech =>
//       tech.label.toLowerCase().includes(value.toLowerCase())
//     );
//     setSuggestedTechnologies(filtered);
//     setShowSuggestions(value && filtered.length > 0);
//   };

//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 3: // Skill Parameters
//         if (formData.requiredSkills.length === 0) newErrors.requiredSkills = "At least one skill is required."; // Check array length
//         break;
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills || [], // Use array
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         contractStartDate: formData.contractStartDate || null,
//         closureDate: formData.closureDate || null,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//         billingCycle: formData.billingCycle || null,
//         proposedBudget: formData.proposedBudget || null,
//         negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//         requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       clientPartner: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       subRequirements: {
//         subRequirementId: subRequirementDetails.subRequirementId || ''
//       }
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [], // Reset to an empty array
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//           </div>
//         );
//       case 3: // Skill Parameters
//         const allSkills = [
//           { value: 'Logical', label: 'Logical' },
//           { value: 'Reasoning', label: 'Reasoning' },
//           { value: 'Presentation', label: 'Presentation' },
//           { value: 'Communication', label: 'Communication' },
//           { value: 'Teamwork', label: 'Teamwork' },
//           { value: 'Problem-Solving', label: 'Problem-Solving' },
//         ];

//         // Handle skill click function properly
//         const handleSkillClick = (skill) => {
//           // Always work with an array
//           const currentSkills = formData.requiredSkills || [];

//           // Add the skill if it's not already present
//           if (!currentSkills.includes(skill)) {
//             currentSkills.push(skill);
//             handleSkillChange(currentSkills.map(value => ({ value }))); // Call with the updated skills as object array
//           }
//         };

//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//               <div className="p-3 border border-gray-300 rounded-md bg-gray-100">
//                 {formData.requiredSkills.length > 0 ? formData.requiredSkills.join(', ') : 'No skills selected'}
//               </div>
//               {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//             </div>

//             <div className="mt-4 border border-gray-300 rounded-md p-2">
//               <h4 className="font-semibold">Available Skills:</h4>
//               <ul className="grid grid-cols-2 gap-2 mt-2">
//                 {allSkills.map(skill => (
//                   <li
//                     key={skill.value}
//                     onClick={() => handleSkillClick(skill.value)}
//                     className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${formData.requiredSkills.includes(skill.value) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//                   >
//                     {skill.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         );
//       case 4: // Preview & Submit
//         return (
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(formData).map(([key, value]) => (
//               <div key={key} className="flex justify-between my-2">
//                 <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
//                 <span className="text-right">{key === "sla" && value ? value.name : value || "N/A"}</span>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setDetailModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>

//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}
//                 >
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRFformCreation;




// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   'Financials',
//   'Skill Parameters',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [],
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//   });

//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);

//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const handleSkillChange = (updatedSkills) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       requiredSkills: updatedSkills,
//     }));
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = skillOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };

//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep(prev => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 3: // Skill Parameters
//         if (formData.requiredSkills.length === 0) newErrors.requiredSkills = "At least one skill is required.";
//         break;
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills || [],
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//         billingCycle: formData.billingCycle || null,
//         proposedBudget: formData.proposedBudget || null,
//         negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//         requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       clientPartner: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       subRequirements: {
//         subRequirementId: subRequirementDetails.subRequirementId || ''
//       }
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [],
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             {/* Basic Information Step Content */}
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="space-y-4">
//             {/* Job Details Step Content */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             {/* Financials Step Content */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//           </div>
//         );
//       case 3: // Skill Parameters
//         const allSkills = [
//           { value: 'Logical', label: 'Logical' },
//           { value: 'Reasoning', label: 'Reasoning' },
//           { value: 'Presentation', label: 'Presentation' },
//           { value: 'Communication', label: 'Communication' },
//           { value: 'Teamwork', label: 'Teamwork' },
//           { value: 'Problem-Solving', label: 'Problem-Solving' },
//           { value: 'Time Management', label: 'Time Management' },
//           { value: 'Adaptability', label: 'Adaptability' },
//           { value: 'Critical Thinking', label: 'Critical Thinking' },
//           { value: 'Interpersonal Skills', label: 'Interpersonal Skills' },
//           { value: 'Creativity', label: 'Creativity' },
//           { value: 'Leadership', label: 'Leadership' },
//           { value: 'Conflict Resolution', label: 'Conflict Resolution' },
//           { value: 'Decision Making', label: 'Decision Making' },
//           { value: 'Negotiation', label: 'Negotiation' },
//           { value: 'Emotional Intelligence', label: 'Emotional Intelligence' },
//           { value: 'Networking', label: 'Networking' },
//           { value: 'Persuasion', label: 'Persuasion' },
//           { value: 'Stress Management', label: 'Stress Management' },
//           { value: 'Project Management', label: 'Project Management' },
//           { value: 'Strategic Planning', label: 'Strategic Planning' },
//         ];

//         const selectedSkills = formData.requiredSkills;

//         const handleSkillClick = (skill) => {
//           const currentSkills = selectedSkills || []; 
//           if (currentSkills.includes(skill)) {
//             const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
//             handleSkillChange(updatedSkills); 
//           } else {
//             handleSkillChange([...currentSkills, skill]); 
//           }
//         };

//         const handleRemoveSkill = (skill) => {
//           const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
//           handleSkillChange(updatedSkills);
//         };

//         const handleDrop = (e) => {
//           e.preventDefault(); // Prevent default handling (especially for links)
//           const skill = e.dataTransfer.getData("text/plain"); // Get the dragged skill from the data transfer
//           if (skill && !selectedSkills.includes(skill)) {
//             handleSkillChange([...selectedSkills, skill]); // Add the dropped skill to selected skills
//           }
//         };

//         const handleDragStart = (e, skill) => {
//           e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
//         };

//         // Using renderStepContent method
//         case 3: // Skill Parameters
//           return (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//                 <div className="p-3 border border-gray-300 rounded-md bg-gray-100 flex flex-wrap">
//                   {selectedSkills.length > 0 ? selectedSkills.map(skill => (
//                     <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                       <span>{skill}</span>
//                       <button 
//                         onClick={() => handleRemoveSkill(skill)} 
//                         className="ml-1 text-red-600 text-sm">
//                         ✖
//                       </button>
//                     </div>
//                   )) : 'No skills selected'}
//                   {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//                 </div>
//               </div>

//               {/* Drop area for dragging skills */}
//               <div 
//                 className="mt-4 border border-gray-300 rounded-md p-2 max-h-40 overflow-y-scroll" 
//                 onDrop={handleDrop} 
//                 onDragOver={(e) => e.preventDefault()} // Allow drop
//               >
//                 <h4 className="font-semibold">Available Skills (Drag to Select):</h4>
//                 <ul className="grid grid-cols-2 gap-2 mt-2">
//                   {allSkills.map(skill => (
//                     <li
//                       key={skill.value}
//                       onClick={() => handleSkillClick(skill.value)} // Keep click functionality
//                       onDragStart={(event) => handleDragStart(event, skill.value)} // Start drag for the skill
//                       draggable // Make the skill draggable
//                       className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center 
//                         ${selectedSkills.includes(skill.value) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//                     >
//                       {skill.label}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           );

//         // Capture the HTML structure of the component here...
//       case 4: // Preview & Submit
//         return (
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(formData).map(([key, value]) => (
//               <div key={key} className="flex justify-between my-2">
//                 <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
//                 <span className="text-right">{key === "sla" && value ? value.name : value || "N/A"}</span>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setDetailModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>

//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}
//                 >
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRFformCreation;




// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   'Financials',
//   'Skill Parameters',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [],
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//   });

//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);
//   const [skillInput, setSkillInput] = useState(''); // Maintain a local state for user input
//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const allSkills = [
//     'Logical',
//     'Reasoning',
//     'Presentation',
//     'Communication',
//     'Teamwork',
//     'Problem-Solving',
//     'Time Management',
//     'Adaptability',
//     'Critical Thinking',
//     'Interpersonal Skills',
//     'Creativity',
//     'Leadership',
//     'Conflict Resolution',
//     'Decision Making',
//     'Negotiation',
//     'Emotional Intelligence',
//     'Networking',
//     'Persuasion',
//     'Stress Management',
//     'Project Management',
//     'Strategic Planning',
//   ];

//   const handleSkillChange = (updatedSkills) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       requiredSkills: updatedSkills,
//     }));
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = skillOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };

//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep(prev => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 3: // Skill Parameters
//         if (formData.requiredSkills.length === 0) newErrors.requiredSkills = "At least one skill is required.";
//         break;
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills || [],
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//         billingCycle: formData.billingCycle || null,
//         proposedBudget: formData.proposedBudget || null,
//         negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//         requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       clientPartner: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       subRequirements: {
//         subRequirementId: subRequirementDetails.subRequirementId || ''
//       }
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [],
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             {/* Basic Information Step Content */}
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select a technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="space-y-4">
//             {/* Job Details Step Content */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             {/* Financials Step Content */}
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//           </div>
//         );
//       case 3: // Skill Parameters
//         const selectedSkills = formData.requiredSkills;


//         const handleSkillClick = (skill) => {
//           const currentSkills = selectedSkills || [];
//           if (currentSkills.includes(skill)) {
//             const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
//             handleSkillChange(updatedSkills);
//           } else {
//             handleSkillChange([...currentSkills, skill]);
//           }
//         };

//         const handleRemoveSkill = (skill) => {
//           const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
//           handleSkillChange(updatedSkills);
//         };

//         const handleClearAllSkills = () => {
//           handleSkillChange([]); // Clear all selected skills
//           setSkillInput(''); // Clear input field as well
//         };

//         const handleSkillInputChange = (e) => {
//           setSkillInput(e.target.value);
//         };

//         const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));

//         const handleSkillDrop = (e) => {
//           e.preventDefault();
//           const skill = e.dataTransfer.getData("text/plain");
//           if (!selectedSkills.includes(skill)) {
//             handleSkillChange([...selectedSkills, skill]); // Add dragged skill
//           }
//         };

//         const handleSkillDragOver = (e) => {
//           e.preventDefault(); // Necessary to allow for dropping
//         };

//         const handleDragStart = (e, skill) => {
//           e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
//         };

//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//               <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2">
//                 <input
//                   type="text"
//                   value={skillInput}
//                   onChange={handleSkillInputChange}
//                   placeholder="Type a skill"
//                   className="flex-grow p-2 border-0 focus:outline-none bg-gray-100"
//                 />
//                 <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
//                   Clear All
//                 </button>
//               </div>
//               <div className="p-3 border border-gray-300 rounded-md bg-gray-100 flex flex-wrap">
//                 {selectedSkills.length > 0 ? selectedSkills.map(skill => (
//                   <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                     <span>{skill}</span>
//                     <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
//                       ✖
//                     </button>
//                   </div>
//                 )) : 'No skills selected'}
//               </div>
//             </div>

//             <div className="mt-4 border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }} onDrop={handleSkillDrop} onDragOver={handleSkillDragOver}>
//               <h4 className="font-semibold">Available Skills:</h4>
//               <ul className="grid grid-cols-2 gap-2 mt-2">
//                 {filteredSkills.map(skill => (
//                   <li
//                     key={skill}
//                     draggable
//                     onDragStart={(e) => handleDragStart(e, skill)}
//                     onClick={() => handleSkillClick(skill)}
//                     className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${selectedSkills.includes(skill) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//                   >
//                     {skill}
//                   </li>
//                 ))}
//                 {filteredSkills.length === 0 && skillInput && (
//                   <li className="text-gray-500 text-sm text-center">No skills found</li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         );
//       case 4: // Preview & Submit
//         return (
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(formData).map(([key, value]) => (
//               <div key={key} className="flex justify-between my-2">
//                 <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
//                 <span className="text-right">{key === "sla" && value ? value.name : value || "N/A"}</span>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setDetailModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>

//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}
//                 >
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRFformCreation;


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import Select from 'react-select';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   'Financials',
//   'Skill Parameters',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [], // Changed from string to array
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//     jobParamenterList : []
//   });

//   const [skillInput, setSkillInput] = useState('');
//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);

//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const allSkills = [
//     'Logical',
//     'Reasoning',
//     'Presentation',
//     'Communication',
//     'Teamwork',
//     'Problem-Solving',
//     'Time Management',
//     'Adaptability',
//     'Critical Thinking',
//     'Interpersonal Skills',
//     'Creativity',
//     'Leadership',
//     'Conflict Resolution',
//     'Decision Making',
//     'Negotiation',
//     'Emotional Intelligence',
//     'Networking',
//     'Persuasion',
//     'Stress Management',
//     'Project Management',
//     'Strategic Planning',
//   ];

//   const handleSkillChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : []; // Change from join to array
//     setFormData({ ...formData, requiredSkills: values });
//     setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
//   };

//   const handleSkillChangeForJobParameters = (skillList) => {
//     // Ensure skillList is an array
//     if (!Array.isArray(skillList)) {
//         console.error("Expected an array of skills but got:", skillList);
//         return;
//     }

//     setFormData({ ...formData, jobParamenterList: skillList });
//     setErrors((prev) => ({ ...prev, jobParamenterList: undefined }));
// };


//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = skillOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };

//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 3:
//         if (formData.jobParamenterList.length === 0) newErrors.jobParamenterList = "At least one skill is required.";
//         break; // Check for skills in the Skill Parameters step
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   // const handleSubmit = async () => {
//   //   if (!employeeId) {
//   //     toast.error("Employee ID not found in session storage.");
//   //     return;
//   //   }

//   //   const finalErrors = validateStep(activeStep);
//   //   if (Object.keys(finalErrors).length > 0) {
//   //     toast.error("Please resolve the errors before submission.");
//   //     return;
//   //   }

//   //   const newMRF = {
//   //     mrfDepartmentName: formData.mrfDepartmentName || null,
//   //     mrfRequiredTechnology: formData.requiredTechnology || null,
//   //     probableDesignation: formData.probableDesignation || null,
//   //     requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//   //     requiredSkills: formData.requiredSkills || [], // Ensure requiredSkills is an array
//   //     mrfCriteria: {
//   //       employmentMode: formData.employmentMode || null,
//   //       educationalQualification: formData.educationalQualification || null,
//   //       yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//   //       minimumCTC: parseFloat(formData.minCTC) || 0.0,
//   //       maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//   //       contractStartDate: formData.contractStartDate || null,
//   //       closureDate: formData.closureDate || null,
//   //       jobLocation: formData.jobLocation || null,
//   //     },
//   //     mrfStatus: {
//   //       mrfApprovalStatus: formData.approvalStatus || null,
//   //       mrfStage: formData.mrfStage || null,
//   //       mrfType: formData.mrfType || null,
//   //     },
//   //     mrfAgreement: {
//   //         billingCycle: formData.billingCycle || null,
//   //         proposedBudget: formData.proposedBudget || null,
//   //         negotiatedPricePoint: formData.negotiatedPricePoint || null,
//   //     },
//   //     requirement: {
//   //         requirementId: requirementDetails.requirementId,
//   //     },
//   //     jobDescriptionId: 1,
//   //     businessUnitHead: {
//   //         employeeId: parseInt(employeeId, 10), // Ensure correct type
//   //     },
//   //     clientPartner: {
//   //         employeeId: parseInt(employeeId, 10), // Ensure correct type
//   //     },
//   //     subRequirements: {
//   //         subRequirementId: subRequirementDetails.subRequirementId || ''
//   //     }
//   //   };

//   //   const requestData = new FormData();
//   //   requestData.append('mrf', JSON.stringify(newMRF));
//   //   if (formData.sla) {
//   //     requestData.append('sla', formData.sla);
//   //   }

//   //   try {
//   //     const response = await submitMRFForm(requestData);
//   //     toast.success("MRF submitted successfully!", {
//   //       icon: <FaCheckCircle className="text-green-500" />
//   //     });
//   //     navigate('/viewMrf');
//   //     dispatch(setMRFData(newMRF));
//   //     resetForm();
//   //   } catch (error) {
//   //     console.error('Error submitting MRF:', error.response?.data || error);
//   //     toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//   //       icon: <FaTimesCircle className="text-red-500" />
//   //     });
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills.join(','), // Convert to comma-separated string
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         contractStartDate: formData.contractStartDate || null,
//         closureDate: formData.closureDate || null,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//           billingCycle: formData.billingCycle || null,
//           proposedBudget: formData.proposedBudget || null,
//           negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//           requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//           employeeId: parseInt(employeeId, 10), // Ensure correct type
//       },
//       clientPartner: {
//           employeeId: parseInt(employeeId, 10), // Ensure correct type
//       },
//       subRequirements: {
//           subRequirementId: subRequirementDetails.subRequirementId || ''
//       },
//       jobParamenterList: formData.jobParamenterList.join(',') // Convert to comma-separated string
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
// };
//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [], // Reset as an empty array
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//       jobParamenterList :[],
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//                 disabled
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
//               <Select
//                 isMulti
//                 options={skillOptions}
//                 value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
//                 onChange={handleSkillChange}
//                 className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Upload SOW Document</label>
//               <input
//                 type="file"
//                 accept=".pdf, .docx"
//                 onChange={(e) => handleChange("sla", e.target.files[0])}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.sla ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.sla && <p className="text-red-500 text-sm">{errors.sla}</p>}
//             </div>
//           </div>
//         );

//   case 3:
//   const selectedSkills = formData.jobParamenterList;

//   const handleRemoveSkill = (skill) => {
//     const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
//     handleSkillChangeForJobParameters(updatedSkills);
//   };

//   const handleSkillInputChange = (e) => {
//     setSkillInput(e.target.value);
//   };

//   const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));

//   const handleSkillDragOver = (e) => {
//     e.preventDefault(); // Necessary to allow for dropping
//   };

//   const handleDragStart = (e, skill) => {
//     e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
//   };

//   const handleSkillClick = (skill) => {
//     const currentSkills = selectedSkills || [];
//     if (currentSkills.includes(skill)) {
//       const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
//       handleSkillChangeForJobParameters(updatedSkills);
//     } else {
//       handleSkillChangeForJobParameters([...currentSkills, skill]);
//     }
//   };

//   const handleAddSkill = () => {
//     const trimmedSkillInput = skillInput.trim();
//     if (trimmedSkillInput && 
//         !allSkills.includes(trimmedSkillInput) && 
//         !selectedSkills.includes(trimmedSkillInput)) {
//       handleSkillChangeForJobParameters([...selectedSkills, trimmedSkillInput]);
//       setSkillInput(''); // Clear the input field after adding
//     }
//   };

//   const handleClearAllSkills = () => {
//     handleSkillChangeForJobParameters([]); // Clear all selected skills
//   };

//   const handleSkillDropOnSelected = (e) => {
//     e.preventDefault();
//     const skill = e.dataTransfer.getData("text/plain");
//     if (!selectedSkills.includes(skill)) {
//       handleSkillChangeForJobParameters([...selectedSkills, skill]);
//     }
//   };

//   const handleSkillDrop = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//         <div 
//            className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2" 
//            onDrop={handleSkillDropOnSelected} 
//            onDragOver={handleSkillDragOver}>
//           <div className="flex-grow space-x-2 flex flex-wrap">
//             {selectedSkills.length > 0 ? (
//               selectedSkills.map(skill => (
//                 <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                   <span>{skill}</span>
//                   <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
//                     ✖
//                   </button>
//                 </div>
//               ))
//             ) : 'No skills selected'}
//           </div>
//           <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
//             Clear All
//           </button>
//         </div>
//       </div>

//       <div>
//         <label className="block text-lg font-medium text-gray-700 mb-1">Add Skill:</label>
//         <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2">
//           <input
//             type="text"
//             value={skillInput}
//             onChange={handleSkillInputChange}
//             placeholder="Type a skill"
//             className="flex-grow p-2 border-0 focus:outline-none bg-gray-100"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 handleAddSkill(); // Add skill on Enter key press
//               }
//             }}
//           />
//           <button onClick={handleAddSkill} className="text-blue-600 hover:underline">
//             Add
//           </button>
//         </div>
//       </div>

//       {/* Available Skills Droppable area */}
//       <div className="mt-4 border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}
//            onDrop={handleSkillDrop} onDragOver={handleSkillDragOver}>
//           <h4 className="font-semibold">Available Skills:</h4>
//           <ul className="grid grid-cols-2 gap-2 mt-2">
//               {filteredSkills.map(skill => (
//                 <li
//                   key={skill}
//                   draggable
//                   onDragStart={(e) => handleDragStart(e, skill)}
//                   onClick={() => handleSkillClick(skill)}
//                   className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${selectedSkills.includes(skill) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//                 >
//                   {skill}
//                 </li>
//               ))}
//               {filteredSkills.length === 0 && skillInput && (
//                 <li className="text-gray-500 text-sm text-center">No skills found</li>
//               )}
//           </ul>
//       </div>
//     </div>
//   );
//       case 4:
//         return (
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(formData).map(([key, value]) => (
//               <div key={key} className="flex justify-between my-2">
//                 <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
//                 <span className="text-right">{key === "sla" && value ? value.name : value || "N/A"}</span>
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />

//       {/* Card for Organization and Client Details */}
//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setDetailModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>

//       {/* Right Side - Form for MRF Creation */}
//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}
//                 >
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRFformCreation;


// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import Select from 'react-select';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import MRFPreview from './MRFPreview';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   'Financials',
//   'Skill Parameters',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [], // Changed from string to array
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//     jobParamenterList : []
//   });

//   const [skillInput, setSkillInput] = useState('');
//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);

//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const allSkills = [
//     'Logical',
//     'Reasoning',
//     'Presentation',
//     'Communication',
//     'Teamwork',
//     'Problem-Solving',
//     'Time Management',
//     'Adaptability',
//     'Critical Thinking',
//     'Interpersonal Skills',
//     'Creativity',
//     'Leadership',
//     'Conflict Resolution',
//     'Decision Making',
//     'Negotiation',
//     'Emotional Intelligence',
//     'Networking',
//     'Persuasion',
//     'Stress Management',
//     'Project Management',
//     'Strategic Planning',
//   ];

//   const handleSkillChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : []; // Change from join to array
//     setFormData({ ...formData, requiredSkills: values });
//     setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
//   };

//   const handleSkillChangeForJobParameters = (skillList) => {
//     // Ensure skillList is an array
//     if (!Array.isArray(skillList)) {
//         console.error("Expected an array of skills but got:", skillList);
//         return;
//     }

//     setFormData({ ...formData, jobParamenterList: skillList });
//     setErrors((prev) => ({ ...prev, jobParamenterList: undefined }));
// };


//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = skillOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };

// const handleTechnologySelect = (technology) => {
//   handleChange("requiredTechnology", technology);
//   setShowSuggestions(false);
// };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 3:
//         if (formData.jobParamenterList.length === 0) newErrors.jobParamenterList = "At least one skill is required.";
//         break; // Check for skills in the Skill Parameters step
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills.join(','), // Convert to comma-separated string
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         contractStartDate: formData.contractStartDate || null,
//         closureDate: formData.closureDate || null,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//           billingCycle: formData.billingCycle || null,
//           proposedBudget: formData.proposedBudget || null,
//           negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//           requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//           employeeId: parseInt(employeeId, 10), // Ensure correct type
//       },
//       clientPartner: {
//           employeeId: parseInt(employeeId, 10), // Ensure correct type
//       },
//       subRequirements: {
//           subRequirementId: subRequirementDetails.subRequirementId || ''
//       },
//       jobParamenterList: formData.jobParamenterList.join(',') // Convert to comma-separated string
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
// };
//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [], // Reset as an empty array
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//       jobParamenterList :[],
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//                 disabled
//               />
//             </div>
//           </div>
//         );
//       case 1:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
//               <Select
//                 isMulti
//                 options={skillOptions}
//                 value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
//                 onChange={handleSkillChange}
//                 className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Upload SOW Document</label>
//               <input
//                 type="file"
//                 accept=".pdf, .docx"
//                 onChange={(e) => handleChange("sla", e.target.files[0])}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.sla ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.sla && <p className="text-red-500 text-sm">{errors.sla}</p>}
//             </div>
//           </div>
//         );

//   case 3:
// const selectedSkills = formData.jobParamenterList;

// const handleRemoveSkill = (skill) => {
//   const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
//   handleSkillChangeForJobParameters(updatedSkills);
// };

// const handleSkillInputChange = (e) => {
//   setSkillInput(e.target.value);
// };

// const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));

// const handleSkillDragOver = (e) => {
//   e.preventDefault(); // Necessary to allow for dropping
// };

// const handleDragStart = (e, skill) => {
//   e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
// };

// const handleSkillClick = (skill) => {
//   const currentSkills = selectedSkills || [];
//   if (currentSkills.includes(skill)) {
//     const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
//     handleSkillChangeForJobParameters(updatedSkills);
//   } else {
//     handleSkillChangeForJobParameters([...currentSkills, skill]);
//   }
// };

// const handleAddSkill = () => {
//   const trimmedSkillInput = skillInput.trim();
//   if (trimmedSkillInput && 
//       !allSkills.includes(trimmedSkillInput) && 
//       !selectedSkills.includes(trimmedSkillInput)) {
//     handleSkillChangeForJobParameters([...selectedSkills, trimmedSkillInput]);
//     setSkillInput(''); // Clear the input field after adding
//   }
// };

// const handleClearAllSkills = () => {
//   handleSkillChangeForJobParameters([]); // Clear all selected skills
// };

// const handleSkillDropOnSelected = (e) => {
//   e.preventDefault();
//   const skill = e.dataTransfer.getData("text/plain");
//   if (!selectedSkills.includes(skill)) {
//     handleSkillChangeForJobParameters([...selectedSkills, skill]);
//   }
// };

// const handleSkillDrop = (e) => {
//   e.preventDefault();
// };

// return (
//   <div className="space-y-4">
//     <div>
//       <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//       <div 
//          className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2" 
//          onDrop={handleSkillDropOnSelected} 
//          onDragOver={handleSkillDragOver}>
//         <div className="flex-grow space-x-2 flex flex-wrap">
//           {selectedSkills.length > 0 ? (
//             selectedSkills.map(skill => (
//               <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                 <span>{skill}</span>
//                 <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
//                   ✖
//                 </button>
//               </div>
//             ))
//           ) : 'No skills selected'}
//         </div>
//         <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
//           Clear All
//         </button>
//       </div>
//     </div>

//     <div>
//       <label className="block text-lg font-medium text-gray-700 mb-1">Add Skill:</label>
//       <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2">
//         <input
//           type="text"
//           value={skillInput}
//           onChange={handleSkillInputChange}
//           placeholder="Type a skill"
//           className="flex-grow p-2 border-0 focus:outline-none bg-gray-100"
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               handleAddSkill(); // Add skill on Enter key press
//             }
//           }}
//         />
//         <button onClick={handleAddSkill} className="text-blue-600 hover:underline">
//           Add
//         </button>
//       </div>
//     </div>

//     {/* Available Skills Droppable area */}
//     <div className="mt-4 border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}
//          onDrop={handleSkillDrop} onDragOver={handleSkillDragOver}>
//         <h4 className="font-semibold">Available Skills:</h4>
//         <ul className="grid grid-cols-2 gap-2 mt-2">
//             {filteredSkills.map(skill => (
//               <li
//                 key={skill}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, skill)}
//                 onClick={() => handleSkillClick(skill)}
//                 className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${selectedSkills.includes(skill) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//               >
//                 {skill}
//               </li>
//             ))}
//             {filteredSkills.length === 0 && skillInput && (
//               <li className="text-gray-500 text-sm text-center">No skills found</li>
//             )}
//         </ul>
//     </div>
//   </div>
// );
//   case 4:
//     // return (
//     //   <div className="overflow-x-auto">
//     //     <table className="min-w-full bg-white border border-gray-300">
//     //       <thead>
//     //         <tr className="bg-gray-200 text-gray-600">
//     //           <th className="py-2 px-4 border-b text-left">Field</th>
//     //           <th className="py-2 px-4 border-b text-left">Value</th>
//     //         </tr>
//     //       </thead>
//     //       <tbody>
//     //         {Object.entries(formData).map(([key, value]) => (
//     //           <tr key={key} className="hover:bg-gray-100">
//     //             <td className="py-2 px-4 border-b font-medium">{key.replace(/([A-Z])/g, " $1")}</td>
//     //             <td className="py-2 px-4 border-b text-gray-700">
//     //               {key === "sla" && value ? value.name : Array.isArray(value) ? value.join(", ") : value || "N/A"}
//     //             </td>
//     //           </tr>
//     //         ))}
//     //       </tbody>
//     //     </table>
//     //   </div>
//     return <MRFPreview formData={formData} />;

//   default:
//     return null;
//             }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />

//       {/* Card for Organization and Client Details */}
//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setDetailModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>

//       {/* Right Side - Form for MRF Creation */}
//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div
//                   className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}
//                 >
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MRFformCreation;

// code works well buddy


// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import Select from 'react-select';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import MRFPreview from './MRFPreview';
// import axios from 'axios';

// const steps = [
//   'Basic Information',
//   'Job Details',
//    // New Step
//   'Financials',
//   'Skill Parameters',
//   'Job Description',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [rolesAndResponsibilitiesUrl, setRolesAndResponsibilitiesUrl] = useState('');
//   const [rolesAndResponsibilitiesModalOpen, setRolesAndResponsibilitiesModalOpen] = useState(false);



//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [],
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Not Assigned',
//     mrfType: '',
//     jobParamenterList: []
//   });

//   const [skillInput, setSkillInput] = useState('');
//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);
//   const [jobDescription, setJobDescription] = useState(null);
//   const [loadingJobDescription, setLoadingJobDescription] = useState(false);

//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const allSkills = [
//     'Logical',
//     'Reasoning',
//     'Presentation',
//     'Communication',
//     'Teamwork',
//     'Problem-Solving',
//     'Time Management',
//     'Adaptability',
//     'Critical Thinking',
//     'Interpersonal Skills',
//     'Creativity',
//     'Leadership',
//     'Conflict Resolution',
//     'Decision Making',
//     'Negotiation',
//     'Emotional Intelligence',
//     'Networking',
//     'Persuasion',
//     'Stress Management',
//     'Project Management',
//     'Strategic Planning',
//   ];

//   // Function to view the roles and responsibilities blob document
//   const handleViewBlobDocument = () => {
//     const base64 = jobDescription ? jobDescription.rolesAndResponsibilities : null;
//     if (base64) {
//       const byteCharacters = atob(base64);
//       const byteNumbers = new Uint8Array(byteCharacters.length);

//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }

//       const blob = new Blob([byteNumbers], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       setRolesAndResponsibilitiesUrl(url); // Set the PDF URL
//       setRolesAndResponsibilitiesModalOpen(true);   // Open the modal to view the PDF
//     } else {
//       console.error('No roles and responsibilities document available.');
//     }
//   };


//   const handleSkillChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData({ ...formData, requiredSkills: values });
//     setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
//   };

//   const handleSkillChangeForJobParameters = (skillList) => {
//     if (!Array.isArray(skillList)) {
//       console.error("Expected an array of skills but got:", skillList);
//       return;
//     }
//     setFormData({ ...formData, jobParamenterList: skillList });
//     setErrors((prev) => ({ ...prev, jobParamenterList: undefined }));
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = skillOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };
//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//       case 2: // Job Description step
//         break; // No validations needed for this step
//       case 3:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 4:
//         if (formData.jobParamenterList.length === 0) newErrors.jobParamenterList = "At least one skill is required.";
//         break;
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills.join(','),
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         contractStartDate: formData.contractStartDate || null,
//         closureDate: formData.closureDate || null,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//         billingCycle: formData.billingCycle || null,
//         proposedBudget: formData.proposedBudget || null,
//         negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//         requirementId: requirementDetails.requirementId,
//       },
//       jobDescriptionId: 1,
//       businessUnitHead: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       clientPartner: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       subRequirements: {
//         subRequirementId: subRequirementDetails.subRequirementId || ''
//       },
//       jobParamenterList: formData.jobParamenterList.join(',')
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [],
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Not Assigned',
//       mrfType: '',
//       jobParamenterList: [],
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   // Fetch job description from backend
//   const fetchJobDescription = async (jobTitle) => {
//     try {
//       setLoadingJobDescription(true);
//       const response = await axios.get(`http://localhost:8080/tap/jobDescription/getJobDescriptionByJobTitle/${jobTitle}`);
//       setJobDescription(response.data);
//     } catch (error) {
//       console.error('Error fetching job description:', error);
//       toast.error('Failed to fetch job description.');
//     } finally {
//       setLoadingJobDescription(false);
//     }
//   };

//   // Trigger fetching on job title change
//   useEffect(() => {
//     if (activeStep === 2) {
//       fetchJobDescription(formData.probableDesignation);
//     }
//   }, [activeStep, formData.probableDesignation]);

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//                 disabled
//               />
//             </div>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );



//       case 2:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
//               <Select
//                 isMulti
//                 options={skillOptions}
//                 value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
//                 onChange={handleSkillChange}
//                 className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Upload SOW Document</label>
//               <input
//                 type="file"
//                 accept=".pdf, .docx"
//                 onChange={(e) => handleChange("sla", e.target.files[0])}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.sla ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.sla && <p className="text-red-500 text-sm">{errors.sla}</p>}
//             </div>
//           </div>
//         );

//       case 3: // Skill Parameters Step
//       const selectedSkills = formData.jobParamenterList;

//       const handleRemoveSkill = (skill) => {
//         const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
//         handleSkillChangeForJobParameters(updatedSkills);
//       };

//       const handleSkillInputChange = (e) => {
//         setSkillInput(e.target.value);
//       };

//       const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));

//       const handleSkillDragOver = (e) => {
//         e.preventDefault(); // Necessary to allow for dropping
//       };

//       const handleDragStart = (e, skill) => {
//         e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
//       };

//       const handleSkillClick = (skill) => {
//         const currentSkills = selectedSkills || [];
//         if (currentSkills.includes(skill)) {
//           const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
//           handleSkillChangeForJobParameters(updatedSkills);
//         } else {
//           handleSkillChangeForJobParameters([...currentSkills, skill]);
//         }
//       };

//       const handleAddSkill = () => {
//         const trimmedSkillInput = skillInput.trim();
//         if (trimmedSkillInput && 
//             !allSkills.includes(trimmedSkillInput) && 
//             !selectedSkills.includes(trimmedSkillInput)) {
//           handleSkillChangeForJobParameters([...selectedSkills, trimmedSkillInput]);
//           setSkillInput(''); // Clear the input field after adding
//         }
//       };

//       const handleClearAllSkills = () => {
//         handleSkillChangeForJobParameters([]); // Clear all selected skills
//       };

//       const handleSkillDropOnSelected = (e) => {
//         e.preventDefault();
//         const skill = e.dataTransfer.getData("text/plain");
//         if (!selectedSkills.includes(skill)) {
//           handleSkillChangeForJobParameters([...selectedSkills, skill]);
//         }
//       };

//       const handleSkillDrop = (e) => {
//         e.preventDefault();
//       };

//       return (
//         <div className="space-y-4">
//           <div>
//             <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//             <div 
//                className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2" 
//                onDrop={handleSkillDropOnSelected} 
//                onDragOver={handleSkillDragOver}>
//               <div className="flex-grow space-x-2 flex flex-wrap">
//                 {selectedSkills.length > 0 ? (
//                   selectedSkills.map(skill => (
//                     <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                       <span>{skill}</span>
//                       <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
//                         ✖
//                       </button>
//                     </div>
//                   ))
//                 ) : 'No skills selected'}
//               </div>
//               <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
//                 Clear All
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-lg font-medium text-gray-700 mb-1">Add Skill:</label>
//             <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2">
//               <input
//                 type="text"
//                 value={skillInput}
//                 onChange={handleSkillInputChange}
//                 placeholder="Type a skill"
//                 className="flex-grow p-2 border-0 focus:outline-none bg-gray-100"
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     handleAddSkill(); // Add skill on Enter key press
//                   }
//                 }}
//               />
//               <button onClick={handleAddSkill} className="text-blue-600 hover:underline">
//                 Add
//               </button>
//             </div>
//           </div>

//           {/* Available Skills Droppable area */}
//           <div className="mt-4 border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}
//                onDrop={handleSkillDrop} onDragOver={handleSkillDragOver}>
//               <h4 className="font-semibold">Available Skills:</h4>
//               <ul className="grid grid-cols-2 gap-2 mt-2">
//                   {filteredSkills.map(skill => (
//                     <li
//                       key={skill}
//                       draggable
//                       onDragStart={(e) => handleDragStart(e, skill)}
//                       onClick={() => handleSkillClick(skill)}
//                       className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${selectedSkills.includes(skill) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//                     >
//                       {skill}
//                     </li>
//                   ))}
//                   {filteredSkills.length === 0 && skillInput && (
//                     <li className="text-gray-500 text-sm text-center">No skills found</li>
//                   )}
//               </ul>
//           </div>
//         </div>
//       );

//       case 4: // Job Description Step
//       return (
//         <div>
//           {loadingJobDescription ? (
//             <p>Loading job description...</p>
//           ) : jobDescription ? (
//             <div>
//               <h3 className="text-lg font-medium">Job Title: {jobDescription.jobTitle}</h3>
//               <h4 className="text-lg font-medium">Roles and Responsibilities:</h4>
//               <div className="mt-2">
//                 <h2>Roles and Responsibilities</h2>
//                 {jobDescription.rolesAndResponsibilities ? (
//                   <iframe
//                     title="Roles and Responsibilities"
//                     src={`data:application/pdf;base64,${jobDescription.rolesAndResponsibilities}`} // Direct Base64 PDF render
//                     className="w-full h-96"
//                   />
//                 ) : (
//                   <p>No roles and responsibilities document available.</p>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <p>No job description found.</p>
//           )}
//         </div>
//       );
//       case 5: // Preview Step
//         return <MRFPreview formData={formData} />;

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />
//       <Toaster position="top-center" reverseOrder={false} />



//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20 z-10">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative: {clientName || 'N/A'}</p>
//         <button onClick={() => setDetailModalOpen(true)} className="mt-2 text-blue-600 hover:underline">View More</button>
//       </div>

//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Submit
//               </button>
//             )}
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default MRFformCreation;


// import React, { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
// import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
// import { useLocation, useNavigate } from 'react-router-dom';
// import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
// import Select from 'react-select';
// import { Toaster, toast } from 'react-hot-toast';
// import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import MRFPreview from './MRFPreview';
// import axios from 'axios';
// import ReactQuill from 'react-quill'; // Import the editor package
// import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
// import { jsPDF } from "jspdf";
// import * as pdfjsLib from 'pdfjs-dist/webpack';

// const steps = [
//   'Basic Information',
//   'Job Details',
//   // New Step
//   'Financials',
//   'Skill Parameters',
//   'Job Description',
//   'Preview & Submit',
// ];

// const MRFformCreation = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { state } = location;
//   const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

  

//   const employeeId = sessionStorage.getItem('employeeId');
//   const [detailModalOpen, setDetailModalOpen] = useState(false);

//   const [rolesAndResponsibilitiesUrl, setRolesAndResponsibilitiesUrl] = useState('');
//   const [rolesAndResponsibilitiesModalOpen, setRolesAndResponsibilitiesModalOpen] = useState(false);

//   const [MrfJdData, setMrfJdData] = useState(null);

//   console.log("requirementDetails");
//   console.log(requirementDetails);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editorContent, setEditorContent] = useState(''); // Initialize the editor content state
//   const [formData, setFormData] = useState({
//     mrfDepartmentName: '',
//     requiredTechnology: '',
//     probableDesignation: subRequirementDetails.role || '',
//     requiredResourceCount: subRequirementDetails.resourceCount || '',
//     requiredSkills: [],
//     employmentMode: '',
//     educationalQualification: '',
//     yearsOfExperience: '',
//     minCTC: '',
//     maxCTC: '',
//     jobLocation: '',
//     contractStartDate: '',
//     closureDate: '',
//     sla: null,
//     billingCycle: '',
//     proposedBudget: '',
//     negotiatedPricePoint: '',
//     approvalStatus: 'Pending',
//     mrfStage: 'Pending',
//     mrfType: '',
//     jobParamenterList: []
//   });

//   const [skillInput, setSkillInput] = useState('');
//   const [activeStep, setActiveStep] = useState(0);
//   const totalSteps = steps.length;
//   const [errors, setErrors] = useState({});
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);
//   const [jobDescription, setJobDescription] = useState(null);
//   const [loadingJobDescription, setLoadingJobDescription] = useState(false);
//   const [logoSrc, setLogoSrc] = useState('');
//   const [decodedText, setDecodedText] = useState('');

//   const [selectedSkills, setSelectedSkills] = useState([]);

//   const [isSOWUploaded, setIsSOWUploaded] = useState(false); // Track if the SOW document is uploaded

//   const handleSOWDocumentUpload = (uploaded) => {
//       setIsSOWUploaded(uploaded);
//   };
//   const closeModal = () => {
//     setModalOpen(false);
//   };
  
//   const skillOptions = [
//     { value: 'JavaScript', label: 'JavaScript' },
//     { value: 'Python', label: 'Python' },
//     { value: 'Java', label: 'Java' },
//     { value: 'C#', label: 'C#' },
//     { value: 'React', label: 'React' },
//     { value: 'Node.js', label: 'Node.js' },
//     { value: 'Django', label: 'Django' },
//   ];

//   const technologyOptions = [
//     { value: 'Full Stack Development', label: 'Full Stack Development' },
//     { value: 'AI', label: 'AI' },
//     { value: 'ML', label: 'ML' },
//     { value: 'Cloud', label: 'Cloud' },
//     { value: 'DevOps', label: 'DevOps' },
//     { value: 'SDET', label: 'SDET' },
//   ];

//   const allSkills = [
//     'Logical',
//     'Reasoning',
//     'Presentation',
//     'Communication',
//     'Teamwork',
//     'Problem-Solving',
//     'Time Management',
//     'Adaptability',
//     'Critical Thinking',
//     'Interpersonal Skills',
//     'Creativity',
//     'Leadership',
//     'Conflict Resolution',
//     'Decision Making',
//     'Negotiation',
//     'Emotional Intelligence',
//     'Networking',
//     'Persuasion',
//     'Stress Management',
//     'Project Management',
//     'Strategic Planning',
//   ];

//   // Function to view the roles and responsibilities blob document
//   const handleViewBlobDocument = () => {
//     const base64 = jobDescription ? jobDescription.rolesAndResponsibilities : null;
//     if (base64) {
//       const byteCharacters = atob(base64);
//       const byteNumbers = new Uint8Array(byteCharacters.length);

//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }

//       const blob = new Blob([byteNumbers], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       setRolesAndResponsibilitiesUrl(url); // Set the PDF URL
//       setRolesAndResponsibilitiesModalOpen(true);   // Open the modal to view the PDF
//     } else {
//       console.error('No roles and responsibilities document available.');
//     }
//   };


//   const handleSkillChange = (selectedOptions) => {
//     const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
//     setFormData({ ...formData, requiredSkills: values });
//     setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
//   };

//   const handleSkillChangeForJobParameters = (skillList) => {
//     if (!Array.isArray(skillList)) {
//       console.error("Expected an array of skills but got:", skillList);
//       return;
//     }
//     setFormData({ ...formData, jobParamenterList: skillList });
//     setErrors((prev) => ({ ...prev, jobParamenterList: undefined }));
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleTechnologyInputChange = (value) => {
//     setFormData((prev) => ({ ...prev, requiredTechnology: value }));

//     if (value) {
//       const filtered = technologyOptions.filter(tech =>
//         tech.label.toLowerCase().includes(value.toLowerCase())
//       );
//       setSuggestedTechnologies(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestedTechnologies([]);
//       setShowSuggestions(false);
//     }
//   };
//   const handleTechnologySelect = (technology) => {
//     handleChange("requiredTechnology", technology);
//     setShowSuggestions(false);
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(activeStep);
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
//     }
//   };

//   const validateStep = (step) => {
//     const newErrors = {};
//     switch (step) {
//       case 0:
//         if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
//         if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
//         if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
//         if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
//         break;
//       case 1:
//         if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
//         if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
//         if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
//         if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
//         break;
//        // No validations needed for this step
//       case 2:
//         if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
//           newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
//         }
//         if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
//           newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
//         } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
//           newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
//         }
//         if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
//           newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
//         }
//         if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
//           newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
//         }
//         if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
//         break;
//       case 3:
//         if (formData.jobParamenterList.length === 0) newErrors.jobParamenterList = "At least one skill is required.";
//         break;
//         case 4: // Job Description step
//         break;
//       default:
//         break;
//     }
//     return newErrors;
//   };

//   const handleSubmit = async () => {
//     if (!employeeId) {
//       toast.error("Employee ID not found in session storage.");
//       return;
//     }

//     if (!isSOWUploaded) {
//       toast.error('Please upload the SOW document before submitting!');
//       return;
//   }

//     const finalErrors = validateStep(activeStep);
//     if (Object.keys(finalErrors).length > 0) {
//       toast.error("Please resolve the errors before submission.");
//       return;
//     }

//     const newMRF = {
//       mrfDepartmentName: formData.mrfDepartmentName || null,
//       mrfRequiredTechnology: formData.requiredTechnology || null,
//       probableDesignation: formData.probableDesignation || null,
//       requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
//       requiredSkills: formData.requiredSkills.join(','),
//       mrfCriteria: {
//         employmentMode: formData.employmentMode || null,
//         educationalQualification: formData.educationalQualification || null,
//         yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
//         minimumCTC: parseFloat(formData.minCTC) || 0.0,
//         maximumCTC: parseFloat(formData.maxCTC) || 0.0,
//         contractStartDate: formData.contractStartDate || null,
//         closureDate: formData.closureDate || null,
//         jobLocation: formData.jobLocation || null,
//       },
//       mrfStatus: {
//         mrfApprovalStatus: formData.approvalStatus || null,
//         mrfStage: formData.mrfStage || null,
//         mrfType: formData.mrfType || null,
//       },
//       mrfAgreement: {
//         billingCycle: formData.billingCycle || null,
//         proposedBudget: formData.proposedBudget || null,
//         negotiatedPricePoint: formData.negotiatedPricePoint || null,
//       },
//       requirement: {
//         requirementId: requirementDetails.requirementId,
//       },
//       businessUnitHead: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       clientPartner: {
//         employeeId: parseInt(employeeId, 10),
//       },
//       subRequirements: {
//         subRequirementId: subRequirementDetails.subRequirementId || ''
//       },
//       mrfJd: {
//         mrfJdId: MrfJdData.mrfJdId,
//       }
//       // jobParamenterList: formData.jobParamenterList.join(',')
//     };

//     const requestData = new FormData();
//     requestData.append('mrf', JSON.stringify(newMRF));
//     if (formData.sla) {
//       requestData.append('sla', formData.sla);
//     }

//     console.log(requestData);
//     try {
//       const response = await submitMRFForm(requestData);
//       toast.success("MRF submitted successfully!", {
//         icon: <FaCheckCircle className="text-green-500" />
//       });
//       navigate('/viewMrf');
//       dispatch(setMRFData(newMRF));
//       resetForm();
//     } catch (error) {
//       console.error('Error submitting MRF:', error.response?.data || error);
//       toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
//         icon: <FaTimesCircle className="text-red-500" />
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       mrfDepartmentName: '',
//       requiredTechnology: '',
//       probableDesignation: '',
//       requiredResourceCount: '',
//       requiredSkills: [],
//       employmentMode: '',
//       educationalQualification: '',
//       yearsOfExperience: '',
//       minCTC: '',
//       maxCTC: '',
//       jobLocation: '',
//       contractStartDate: '',
//       closureDate: '',
//       sla: null,
//       billingCycle: '',
//       proposedBudget: '',
//       negotiatedPricePoint: '',
//       approvalStatus: 'Pending',
//       mrfStage: 'Pending',
//       mrfType: '',
//       jobParamenterList: [],
//     });
//     setActiveStep(0);
//     setShowSuggestions(false);
//     setSuggestedTechnologies([]);
//   };

//   // Fetch job description from backend
//   const fetchJobDescription = async (jobTitle) => {
//     try {
//       setLoadingJobDescription(true);
//       const response = await axios.get(`http://localhost:8080/tap/jobDescription/getJobDescriptionByJobTitle/${jobTitle}`);
//       setJobDescription(response.data);
//     } catch (error) {
//       console.error('Error fetching job description:', error);
//       toast.error('Failed to fetch job description.');
//     } finally {
//       setLoadingJobDescription(false);
//     }
//   };

//   const decodeBase64ToText = async (base64String) => {
//     console.log("VANTHUTAN DA")
//     try {
//       // const decodedString = atob(base64String);
//       // console.log("Vanakam Bro"+decodedString);
//       // return decodedString;
//     const pdfBlob = await fetchPDFBlob(jobDescription.rolesAndResponsibilities);
//     const pdfText = await extractTextFromPDF(pdfBlob);
//     const parsedData = populateFieldsFromText(pdfText);

//     return parsedData;


//     } catch (error) {
//       console.error("Error decoding Base64:", error);
//       return ""; // Return an empty string if decoding fails
//     }
//   };
//   const fetchPDFBlob = async (base64String) => {
//     console.log("FetchedBlob");
//     const byteCharacters = atob(base64String);
//     const byteNumbers = new Array(byteCharacters.length);
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     return new Blob([byteArray], { type: 'application/pdf' });
//   };
//   const extractTextFromPDF = async (pdfBlob) => {
//     console.log("extractTextFromPDF");
//     const fileReader = new FileReader();
//     return new Promise((resolve, reject) => {
//       fileReader.onloadend = async () => {
//         const pdfData = new Uint8Array(fileReader.result);
//         const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise;
 
//         let textContent = '';
//         for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
//           const page = await pdfDocument.getPage(pageNum);
//           const content = await page.getTextContent();
//           content.items.forEach((item) => {
//             textContent += item.str + ' ';
//           });
//         }
 
//         resolve(textContent);
//       };
//       fileReader.onerror = reject;
//       fileReader.readAsArrayBuffer(pdfBlob); // Read Blob as ArrayBuffer
//     });
//   };

//   const populateFieldsFromText = (text) => {
//     console.log("populateFieldsFromText");
//     const fieldPatterns = {
//       type: /Type:\s*“(.*?)”/i,
//       location: /Location:\s*“(.*?)”/i,
//       jobDescription: /Job Description:\s*([\s\S]*?)(?=Qualifications:)/i,
//       qualifications: /Qualifications:\s*([\s\S]*?)(?=Responsibilities:)/i,
//       responsibilities: /Responsibilities:\s*([\s\S]*)/i,
//     };
 
//     const parsedData = {};
 
//     Object.keys(fieldPatterns).forEach((key) => {
//       const match = text.match(fieldPatterns[key]);
//       parsedData[key] = match && match[1] ? match[1].trim() : 'Not found';
//     });
 
    
//     return parsedData;
//   };

//   // Trigger fetching on job title change
//   useEffect(() => {
//     if (activeStep === 2) {
//       fetchJobDescription(formData.probableDesignation);
//     }
//     const decodeRolesAndResponsibilities = async () => {
//       if (jobDescription && jobDescription.rolesAndResponsibilities) {
//         const cleanedBase64String = jobDescription.rolesAndResponsibilities.trim();
//         const parsedData = await decodeBase64ToText(cleanedBase64String);
//         console.log("inagatha",parsedData);
//         if (parsedData) {
//           setDecodedText(parsedData); // Set the decoded text to state
//         }
//       }
//     };
  
//     decodeRolesAndResponsibilities();
//   }, [activeStep, formData.probableDesignation]);

//   const skillsRef = useRef(null); // Create a ref to focus the container/input

//   useEffect(() => {
//     // Check if there are any errors and if skills are selected, if not focus on the container
//     if (selectedSkills.length === 0 && !errors.jobParamenterList) {
//       skillsRef.current?.focus();
//     }
//   }, [selectedSkills, errors]);

//   const renderStepContent = (step) => {
//     switch (step) {
//       case 0:
//         return (
//           <div className="space-y-4">
//             <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
//             <select
//               value={formData.mrfDepartmentName}
//               onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
//               className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Department</option>
//               <option value="IT">IT</option>
//               <option value="HR">HR</option>
//               <option value="Finance">Finance</option>
//             </select>

//             <div className="mt-4">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
//               <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
//                 {formData.probableDesignation || 'No Designation Selected'}
//               </div>
//             </div>

//             <div className="mt-4 relative">
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
//               <input
//                 type="text"
//                 value={formData.requiredTechnology}
//                 onChange={(e) => handleTechnologyInputChange(e.target.value)}
//                 placeholder="Type or select technology"
//                 className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {showSuggestions && suggestedTechnologies.length > 0 && (
//                 <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
//                   {suggestedTechnologies.map((technology) => (
//                     <li
//                       key={technology.label}
//                       onClick={() => handleTechnologySelect(technology.label)}
//                       className="p-2 hover:bg-gray-100 cursor-pointer"
//                     >
//                       {technology.label}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
//               <input
//                 type="number"
//                 value={formData.requiredResourceCount}
//                 onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
//                 placeholder="Required Resource Count"
//                 className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
//                 disabled
//               />
//             </div>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
//               <input
//                 type="text"
//                 value={formData.educationalQualification}
//                 onChange={(e) => handleChange("educationalQualification", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
//               <input
//                 type="number"
//                 value={formData.yearsOfExperience}
//                 onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
//               <input
//                 type="text"
//                 value={formData.jobLocation}
//                 onChange={(e) => handleChange("jobLocation", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
//               <select
//                 value={formData.employmentMode}
//                 onChange={(e) => handleChange("employmentMode", e.target.value)}
//                 className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
//               >
//                 <option value="">Select Employment Mode</option>
//                 <option value="Full Time">Full Time</option>
//                 <option value="Part Time">Part Time</option>
//                 <option value="Contract">Contract</option>
//                 <option value="Temporary">Temporary</option>
//               </select>
//               {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
//             </div>
//           </div>
//         );



//       case 2:
//         return (
//           <div className="space-y-4">
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC (in LPA)</label>
//               <input
//                 type="number"
//                 value={formData.minCTC}
//                 onChange={(e) => handleChange("minCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC (in LPA)</label>
//               <input
//                 type="number"
//                 value={formData.maxCTC}
//                 onChange={(e) => handleChange("maxCTC", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
//               <input
//                 type="number"
//                 value={formData.proposedBudget}
//                 onChange={(e) => handleChange("proposedBudget", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
//               <input
//                 type="number"
//                 value={formData.negotiatedPricePoint}
//                 onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
//                 className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
//               <select
//                 value={formData.billingCycle}
//                 onChange={(e) => handleChange("billingCycle", e.target.value)}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select Billing Cycle</option>
//                 <option value="Monthly">Monthly</option>
//                 <option value="Quarterly">Quarterly</option>
//               </select>
//               {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
//             </div>
//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
//               <select
//                 value={formData.mrfType}
//                 onChange={(e) => handleChange("mrfType", e.target.value)}
//                 className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
//               >
//                 <option value="">Select MRF Type</option>
//                 <option value="Open">Open</option>
//                 <option value="Closed">Exclusive</option>
//               </select>
//               {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
//             </div>
//             {/* <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
//               <Select
//                 isMulti
//                 options={skillOptions}
//                 value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
//                 onChange={handleSkillChange}
//                 className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
//             </div> */}

// <div>
//   <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
//   <Select
//     isMulti
//     options={skillOptions}
//     value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
//     onChange={handleSkillChange}
//     className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
//     menuPlacement="top"  // Set the dropdown menu to appear above the input field
//   />
//   {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
// </div>
           
//             {/* <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Upload SOW Document</label>
//               <input
//                 type="file"
//                 accept=".pdf, .docx"
//                 onChange={(e) => handleChange("sla", e.target.files[0])}
//                 className={`w-full p-3 text-lg border rounded-md ${errors.sla ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.sla && <p className="text-red-500 text-sm">{errors.sla}</p>}
//             </div> */}
//           </div>
//         );

//       case 3: // Skill Parameters Step
//         const selectedSkills = formData.jobParamenterList;

//         const handleRemoveSkill = (skill) => {
//           const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
//           handleSkillChangeForJobParameters(updatedSkills);
//         };

//         const handleSkillInputChange = (e) => {
//           setSkillInput(e.target.value);
//         };

//         const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));

//         const handleSkillDragOver = (e) => {
//           e.preventDefault(); // Necessary to allow for dropping
//         };

//         const handleDragStart = (e, skill) => {
//           e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
//         };

//         const handleSkillClick = (skill) => {
//           const currentSkills = selectedSkills || [];
//           if (currentSkills.includes(skill)) {
//             const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
//             handleSkillChangeForJobParameters(updatedSkills);
//           } else {
//             handleSkillChangeForJobParameters([...currentSkills, skill]);
//           }
//         };

//         const handleAddSkill = () => {
//           const trimmedSkillInput = skillInput.trim();
//           if (trimmedSkillInput &&
//             !allSkills.includes(trimmedSkillInput) &&
//             !selectedSkills.includes(trimmedSkillInput)) {
//             handleSkillChangeForJobParameters([...selectedSkills, trimmedSkillInput]);
//             setSkillInput(''); // Clear the input field after adding
//           }
//         };

//         const handleClearAllSkills = () => {
//           handleSkillChangeForJobParameters([]); // Clear all selected skills
//         };

//         const handleSkillDropOnSelected = (e) => {
//           e.preventDefault();
//           const skill = e.dataTransfer.getData("text/plain");
//           if (!selectedSkills.includes(skill)) {
//             handleSkillChangeForJobParameters([...selectedSkills, skill]);
//           }
//         };

//         const handleSkillDrop = (e) => {
//           e.preventDefault();
//         };

//         return (
//           <div className="space-y-4">
//             {/* <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
//                <p className={`p-3 text-lg border rounded-md w-full ${errors.jobParamenterList ? 'border-red-500' : 'border-gray-300'}`}></p>
//               <div
//                 className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2"
//                 onDrop={handleSkillDropOnSelected}
//                 onDragOver={handleSkillDragOver}>
//                 <div className="flex-grow space-x-2 flex flex-wrap">
//                   {selectedSkills.length > 0 ? (
//                     selectedSkills.map(skill => (
//                       <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                         <span>{skill}</span>
//                         <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
//                           ✖
//                         </button>
//                       </div>
//                     ))
//                   ) : 'No skills selected'}
//                 </div>
//                 <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
//                   Clear All
//                 </button>
//               </div>
//             </div> */}

// <div>
//       <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
      
//       {/* The container where selected skills are displayed, along with error message if no skills are selected */}
//       <div
//         className={`flex items-center border rounded-md p-2 bg-gray-100 mb-2 ${errors.jobParamenterList ? 'border-red-500' : 'border-gray-300'}`}
//         onDrop={handleSkillDropOnSelected}
//         onDragOver={handleSkillDragOver}
//         ref={skillsRef} // Apply ref here to focus this div when needed
//         tabIndex={0} // Add tabIndex to make div focusable
//       >
//         <div className="flex-grow space-x-2 flex flex-wrap">
//           {selectedSkills.length > 0 ? (
//             selectedSkills.map(skill => (
//               <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
//                 <span>{skill}</span>
//                 <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
//                   ✖
//                 </button>
//               </div>
//             ))
//           ) : (
//             <span className="text-red-500 text-sm">No skills selected</span> // Error message displayed inside the container
//           )}
//         </div>
//         <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
//           Clear All
//         </button>
//       </div>
      
//       {/* Optional: You can display the error message here as well if you want to use a more detailed error outside */}
//       {/* <p className="text-red-500 text-sm">{errors.jobParamenterList}</p> */}
//     </div>

//             <div>
//               <label className="block text-lg font-medium text-gray-700 mb-1">Add Skill:</label>
//               <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2">
//                 <input
//                   type="text"
//                   value={skillInput}
//                   onChange={handleSkillInputChange}
//                   placeholder="Type a skill"
//                   className="flex-grow p-2 border-0 focus:outline-none bg-gray-100"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       handleAddSkill(); // Add skill on Enter key press
//                     }
//                   }}
//                 />
//                 <button onClick={handleAddSkill} className="text-blue-600 hover:underline">
//                   Add
//                 </button>
//               </div>
//             </div>

//             {/* Available Skills Droppable area */}
//             <div className="mt-4 border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}
//               onDrop={handleSkillDrop} onDragOver={handleSkillDragOver}>
//               <h4 className="font-semibold">Available Skills:</h4>
//               <ul className="grid grid-cols-2 gap-2 mt-2">
//                 {filteredSkills.map(skill => (
//                   <li
//                     key={skill}
//                     draggable
//                     onDragStart={(e) => handleDragStart(e, skill)}
//                     onClick={() => handleSkillClick(skill)}
//                     className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${selectedSkills.includes(skill) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
//                   >
//                     {skill}
//                   </li>
//                 ))}
//                 {filteredSkills.length === 0 && skillInput && (
//                   <li className="text-gray-500 text-sm text-center">No skills found</li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         );

//       case 4: // Job Description Step
//         // console.log(atob(jobDescription.rolesAndResponsibilities));
//         // console.log(decodedText);

//         const handleLogoChange = (event) => {
//           const file = event.target.files[0];
//           if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//               setLogoSrc(reader.result); // Update logo src
//               // Update the editor content to include the new logo
//               setEditorContent(`
//           <div style="text-align:center;">
//             <img src="${reader.result}" alt="Logo" style="max-width:100px; height:auto;" />
//           </div>
//           <p><strong>Job Type:</strong> "${formData.employmentMode}"</p>
//           <p><strong>Job Location:</strong> "${formData.jobLocation}"</p>
//           <p><strong>Job Description:</strong></p>
//           <p>(type here)</p>
//           <p><strong>Qualifications:</strong></p>
//           <p>(type here)</p>
//           <p><strong>Responsibilities:</strong></p>
//           <p>(type here)</p>
//         `);
//             };
//             reader.readAsDataURL(file); // Convert the file to a data URL
//           }
//         };

//         const handleSave = async () => {
//           // Check if jobParameterList is defined and is an array
//           const jobParameterString = formData.jobParamenterList.join(',');

//           const pdfBlob = await convertToPDF(); // Get the PDF Blob

//           // Create a FormData object to send the file along with other data
//           const formDataToSend = new FormData();
//           formDataToSend.append("jobTitle", formData.probableDesignation);
//           formDataToSend.append("jobParameter", jobParameterString); // Add jobParameter as string
//           formDataToSend.append("rolesAndResponsibilities", pdfBlob, "roles_and_responsibilities.pdf"); // Append the Blob

//           try {
//             console.log(formDataToSend.get('jobParameter'));
//             const response = await axios.post('http://localhost:8080/tap/jobDescription/addJobDescriptionAssignToMrf', formDataToSend, {
//               headers: {
//                 'Content-Type': 'multipart/form-data' // Set the header to send FormData
//               }
//             });
//             console.log("ithutha");
//             setMrfJdData(response.data);
//             console.log(response.data); // Handle the response as needed

//             const responseForAddNewJd = await axios.post('http://localhost:8080/tap/jobDescription/addJobDescription', formDataToSend, {
//               headers: {
//                 'Content-Type': 'multipart/form-data' // Set the header to send FormData
//               }
//             });
//             console.log(responseForAddNewJd.data);

//             toast.success('Save Changes Successfully');
//           } catch (error) {
//             console.error('Error saving job description:', error);
//           }
//         };
//         const convertToPDF = () => {
//           return new Promise((resolve) => {
//             const doc = new jsPDF();
//             doc.html(editorContent, {
//               callback: function (doc) {
//                 // Create a Blob from the PDF document
//                 const pdfOutput = doc.output('blob'); // Get PDF as Blob
//                 resolve(pdfOutput); // Resolve the promise with the Blob
//               },
//               x: 10,
//               y: 10,
//               width: 190,
//               windowWidth: 650
//             });
//           });
//         };
//         const handleSaveForExistingPdf = async () => {
//         // handleUpdatePdf();
//         toast.success('Job Description Assigned To MRF Successfully');
//         const pdfBlob = await convertToPDF(); // Get the PDF Blob

//           const jobParameterString = formData.jobParamenterList.join(',');
//           const formDataToSend = new FormData();

//           formDataToSend.append("jobTitle", formData.probableDesignation);
//           formDataToSend.append("jobParameter", jobParameterString); // Add jobParameter as string
//           formDataToSend.append("rolesAndResponsibilities", pdfBlob, "roles_and_responsibilities.pdf"); // Append the Blob

//           if (jobDescription && jobDescription.rolesAndResponsibilities) {
//             const rawBase64String = jobDescription.rolesAndResponsibilities.trim();
//             console.log("Raw rolesAndResponsibilities:", rawBase64String);

//             // Check if the Base64 string has the necessary prefix and strip it if so
//             let base64String = rawBase64String;
//             if (base64String.startsWith('data:application/pdf;base64,')) {
//               base64String = base64String.split(',')[1];
//             }

//             // Validate Base64 string format
//             const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/; // Basic rule to check valid Base64

//             if (!base64Regex.test(base64String) || base64String.length % 4 !== 0) {
//               console.error("Invalid Base64 string for roles and responsibilities:", base64String);
//               return; // Exit if the Base64 string is incorrect
//             }

//             try {
//               const byteCharacters = atob(base64String);
//               const byteNumbers = new Array(byteCharacters.length);
//               for (let i = 0; i < byteCharacters.length; i++) {
//                 byteNumbers[i] = byteCharacters.charCodeAt(i);
//               }
//               const byteArray = new Uint8Array(byteNumbers);
//               const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

//               // Append the PDF Blob to the FormData
//               formDataToSend.append("rolesAndResponsibilities", pdfBlob, "roles_and_responsibilities.pdf");


//             } catch (decodeError) {
//               console.error("Decoding error:", decodeError);
//               return; // If decoding fails, exit
//             }
//           } else {
//             console.error("No roles and responsibilities document available.");
//             return; // Exit if the document is absent
//           }

//           try {
//             console.log("Sending FormData with rolesAndResponsibilities:", formDataToSend.get('rolesAndResponsibilities'));
//             const response = await axios.post('http://localhost:8080/tap/jobDescription/addJobDescriptionAssignToMrf', formDataToSend, {
//               headers: {
//                 'Content-Type': 'multipart/form-data'
//               }
//             });
//             setMrfJdData(response.data);
//             console.log("Response:", response.data);
//           } catch (error) {
//             console.error('Error saving job description with existing PDF:', error);
//           }
//         };
//         const handleUpdatePdf = async () => {
//           toast.success('JD Updated');
//           const pdfBlob = await convertToPDF(); // Generate a new PDF from the updated editor content
        
//           // Convert the blob to a Base64 string for storing in the state
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             const updatedBase64String = reader.result.split(',')[1]; // Strip the prefix
//             setJobDescription(prev => ({
//               ...prev,
//               rolesAndResponsibilities: `data:application/pdf;base64,${updatedBase64String}`, // Update to the new Base64 string with the correct prefix
//             }));
//             console.log("PDF Updated in the frontend:", updatedBase64String);
//           };
//           // Use readAsDataURL to convert blob to Base64
//           reader.readAsDataURL(pdfBlob); 
//         };
        
//         return (
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium">Job Title: {jobDescription?.jobTitle || formData.probableDesignation}</h3>
//             <h4 className="text-lg font-medium">Roles and Responsibilities:</h4>
//             <div className="mt-2">
//               {loadingJobDescription ? (
//                 <p className="text-gray-500">Loading job description...</p>
//               ) : jobDescription ? (
//                 <div>
//                   {/* <button
//                     onClick={handleSaveForExistingPdf}
//                     className="mt-4 bg-[#27235c] text-white p-2 rounded"
//                   >
//                   Assign JD
//                   </button> */}

//                   {jobDescription.rolesAndResponsibilities ? (
//                     <div>
//                       <button
//                     onClick={handleSaveForExistingPdf}
//                     className="mt-4 bg-[#27235c] text-white p-2 rounded"
//                   >
//                   Assign JD
//                   </button>
//                     <div className="overflow-hidden relative">
//                       <ReactQuill
//                         value={editorContent ||  `
                
//                         <p><strong>Job Type:</strong> "${decodedText.type}"</p>
//                         <p><strong>Job Location:</strong> "${decodedText.location}"</p>
//                         <p><strong>Job Description: </strong></p>
//                         <p>"${decodedText.jobDescription}"</p>
//                         <p><strong>Qualifications:</strong></p>
//                         <p>"${decodedText.qualifications}"</p>
//                         <p><strong>Responsibilities:</strong></p>
//                         <p>"${decodedText.responsibilities}"</p>
//                       `} // Decode Base64 to display in the editor
//                         onChange={(content) => {
//                           setEditorContent(content);
//                           setJobDescription(prev => ({
//                             ...prev,
//                             // Use encodeURIComponent to encode special characters
//                             rolesAndResponsibilities: btoa(unescape(encodeURIComponent(content))), // Use encoding for non-Latin characters
//                           }));
//                         }}
//                         placeholder="Type roles and responsibilities here..."
//                         modules={{
//                           toolbar: [
//                             [{ 'header': [1, 2, 3, false] }],
//                             [{ 'font': [] }],
//                             [{ 'size': ['small', 'normal', 'large', 'huge'] }],
//                             ['bold', 'italic', 'underline', 'strike'],
//                             [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                             [{ 'align': [] }],
//                             [{ 'color': [] }, { 'background': [] }],
//                             ['link', 'image', 'video'],
//                             ['clean'],
//                             ['blockquote', 'code-block'],
//                             ['table'],
//                             ['horizontal-rule'],
//                           ],
//                         }}
//                         formats={[
//                           'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
//                           'list', 'bullet', 'align', 'color', 'background',
//                           'link', 'image', 'video',
//                           'clean', 'blockquote', 'code-block',
//                           'table', 'horizontal-rule'
//                         ]}
//                         className="border border-gray-300 rounded-lg"
//                         style={{ height: '300px', backgroundColor: '#fafafa' }}
//                       />
                      
//                     </div>
//                     <button
//                         onClick={handleUpdatePdf}
//                         className="mt-4  bg-[#27235c] text-white p-2 rounded"
//                       >
//                         Update JD
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 mt-4">
//                       <p className="text-gray-600 mb-2">No roles and responsibilities document available. Please enter the details below:</p>

//                       <ReactQuill
//                         value={editorContent || `
//                   <div style="text-align:center;">
//                     <img src="${logoSrc}" alt="Logo" style="max-width:100px; height:auto;" />
//                   </div>
//                   <p><strong>Job Type:</strong> "${formData.employmentMode}"</p>
//                   <p><strong>Job Location:</strong> "${formData.jobLocation}"</p>
//                   <p><strong>Job Description:</strong></p>
//                   <p>(type here)</p>
//                   <p><strong>Qualifications:</strong></p>
//                   <p>(type here)</p>
//                   <p><strong>Responsibilities:</strong></p>
//                   <p>(type here)</p>
//                 `}
//                         onChange={setEditorContent}
//                         placeholder="Type roles and responsibilities here..."
//                         modules={{
//                           toolbar: [
//                             [{ 'header': [1, 2, 3, false] }],
//                             [{ 'font': [] }],
//                             [{ 'size': ['small', 'normal', 'large', 'huge'] }],
//                             ['bold', 'italic', 'underline', 'strike'],
//                             [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                             [{ 'align': [] }],
//                             [{ 'color': [] }, { 'background': [] }],
//                             ['link', 'image', 'video'],
//                             ['clean'],
//                             ['blockquote', 'code-block'],
//                             ['table'],
//                             ['horizontal-rule'],
//                           ],
//                         }}
//                         formats={[
//                           'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
//                           'list', 'bullet', 'align', 'color', 'background',
//                           'link', 'image', 'video',
//                           'clean', 'blockquote', 'code-block',
//                           'table', 'horizontal-rule'
//                         ]}
//                         className="border border-gray-300 rounded-lg"
//                         style={{ height: '300px', backgroundColor: '#fafafa' }}
//                       />

//                       <button
//                         onClick={handleSave}
//                         className="mt-20 bg-[#27235c] text-white p-2 rounded"
//                       >
//                         Save JD
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-red-500">No job description found.</p>
//               )}
//             </div>
//           </div>
//         );

//       case 5: // Preview Step
//         return <MRFPreview formData={formData} requirementDetails={requirementDetails} subRequirementDetails={subRequirementDetails} onSOWDocumentUpload={handleSOWDocumentUpload}/>;
        

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
//       <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
//         Man Power Requirement Form
//       </h3>

//       <ClientNavbar />

//       <Toaster position="top-center" reverseOrder={false} />

//        {/* Card for Organization and Client Details */}
//       <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20">
//         <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
//         <p className="text-sm font-semibold">Client Representative:  {clientName || 'N/A'}</p>
//         <button
//           onClick={() => setModalOpen(true)}
//           className="mt-2 text-blue-600 hover:underline"
//         >
//           View More
//         </button>
//       </div>
//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 md:w-1/2 lg:w-1/3">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
//             >
//               ×
//             </button>
//             <h2 className="text-xl font-bold mb-4 text-center">Requirement Details</h2>
//             <p><strong>Budget:</strong> ${requirementDetails.budget?.toFixed(2)}</p>
//             <p><strong>Timeline:</strong> {requirementDetails.timeline}</p>
//             <p><strong>Role:</strong> {subRequirementDetails.role}</p>
//             <p><strong>Resource Count:</strong> {subRequirementDetails.resourceCount}</p>
//           </div>
//         </div>
//       )}

//       <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
//         <div className="w-full max-w-4xl mx-auto mb-6">
//           <ol className="relative flex items-center justify-between w-full">
//             {steps.map((label, index) => (
//               <li key={label} className="flex flex-col items-center w-full">
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
//                   {activeStep > index ? (
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
//                     </svg>
//                   ) : (
//                     <span className="text-lg">{index + 1}</span>
//                   )}
//                 </div>
//                 <span className="mt-2 text-sm text-center">{label}</span>
//               </li>
//             ))}
//           </ol>
//         </div>

//         <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
//           {renderStepContent(activeStep)}

//           <div className="flex justify-between mt-4">
//             {activeStep > 0 && (
//               <button
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
//               >
//                 Back
//               </button>
//             )}
//             {activeStep < totalSteps - 1 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               >
//                 Next
//               </button>
//             ) : (
//               // <button
//               //   onClick={handleSubmit}
//               //   className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
//               // >
//               //   Submit
//               // </button>
//               <button
//               onClick={handleSubmit}
//               disabled={!isSOWUploaded}
//               className={`px-4 py-2  bg-[#27235C] text-white rounded ${!isSOWUploaded ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//               Submit
//           </button>
//             )}
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default MRFformCreation;




import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
import { submitMRFForm } from '../../../services/ClientPartner/requirementService';
import { useLocation, useNavigate } from 'react-router-dom';
import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
import Select from 'react-select';
import { Toaster, toast } from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import MRFPreview from './MRFPreview';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import the editor package
import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import { jsPDF } from "jspdf";
import * as pdfjsLib from 'pdfjs-dist/webpack';

const steps = [
  'Basic Information',
  'Job Details',
  // New Step
  'Financials',
  'Skill Parameters',
  'Job Description',
  'Preview & Submit',
];

const MRFformCreation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { state } = location;
  const { clientName = '', orgName = '', requirementDetails = {}, subRequirementDetails = {} } = state || {};

  

  const employeeId = sessionStorage.getItem('employeeId');
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [rolesAndResponsibilitiesUrl, setRolesAndResponsibilitiesUrl] = useState('');
  const [rolesAndResponsibilitiesModalOpen, setRolesAndResponsibilitiesModalOpen] = useState(false);
  const [sidebarOpen, SetSidebarOpen] = useState(false);

  const [MrfJdData, setMrfJdData] = useState(null);

  console.log("requirementDetails");
  console.log(requirementDetails);

  const [modalOpen, setModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState(''); // Initialize the editor content state
  const [formData, setFormData] = useState({
    mrfDepartmentName: '',
    requiredTechnology: '',
    probableDesignation: subRequirementDetails.role || '',
    requiredResourceCount: subRequirementDetails.resourceCount || '',
    requiredSkills: [],
    employmentMode: '',
    educationalQualification: '',
    yearsOfExperience: '',
    minCTC: '',
    maxCTC: '',
    jobLocation: '',
    contractStartDate: '',
    closureDate: '',
    sla: null,
    billingCycle: '',
    proposedBudget: '',
    negotiatedPricePoint: '',
    approvalStatus: 'Pending',
    mrfStage: 'Pending',
    mrfType: '',
    jobParamenterList: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedTechnologies, setSuggestedTechnologies] = useState([]);
  const [jobDescription, setJobDescription] = useState(null);
  const [loadingJobDescription, setLoadingJobDescription] = useState(false);
  const [logoSrc, setLogoSrc] = useState('');
  const [decodedText, setDecodedText] = useState('');

  const [selectedSkills, setSelectedSkills] = useState([]);

  const [isSOWUploaded, setIsSOWUploaded] = useState(false); // Track if the SOW document is uploaded

  const handleSOWDocumentUpload = (uploaded) => {
      setIsSOWUploaded(uploaded);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  
  const skillOptions = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'C#', label: 'C#' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Django', label: 'Django' },
  ];

  const technologyOptions = [
    { value: 'Full Stack Development', label: 'Full Stack Development' },
    { value: 'AI', label: 'AI' },
    { value: 'ML', label: 'ML' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'SDET', label: 'SDET' },
  ];

  const allSkills = [
    'Logical',
    'Reasoning',
    'Presentation',
    'Communication',
    'Teamwork',
    'Problem-Solving',
    'Time Management',
    'Adaptability',
    'Critical Thinking',
    'Interpersonal Skills',
    'Creativity',
    'Leadership',
    'Conflict Resolution',
    'Decision Making',
    'Negotiation',
    'Emotional Intelligence',
    'Networking',
    'Persuasion',
    'Stress Management',
    'Project Management',
    'Strategic Planning',
  ];

  // Function to view the roles and responsibilities blob document
  const handleViewBlobDocument = () => {
    const base64 = jobDescription ? jobDescription.rolesAndResponsibilities : null;
    if (base64) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteNumbers], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setRolesAndResponsibilitiesUrl(url); // Set the PDF URL
      setRolesAndResponsibilitiesModalOpen(true);   // Open the modal to view the PDF
    } else {
      console.error('No roles and responsibilities document available.');
    }
  };


  const handleSkillChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({ ...formData, requiredSkills: values });
    setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
  };

  const handleSkillChangeForJobParameters = (skillList) => {
    if (!Array.isArray(skillList)) {
      console.error("Expected an array of skills but got:", skillList);
      return;
    }
    setFormData({ ...formData, jobParamenterList: skillList });
    setErrors((prev) => ({ ...prev, jobParamenterList: undefined }));
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleTechnologyInputChange = (value) => {
    setFormData((prev) => ({ ...prev, requiredTechnology: value }));

    if (value) {
      const filtered = technologyOptions.filter(tech =>
        tech.label.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestedTechnologies(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestedTechnologies([]);
      setShowSuggestions(false);
    }
  };
  const handleTechnologySelect = (technology) => {
    handleChange("requiredTechnology", technology);
    setShowSuggestions(false);
  };

  const handleNext = () => {
    const newErrors = validateStep(activeStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.mrfDepartmentName) newErrors.mrfDepartmentName = "Department is required.";
        if (!formData.probableDesignation) newErrors.probableDesignation = "Designation is required.";
        if (!formData.requiredResourceCount) newErrors.requiredResourceCount = "Resource Count is required.";
        if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
        break;
      case 1:
        if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
        if (!formData.yearsOfExperience) newErrors.yearsOfExperience = "Years of Experience is required.";
        if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
        if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
        break;
       // No validations needed for this step
      case 2:
        if (!formData.minCTC || isNaN(formData.minCTC) || Number(formData.minCTC) <= 0) {
          newErrors.minCTC = "Minimum CTC is required and must be a number greater than 0.";
        }
        if (!formData.maxCTC || isNaN(formData.maxCTC) || Number(formData.maxCTC) <= 0) {
          newErrors.maxCTC = "Maximum CTC is required and must be a number greater than 0.";
        } else if (Number(formData.maxCTC) <= Number(formData.minCTC)) {
          newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
        }
        if (!formData.proposedBudget || isNaN(formData.proposedBudget) || Number(formData.proposedBudget) <= 0) {
          newErrors.proposedBudget = "Proposed Budget is required and must be a number greater than 0.";
        }
        if (!formData.negotiatedPricePoint || isNaN(formData.negotiatedPricePoint) || Number(formData.negotiatedPricePoint) <= 0) {
          newErrors.negotiatedPricePoint = "Negotiated Price Point is required and must be a number greater than 0.";
        }
        if (!formData.mrfType) newErrors.mrfType = "MRF Type is required.";
        break;
      case 3:
        if (formData.jobParamenterList.length === 0) newErrors.jobParamenterList = "At least one skill is required.";
        break;
        case 4: // Job Description step
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error("Employee ID not found in session storage.");
      return;
    }

    if (!isSOWUploaded) {
      toast.error('Please upload the SOW document before submitting!');
      return;
  }

    const finalErrors = validateStep(activeStep);
    if (Object.keys(finalErrors).length > 0) {
      toast.error("Please resolve the errors before submission.");
      return;
    }

    const newMRF = {
      mrfDepartmentName: formData.mrfDepartmentName || null,
      mrfRequiredTechnology: formData.requiredTechnology || null,
      probableDesignation: formData.probableDesignation || null,
      requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
      requiredSkills: formData.requiredSkills.join(','),
      mrfCriteria: {
        employmentMode: formData.employmentMode || null,
        educationalQualification: formData.educationalQualification || null,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
        minimumCTC: parseFloat(formData.minCTC) || 0.0,
        maximumCTC: parseFloat(formData.maxCTC) || 0.0,
        contractStartDate: formData.contractStartDate || null,
        closureDate: formData.closureDate || null,
        jobLocation: formData.jobLocation || null,
      },
      mrfStatus: {
        mrfApprovalStatus: formData.approvalStatus || null,
        mrfStage: formData.mrfStage || null,
        mrfType: formData.mrfType || null,
      },
      mrfAgreement: {
        billingCycle: formData.billingCycle || null,
        proposedBudget: formData.proposedBudget || null,
        negotiatedPricePoint: formData.negotiatedPricePoint || null,
      },
      requirement: {
        requirementId: requirementDetails.requirementId,
      },
      businessUnitHead: {
        employeeId: parseInt(employeeId, 10),
      },
      clientPartner: {
        employeeId: parseInt(employeeId, 10),
      },
      subRequirements: {
        subRequirementId: subRequirementDetails.subRequirementId || ''
      },
      mrfJd: {
        mrfJdId: MrfJdData.mrfJdId,
      }
      // jobParamenterList: formData.jobParamenterList.join(',')
    };

    const requestData = new FormData();
    requestData.append('mrf', JSON.stringify(newMRF));
    if (formData.sla) {
      requestData.append('sla', formData.sla);
    }

    console.log(requestData);
    try {
      const response = await submitMRFForm(requestData);
      toast.success("MRF submitted successfully!", {
        icon: <FaCheckCircle className="text-green-500" />
      });
      navigate('/viewMrf');
      dispatch(setMRFData(newMRF));
      resetForm();
    } catch (error) {
      console.error('Error submitting MRF:', error.response?.data || error);
      toast.error(`Error: ${error.response ? error.response.data.message : error.message}`, {
        icon: <FaTimesCircle className="text-red-500" />
      });
    }
  };

  const resetForm = () => {
    setFormData({
      mrfDepartmentName: '',
      requiredTechnology: '',
      probableDesignation: '',
      requiredResourceCount: '',
      requiredSkills: [],
      employmentMode: '',
      educationalQualification: '',
      yearsOfExperience: '',
      minCTC: '',
      maxCTC: '',
      jobLocation: '',
      contractStartDate: '',
      closureDate: '',
      sla: null,
      billingCycle: '',
      proposedBudget: '',
      negotiatedPricePoint: '',
      approvalStatus: 'Pending',
      mrfStage: 'Pending',
      mrfType: '',
      jobParamenterList: [],
    });
    setActiveStep(0);
    setShowSuggestions(false);
    setSuggestedTechnologies([]);
  };

  // Fetch job description from backend
  const fetchJobDescription = async (jobTitle) => {
    try {
      setLoadingJobDescription(true);
      const response = await axios.get(`http://localhost:8080/tap/jobDescription/getJobDescriptionByJobTitle/${jobTitle}`);
      setJobDescription(response.data);
    } catch (error) {
      console.error('Error fetching job description:', error);
      toast.error('Failed to fetch job description.');
    } finally {
      setLoadingJobDescription(false);
    }
  };

  const decodeBase64ToText = async (base64String) => {
    console.log("VANTHUTAN DA")
    try {
      // const decodedString = atob(base64String);
      // console.log("Vanakam Bro"+decodedString);
      // return decodedString;
    const pdfBlob = await fetchPDFBlob(jobDescription.rolesAndResponsibilities);
    const pdfText = await extractTextFromPDF(pdfBlob);
    const parsedData = populateFieldsFromText(pdfText);

    return parsedData;


    } catch (error) {
      console.error("Error decoding Base64:", error);
      return ""; // Return an empty string if decoding fails
    }
  };
  const fetchPDFBlob = async (base64String) => {
    console.log("FetchedBlob");
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  };
  const extractTextFromPDF = async (pdfBlob) => {
    console.log("extractTextFromPDF");
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise;
 
        let textContent = '';
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const content = await page.getTextContent();
          content.items.forEach((item) => {
            textContent += item.str + ' ';
          });
        }
 
        resolve(textContent);
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(pdfBlob); // Read Blob as ArrayBuffer
    });
  };

  const populateFieldsFromText = (text) => {
    console.log("populateFieldsFromText");
    const fieldPatterns = {
      type: /Type:\s*“(.*?)”/i,
      location: /Location:\s*“(.*?)”/i,
      jobDescription: /Job Description:\s*([\s\S]*?)(?=Qualifications:)/i,
      qualifications: /Qualifications:\s*([\s\S]*?)(?=Responsibilities:)/i,
      responsibilities: /Responsibilities:\s*([\s\S]*)/i,
    };
 
    const parsedData = {};
 
    Object.keys(fieldPatterns).forEach((key) => {
      const match = text.match(fieldPatterns[key]);
      parsedData[key] = match && match[1] ? match[1].trim() : 'Not found';
    });
 
    
    return parsedData;
  };

  // Trigger fetching on job title change
  useEffect(() => {
    if (activeStep === 2) {
      fetchJobDescription(formData.probableDesignation);
    }
    const decodeRolesAndResponsibilities = async () => {
      if (jobDescription && jobDescription.rolesAndResponsibilities) {
        const cleanedBase64String = jobDescription.rolesAndResponsibilities.trim();
        const parsedData = await decodeBase64ToText(cleanedBase64String);
        console.log("inagatha",parsedData);
        if (parsedData) {
          setDecodedText(parsedData); // Set the decoded text to state
        }
      }
    };
  
    decodeRolesAndResponsibilities();
  }, [activeStep, formData.probableDesignation]);

  const skillsRef = useRef(null); // Create a ref to focus the container/input

  useEffect(() => {
    // Check if there are any errors and if skills are selected, if not focus on the container
    if (selectedSkills.length === 0 && !errors.jobParamenterList) {
      skillsRef.current?.focus();
    }
  }, [selectedSkills, errors]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">Department</label>
            <select
              value={formData.mrfDepartmentName}
              onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
              className={`p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>

            <div className="mt-4">
              <label className="block text-lg font-medium text-gray-700 mb-1">Role</label>
              <div className="block p-3 text-lg border rounded-md w-full border-gray-300 bg-gray-100">
                {formData.probableDesignation || 'No Designation Selected'}
              </div>
            </div>

            <div className="mt-4 relative">
              <label className="block text-lg font-medium text-gray-700 mb-1">Required Technology</label>
              <input
                type="text"
                value={formData.requiredTechnology}
                onChange={(e) => handleTechnologyInputChange(e.target.value)}
                placeholder="Type or select technology"
                className={`w-full p-3 text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
              />
              {showSuggestions && suggestedTechnologies.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 mt-1 rounded-md w-full z-10 max-h-40 overflow-auto">
                  {suggestedTechnologies.map((technology) => (
                    <li
                      key={technology.label}
                      onClick={() => handleTechnologySelect(technology.label)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {technology.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Required Resource</label>
              <input
                type="number"
                value={formData.requiredResourceCount}
                onChange={(e) => handleChange("requiredResourceCount", e.target.value)}
                placeholder="Required Resource Count"
                className={`p-3 text-lg border rounded-md w-full ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
                disabled
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Educational Qualification</label>
              <input
                type="text"
                value={formData.educationalQualification}
                onChange={(e) => handleChange("educationalQualification", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.educationalQualification && <p className="text-red-500 text-sm">{errors.educationalQualification}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Job Location</label>
              <input
                type="text"
                value={formData.jobLocation}
                onChange={(e) => handleChange("jobLocation", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.jobLocation && <p className="text-red-500 text-sm">{errors.jobLocation}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Employment Mode</label>
              <select
                value={formData.employmentMode}
                onChange={(e) => handleChange("employmentMode", e.target.value)}
                className={`p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Employment Mode</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
              {errors.employmentMode && <p className="text-red-500 text-sm">{errors.employmentMode}</p>}
            </div>
          </div>
        );



      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Minimum CTC (in LPA)</label>
              <input
                type="number"
                value={formData.minCTC}
                onChange={(e) => handleChange("minCTC", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.minCTC && <p className="text-red-500 text-sm">{errors.minCTC}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Maximum CTC (in LPA)</label>
              <input
                type="number"
                value={formData.maxCTC}
                onChange={(e) => handleChange("maxCTC", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.maxCTC && <p className="text-red-500 text-sm">{errors.maxCTC}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Proposed Budget</label>
              <input
                type="number"
                value={formData.proposedBudget}
                onChange={(e) => handleChange("proposedBudget", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.proposedBudget && <p className="text-red-500 text-sm">{errors.proposedBudget}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Negotiated Price Point</label>
              <input
                type="number"
                value={formData.negotiatedPricePoint}
                onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
                className={`p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.negotiatedPricePoint && <p className="text-red-500 text-sm">{errors.negotiatedPricePoint}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Billing Cycle</label>
              <select
                value={formData.billingCycle}
                onChange={(e) => handleChange("billingCycle", e.target.value)}
                className={`w-full p-3 text-lg border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Billing Cycle</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
              {errors.billingCycle && <p className="text-red-500 text-sm">{errors.billingCycle}</p>}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">MRF Type</label>
              <select
                value={formData.mrfType}
                onChange={(e) => handleChange("mrfType", e.target.value)}
                className={`w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select MRF Type</option>
                <option value="Open">Open</option>
                <option value="Closed">Exclusive</option>
              </select>
              {errors.mrfType && <p className="text-red-500 text-sm">{errors.mrfType}</p>}
            </div>
            {/* <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
              <Select
                isMulti
                options={skillOptions}
                value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
                onChange={handleSkillChange}
                className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
            </div> */}

<div>
  <label className="block text-lg font-medium text-gray-700 mb-1">Required Skills</label>
  <Select
    isMulti
    options={skillOptions}
    value={skillOptions.filter(option => formData.requiredSkills.includes(option.value))}
    onChange={handleSkillChange}
    className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
    menuPlacement="top"  // Set the dropdown menu to appear above the input field
  />
  {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
</div>
           
            {/* <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Upload SOW Document</label>
              <input
                type="file"
                accept=".pdf, .docx"
                onChange={(e) => handleChange("sla", e.target.files[0])}
                className={`w-full p-3 text-lg border rounded-md ${errors.sla ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.sla && <p className="text-red-500 text-sm">{errors.sla}</p>}
            </div> */}
          </div>
        );

      case 3: // Skill Parameters Step
        const selectedSkills = formData.jobParamenterList;

        const handleRemoveSkill = (skill) => {
          const updatedSkills = selectedSkills.filter(existingSkill => existingSkill !== skill);
          handleSkillChangeForJobParameters(updatedSkills);
        };

        const handleSkillInputChange = (e) => {
          setSkillInput(e.target.value);
        };

        const filteredSkills = allSkills.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase()));

        const handleSkillDragOver = (e) => {
          e.preventDefault(); // Necessary to allow for dropping
        };

        const handleDragStart = (e, skill) => {
          e.dataTransfer.setData("text/plain", skill); // Set the skill data to be dragged
        };

        const handleSkillClick = (skill) => {
          const currentSkills = selectedSkills || [];
          if (currentSkills.includes(skill)) {
            const updatedSkills = currentSkills.filter(existingSkill => existingSkill !== skill);
            handleSkillChangeForJobParameters(updatedSkills);
          } else {
            handleSkillChangeForJobParameters([...currentSkills, skill]);
          }
        };

        const handleAddSkill = () => {
          const trimmedSkillInput = skillInput.trim();
          if (trimmedSkillInput &&
            !allSkills.includes(trimmedSkillInput) &&
            !selectedSkills.includes(trimmedSkillInput)) {
            handleSkillChangeForJobParameters([...selectedSkills, trimmedSkillInput]);
            setSkillInput(''); // Clear the input field after adding
          }
        };

        const handleClearAllSkills = () => {
          handleSkillChangeForJobParameters([]); // Clear all selected skills
        };

        const handleSkillDropOnSelected = (e) => {
          e.preventDefault();
          const skill = e.dataTransfer.getData("text/plain");
          if (!selectedSkills.includes(skill)) {
            handleSkillChangeForJobParameters([...selectedSkills, skill]);
          }
        };

        const handleSkillDrop = (e) => {
          e.preventDefault();
        };

        return (
          <div className="space-y-4">
            {/* <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
               <p className={`p-3 text-lg border rounded-md w-full ${errors.jobParamenterList ? 'border-red-500' : 'border-gray-300'}`}></p>
              <div
                className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2"
                onDrop={handleSkillDropOnSelected}
                onDragOver={handleSkillDragOver}>
                <div className="flex-grow space-x-2 flex flex-wrap">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map(skill => (
                      <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
                        <span>{skill}</span>
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
                          ✖
                        </button>
                      </div>
                    ))
                  ) : 'No skills selected'}
                </div>
                <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
                  Clear All
                </button>
              </div>
            </div> */}

<div>
      <label className="block text-lg font-medium text-gray-700 mb-1">Selected Skills:</label>
      
      {/* The container where selected skills are displayed, along with error message if no skills are selected */}
      <div
        className={`flex items-center border rounded-md p-2 bg-gray-100 mb-2 ${errors.jobParamenterList ? 'border-red-500' : 'border-gray-300'}`}
        onDrop={handleSkillDropOnSelected}
        onDragOver={handleSkillDragOver}
        ref={skillsRef} // Apply ref here to focus this div when needed
        tabIndex={0} // Add tabIndex to make div focusable
      >
        <div className="flex-grow space-x-2 flex flex-wrap">
          {selectedSkills.length > 0 ? (
            selectedSkills.map(skill => (
              <div key={skill} className="flex items-center bg-gray-300 rounded-md px-2 py-1 mr-2 mb-2">
                <span>{skill}</span>
                <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-red-600 text-sm">
                  ✖
                </button>
              </div>
            ))
          ) : (
            <span className="text-red-500 text-sm">No skills selected</span> // Error message displayed inside the container
          )}
        </div>
        <button onClick={handleClearAllSkills} className="text-red-600 hover:underline">
          Clear All
        </button>
      </div>
      
      {/* Optional: You can display the error message here as well if you want to use a more detailed error outside */}
      {/* <p className="text-red-500 text-sm">{errors.jobParamenterList}</p> */}
    </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">Add Skill:</label>
              <div className="flex items-center border border-gray-300 rounded-md p-2 bg-gray-100 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  placeholder="Type a skill"
                  className="flex-grow p-2 border-0 focus:outline-none bg-gray-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill(); // Add skill on Enter key press
                    }
                  }}
                />
                <button onClick={handleAddSkill} className="text-blue-600 hover:underline">
                  Add
                </button>
              </div>
            </div>

            {/* Available Skills Droppable area */}
            <div className="mt-4 border border-gray-300 rounded-md p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}
              onDrop={handleSkillDrop} onDragOver={handleSkillDragOver}>
              <h4 className="font-semibold">Available Skills:</h4>
              <ul className="grid grid-cols-2 gap-2 mt-2">
                {filteredSkills.map(skill => (
                  <li
                    key={skill}
                    draggable
                    onDragStart={(e) => handleDragStart(e, skill)}
                    onClick={() => handleSkillClick(skill)}
                    className={`cursor-pointer border border-gray-300 rounded-md p-2 text-center ${selectedSkills.includes(skill) ? 'bg-gray-300' : 'hover:bg-gray-100'}`}
                  >
                    {skill}
                  </li>
                ))}
                {filteredSkills.length === 0 && skillInput && (
                  <li className="text-gray-500 text-sm text-center">No skills found</li>
                )}
              </ul>
            </div>
          </div>
        );

      case 4: // Job Description Step
        // console.log(atob(jobDescription.rolesAndResponsibilities));
        // console.log(decodedText);

        const handleLogoChange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setLogoSrc(reader.result); // Update logo src
              // Update the editor content to include the new logo
              setEditorContent(`
          <div style="text-align:center;">
            <img src="${reader.result}" alt="Logo" style="max-width:100px; height:auto;" />
          </div>
          <p><strong>Job Type:</strong> "${formData.employmentMode}"</p>
          <p><strong>Job Location:</strong> "${formData.jobLocation}"</p>
          <p><strong>Job Description:</strong></p>
          <p>(type here)</p>
          <p><strong>Qualifications:</strong></p>
          <p>(type here)</p>
          <p><strong>Responsibilities:</strong></p>
          <p>(type here)</p>
        `);
            };
            reader.readAsDataURL(file); // Convert the file to a data URL
          }
        };

        const handleSave = async () => {
          // Check if jobParameterList is defined and is an array
          const jobParameterString = formData.jobParamenterList.join(',');

          const pdfBlob = await convertToPDF(); // Get the PDF Blob

          // Create a FormData object to send the file along with other data
          const formDataToSend = new FormData();
          formDataToSend.append("jobTitle", formData.probableDesignation);
          formDataToSend.append("jobParameter", jobParameterString); // Add jobParameter as string
          formDataToSend.append("rolesAndResponsibilities", pdfBlob, "roles_and_responsibilities.pdf"); // Append the Blob

          try {
            console.log(formDataToSend.get('jobParameter'));
            const response = await axios.post('http://localhost:8080/tap/jobDescription/addJobDescriptionAssignToMrf', formDataToSend, {
              headers: {
                'Content-Type': 'multipart/form-data' // Set the header to send FormData
              }
            });
            console.log("ithutha");
            setMrfJdData(response.data);
            console.log(response.data); // Handle the response as needed

            const responseForAddNewJd = await axios.post('http://localhost:8080/tap/jobDescription/addJobDescription', formDataToSend, {
              headers: {
                'Content-Type': 'multipart/form-data' // Set the header to send FormData
              }
            });
            console.log(responseForAddNewJd.data);

            toast.success('Save Changes Successfully');
          } catch (error) {
            console.error('Error saving job description:', error);
          }
        };
        const convertToPDF = () => {
          return new Promise((resolve) => {
            const doc = new jsPDF();
            doc.html(editorContent, {
              callback: function (doc) {
                // Create a Blob from the PDF document
                const pdfOutput = doc.output('blob'); // Get PDF as Blob
                resolve(pdfOutput); // Resolve the promise with the Blob
              },
              x: 10,
              y: 10,
              width: 190,
              windowWidth: 650
            });
          });
        };
        const handleSaveForExistingPdf = async () => {
        // handleUpdatePdf();
        toast.success('Job Description Assigned To MRF Successfully');
        const pdfBlob = await convertToPDF(); // Get the PDF Blob

          const jobParameterString = formData.jobParamenterList.join(',');
          const formDataToSend = new FormData();

          formDataToSend.append("jobTitle", formData.probableDesignation);
          formDataToSend.append("jobParameter", jobParameterString); // Add jobParameter as string
          formDataToSend.append("rolesAndResponsibilities", pdfBlob, "roles_and_responsibilities.pdf"); // Append the Blob

          if (jobDescription && jobDescription.rolesAndResponsibilities) {
            const rawBase64String = jobDescription.rolesAndResponsibilities.trim();
            console.log("Raw rolesAndResponsibilities:", rawBase64String);

            // Check if the Base64 string has the necessary prefix and strip it if so
            let base64String = rawBase64String;
            if (base64String.startsWith('data:application/pdf;base64,')) {
              base64String = base64String.split(',')[1];
            }

            // Validate Base64 string format
            const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/; // Basic rule to check valid Base64

            if (!base64Regex.test(base64String) || base64String.length % 4 !== 0) {
              console.error("Invalid Base64 string for roles and responsibilities:", base64String);
              return; // Exit if the Base64 string is incorrect
            }

            try {
              const byteCharacters = atob(base64String);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

              // Append the PDF Blob to the FormData
              formDataToSend.append("rolesAndResponsibilities", pdfBlob, "roles_and_responsibilities.pdf");


            } catch (decodeError) {
              console.error("Decoding error:", decodeError);
              return; // If decoding fails, exit
            }
          } else {
            console.error("No roles and responsibilities document available.");
            return; // Exit if the document is absent
          }

          try {
            console.log("Sending FormData with rolesAndResponsibilities:", formDataToSend.get('rolesAndResponsibilities'));
            const response = await axios.post('http://localhost:8080/tap/jobDescription/addJobDescriptionAssignToMrf', formDataToSend, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            setMrfJdData(response.data);
            console.log("Response:", response.data);
          } catch (error) {
            console.error('Error saving job description with existing PDF:', error);
          }
        };
        const handleUpdatePdf = async () => {
          toast.success('JD Updated');
          const pdfBlob = await convertToPDF(); // Generate a new PDF from the updated editor content
        
          // Convert the blob to a Base64 string for storing in the state
          const reader = new FileReader();
          reader.onloadend = () => {
            const updatedBase64String = reader.result.split(',')[1]; // Strip the prefix
            setJobDescription(prev => ({
              ...prev,
              rolesAndResponsibilities: `data:application/pdf;base64,${updatedBase64String}`, // Update to the new Base64 string with the correct prefix
            }));
            console.log("PDF Updated in the frontend:", updatedBase64String);
          };
          // Use readAsDataURL to convert blob to Base64
          reader.readAsDataURL(pdfBlob); 
        };
        
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Job Title: {jobDescription?.jobTitle || formData.probableDesignation}</h3>
            <h4 className="text-lg font-medium">Roles and Responsibilities:</h4>
            <div className="mt-2">
              {loadingJobDescription ? (
                <p className="text-gray-500">Loading job description...</p>
              ) : jobDescription ? (
                <div>
                  {/* <button
                    onClick={handleSaveForExistingPdf}
                    className="mt-4 bg-[#27235c] text-white p-2 rounded"
                  >
                  Assign JD
                  </button> */}

                  {jobDescription.rolesAndResponsibilities ? (
                    <div>
                      <button
                    onClick={handleSaveForExistingPdf}
                    className="mt-4 bg-[#27235c] text-white p-2 rounded"
                  >
                  Assign JD
                  </button>
                    <div className="overflow-hidden relative">
                      <ReactQuill
                        value={editorContent ||  `
                
                        <p><strong>Job Type:</strong> "${decodedText.type}"</p>
                        <p><strong>Job Location:</strong> "${decodedText.location}"</p>
                        <p><strong>Job Description: </strong></p>
                        <p>"${decodedText.jobDescription}"</p>
                        <p><strong>Qualifications:</strong></p>
                        <p>"${decodedText.qualifications}"</p>
                        <p><strong>Responsibilities:</strong></p>
                        <p>"${decodedText.responsibilities}"</p>
                      `} // Decode Base64 to display in the editor
                        onChange={(content) => {
                          setEditorContent(content);
                          setJobDescription(prev => ({
                            ...prev,
                            // Use encodeURIComponent to encode special characters
                            rolesAndResponsibilities: btoa(unescape(encodeURIComponent(content))), // Use encoding for non-Latin characters
                          }));
                        }}
                        placeholder="Type roles and responsibilities here..."
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            [{ 'font': [] }],
                            [{ 'size': ['small', 'normal', 'large', 'huge'] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'align': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image', 'video'],
                            ['clean'],
                            ['blockquote', 'code-block'],
                            ['table'],
                            ['horizontal-rule'],
                          ],
                        }}
                        formats={[
                          'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet', 'align', 'color', 'background',
                          'link', 'image', 'video',
                          'clean', 'blockquote', 'code-block',
                          'table', 'horizontal-rule'
                        ]}
                        className="border border-gray-300 rounded-lg"
                        style={{ height: '300px', backgroundColor: '#fafafa' }}
                      />
                      
                    </div>
                    <button
                        onClick={handleUpdatePdf}
                        className="mt-4  bg-[#27235c] text-white p-2 rounded"
                      >
                        Update JD
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 mt-4">
                      <p className="text-gray-600 mb-2">No roles and responsibilities document available. Please enter the details below:</p>

                      <ReactQuill
                        value={editorContent || `
                  <div style="text-align:center;">
                    <img src="${logoSrc}" alt="Logo" style="max-width:100px; height:auto;" />
                  </div>
                  <p><strong>Job Type:</strong> "${formData.employmentMode}"</p>
                  <p><strong>Job Location:</strong> "${formData.jobLocation}"</p>
                  <p><strong>Job Description:</strong></p>
                  <p>(type here)</p>
                  <p><strong>Qualifications:</strong></p>
                  <p>(type here)</p>
                  <p><strong>Responsibilities:</strong></p>
                  <p>(type here)</p>
                `}
                        onChange={setEditorContent}
                        placeholder="Type roles and responsibilities here..."
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            [{ 'font': [] }],
                            [{ 'size': ['small', 'normal', 'large', 'huge'] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'align': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image', 'video'],
                            ['clean'],
                            ['blockquote', 'code-block'],
                            ['table'],
                            ['horizontal-rule'],
                          ],
                        }}
                        formats={[
                          'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
                          'list', 'bullet', 'align', 'color', 'background',
                          'link', 'image', 'video',
                          'clean', 'blockquote', 'code-block',
                          'table', 'horizontal-rule'
                        ]}
                        className="border border-gray-300 rounded-lg"
                        style={{ height: '300px', backgroundColor: '#fafafa' }}
                      />

                      <button
                        onClick={handleSave}
                        className="mt-20 bg-[#27235c] text-white p-2 rounded"
                      >
                        Save JD
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-500">No job description found.</p>
              )}
            </div>
          </div>
        );

      case 5: // Preview Step
        return <MRFPreview formData={formData} requirementDetails={requirementDetails} subRequirementDetails={subRequirementDetails} onSOWDocumentUpload={handleSOWDocumentUpload}/>;
        

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
      <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
        Man Power Requirement Form
      </h3>

      <ClientNavbar sidebarOpen={sidebarOpen} setSidebarOpen={SetSidebarOpen}/>

      <Toaster position="top-center" reverseOrder={false} />

       {/* Card for Organization and Client Details */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md mt-20 ml-20">
        <h2 className="text-lg font-semibold">Organization: {orgName || 'N/A'}</h2>
        <p className="text-sm font-semibold">Client Representative:  {clientName || 'N/A'}</p>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-2 text-blue-600 hover:underline"
        >
          View More
        </button>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 md:w-1/2 lg:w-1/3">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-red-600"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Requirement Details</h2>
            <p><strong>Budget:</strong> ${requirementDetails.budget?.toFixed(2)}</p>
            <p><strong>Timeline:</strong> {requirementDetails.timeline}</p>
            <p><strong>Role:</strong> {subRequirementDetails.role}</p>
            <p><strong>Resource Count:</strong> {subRequirementDetails.resourceCount}</p>
          </div>
        </div>
      )}

      <div className="flex-grow p-6 pt-20 md:pt-28 ml-40">
        <div className="w-full max-w-4xl mx-auto mb-6">
          <ol className="relative flex items-center justify-between w-full">
            {steps.map((label, index) => (
              <li key={label} className="flex flex-col items-center w-full">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  {activeStep > index ? (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                    </svg>
                  ) : (
                    <span className="text-lg">{index + 1}</span>
                  )}
                </div>
                <span className="mt-2 text-sm text-center">{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="w-full max-w-4xl p-6 border border-gray-300 rounded-md bg-white shadow-xl mx-auto">
          {renderStepContent(activeStep)}

          <div className="flex justify-between mt-4">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
              >
                Back
              </button>
            )}
            {activeStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
              >
                Next
              </button>
            ) : (
              // <button
              //   onClick={handleSubmit}
              //   className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
              // >
              //   Submit
              // </button>
              <button
              onClick={handleSubmit}
              disabled={!isSOWUploaded}
              className={`px-4 py-2  bg-[#27235C] text-white rounded ${!isSOWUploaded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
              Submit
          </button>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default MRFformCreation;




