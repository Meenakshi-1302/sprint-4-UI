import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMRFData } from '../../../redux/actions/ClientPartner/mrf/mrfActions';
import { updateMRFForm } from '../../../services/ClientPartner/requirementService';
import Toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
import Select from 'react-select';
 
const steps = [
  'Basic Information',
  'Job Details',
  'Financials',
  'Preview & Submit',
];
 
const UpdateMRFForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
 
  const { state } = location;
  const { requirementDetails } = state || {};
  const orgName = requirementDetails.requirement.client.clientOrganization.organizationName;
  const clientName = requirementDetails.requirement.client.clientName;
  const mrfId = requirementDetails.mrfId;
 
  const employee = sessionStorage.getItem('employeeId');
 
  const [modalOpen, setModalOpen] = useState(false); // Manage modal state
  const [formData, setFormData] = useState({
    mrfDepartmentName: requirementDetails?.mrfDepartmentName || '',
    requiredTechnology: requirementDetails?.mrfRequiredTechnology || '',
    probableDesignation: requirementDetails?.probableDesignation || '',
    requiredResourceCount: requirementDetails?.requiredResourceCount || '',
    requiredSkills: requirementDetails?.requiredSkills.split(', ') || [], // Split for multi-select
    employmentMode: requirementDetails?.mrfCriteria?.employmentMode || '',
    educationalQualification: requirementDetails?.mrfCriteria?.educationalQualification || '',
    yearsOfExperience: requirementDetails?.mrfCriteria?.yearsOfExperience || '',
    minCTC: requirementDetails?.mrfCriteria?.minimumCTC || '',
    maxCTC: requirementDetails?.mrfCriteria?.maximumCTC || '',
    jobLocation: requirementDetails?.mrfCriteria?.jobLocation || '',
    contractStartDate: requirementDetails?.mrfCriteria?.contractStartDate || '',
    closureDate: requirementDetails?.mrfCriteria?.closureDate || '',
    billingCycle: requirementDetails?.mrfAgreement?.billingCycle || '',
    proposedBudget: requirementDetails?.mrfAgreement?.proposedBudget || '',
    negotiatedPricePoint: requirementDetails?.mrfAgreement?.negotiatedPricePoint || '',
    approvalStatus: requirementDetails?.mrfStatus?.mrfApprovalStatus || 'Pending',
    mrfStage: 'In Progress', // Assumed to be constant for updates
    mrfType: requirementDetails?.mrfStatus?.mrfType || '',
  });
 
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;
  const [errors, setErrors] = useState({});
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
 
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error on input change
  };
 
  const handleSkillChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    handleChange("requiredSkills", values);
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
        if (!formData.requiredTechnology) newErrors.requiredTechnology = "Required Technology is required.";
        break;
      case 1:
        if (!formData.educationalQualification) newErrors.educationalQualification = "Educational Qualification is required.";
        if (!formData.yearsOfExperience || isNaN(formData.yearsOfExperience) || formData.yearsOfExperience <= 0) {
          newErrors.yearsOfExperience = "Years of Experience must be a positive number.";
        }
        if (!formData.employmentMode) newErrors.employmentMode = "Employment Mode is required.";
        if (!formData.jobLocation) newErrors.jobLocation = "Job Location is required.";
        break;
      case 2:
        if (!formData.minCTC) {
            newErrors.minCTC = "Minimum CTC is required.";
        } else if (isNaN(formData.minCTC) || parseFloat(formData.minCTC) <= 0) {
            newErrors.minCTC = "Minimum CTC must be a number greater than 0.";
        }
 
        if (!formData.maxCTC) {
            newErrors.maxCTC = "Maximum CTC is required.";
        } else if (isNaN(formData.maxCTC) || parseFloat(formData.maxCTC) <= 0) {
            newErrors.maxCTC = "Maximum CTC must be a number greater than 0.";
        }
 
        if (parseFloat(formData.maxCTC) <= parseFloat(formData.minCTC)) {
            newErrors.maxCTC = "Maximum CTC must be greater than Minimum CTC.";
        }
 
        if (!formData.proposedBudget) {
            newErrors.proposedBudget = "Proposed Budget is required.";
        } else if (isNaN(formData.proposedBudget) || parseFloat(formData.proposedBudget) <= 0) {
            newErrors.proposedBudget = "Proposed Budget must be a number greater than 0.";
        }
 
        if (!formData.negotiatedPricePoint) {
            newErrors.negotiatedPricePoint = "Negotiated Price Point is required.";
        } else if (isNaN(formData.negotiatedPricePoint) || parseFloat(formData.negotiatedPricePoint) <= 0) {
            newErrors.negotiatedPricePoint = "Negotiated Price Point must be a number greater than 0.";
        }
 
        if (!formData.mrfType) {
            newErrors.mrfType = "MRF Type is required.";
        }
        break;
      default:
        break;
    }
    return newErrors;
  };
 
  const handleSubmit = async () => {
    const finalErrors = validateStep(activeStep);
    if (Object.keys(finalErrors).length > 0) {
      Toast.error('Please resolve the errors before submission.');
      return;
    }
 
    const updatedMRF = {
      mrfDepartmentName: formData.mrfDepartmentName,
      mrfRequiredTechnology: formData.requiredTechnology,
      probableDesignation: formData.probableDesignation,
      requiredResourceCount: parseInt(formData.requiredResourceCount, 10) || 0,
      requiredSkills: formData.requiredSkills.join(', '), // Join for backend compatibility
      mrfCriteria: {
        employmentMode: formData.employmentMode,
        educationalQualification: formData.educationalQualification,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || null,
        minimumCTC: parseFloat(formData.minCTC) || 0.0,
        maximumCTC: parseFloat(formData.maxCTC) || 0.0,
        contractStartDate: formData.contractStartDate,
        closureDate: formData.closureDate,
        jobLocation: formData.jobLocation,
      },
      mrfStatus: {
        mrfApprovalStatus: formData.approvalStatus,
        mrfStage: formData.mrfStage,
        mrfType: formData.mrfType,
      },
      mrfAgreement: {
        billingCycle: formData.billingCycle,
        proposedBudget: formData.proposedBudget,
        negotiatedPricePoint: formData.negotiatedPricePoint,
      },
      requirement: {
        requirementId: requirementDetails.requirement.requirementId,
      },
      jobDescriptionId: 1,
      businessUnitHead: {
        employeeId: employee,
      },
      clientPartner: {
        employeeId: employee,
      },
      subRequirements: {
        subRequirementId: requirementDetails.subRequirements.subRequirementId || ''
      }
    };
 
    const requestData = new FormData();
    requestData.append('mrf', JSON.stringify(updatedMRF));
 
    try {
      await updateMRFForm(mrfId, requestData); // Adjust API call accordingly
      Toast.success('MRF updated successfully!');
      navigate('/viewMrf');
      dispatch(setMRFData(updatedMRF));
    } catch (error) {
      console.error('Error updating MRF:', error.response?.data || error);
      Toast.error(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  };
 
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <label className="block text-lg">Department</label>
            <select
              value={formData.mrfDepartmentName}
              onChange={(e) => handleChange("mrfDepartmentName", e.target.value)}
              className={`block p-3 text-lg border rounded-md w-full ${errors.mrfDepartmentName ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            {errors.mrfDepartmentName && <span className="text-red-500">{errors.mrfDepartmentName}</span>}
 
            <label className="block text-lg">Designation</label>
            <input
              type="text"
              value={formData.probableDesignation}
              readOnly
              className={`block p-3 w-full text-lg border rounded-md bg-gray-200 ${errors.probableDesignation ? 'border-red-500' : 'border-gray-300'}`}
            />
 
            <label className="block text-lg">Required Technology</label>
            <input
              type="text"
              value={formData.requiredTechnology}
              onChange={(e) => handleChange("requiredTechnology", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.requiredTechnology ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.requiredTechnology && <span className="text-red-500">{errors.requiredTechnology}</span>}
 
            <label className="block text-lg">Required Resource Count</label>
            <input
              type="number"
              value={formData.requiredResourceCount}
              readOnly
              className={`block p-3 w-full text-lg border rounded-md bg-gray-200 ${errors.requiredResourceCount ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.requiredResourceCount && <span className="text-red-500">{errors.requiredResourceCount}</span>}
          </div>
        );
 
      case 1: // Job Details
        return (
          <div className="space-y-4">
            <label className="block text-lg">Educational Qualification</label>
            <input
              type="text"
              value={formData.educationalQualification}
              onChange={(e) => handleChange("educationalQualification", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.educationalQualification ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.educationalQualification && <span className="text-red-500">{errors.educationalQualification}</span>}
 
            <label className="block text-lg">Years of Experience</label>
            <input
              type="text"
              value={formData.yearsOfExperience}
              onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.yearsOfExperience && <span className="text-red-500">{errors.yearsOfExperience}</span>}
 
            <label className="block text-lg">Job Location</label>
            <input
              type="text"
              value={formData.jobLocation}
              onChange={(e) => handleChange("jobLocation", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.jobLocation ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.jobLocation && <span className="text-red-500">{errors.jobLocation}</span>}
 
            <label className="block text-lg">Employment Mode</label>
            <select
              value={formData.employmentMode}
              onChange={(e) => handleChange("employmentMode", e.target.value)}
              className={`block p-3 text-lg border rounded-md w-full ${errors.employmentMode ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Employment Mode</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
            </select>
            {errors.employmentMode && <span className="text-red-500">{errors.employmentMode}</span>}
          </div>
        );
 
      case 2: // Financials
        return (
          <div className="space-y-4">
            <label className="block text-lg">Minimum CTC</label>
            <input
              type="text"
              value={formData.minCTC}
              onChange={(e) => handleChange("minCTC", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.minCTC ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.minCTC && <span className="text-red-500">{errors.minCTC}</span>}
 
            <label className="block text-lg">Maximum CTC</label>
            <input
              type="text"
              value={formData.maxCTC}
              onChange={(e) => handleChange("maxCTC", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.maxCTC ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.maxCTC && <span className="text-red-500">{errors.maxCTC}</span>}
 
            <label className="block text-lg">Proposed Budget</label>
            <input
              type="text"
              value={formData.proposedBudget}
              onChange={(e) => handleChange("proposedBudget", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.proposedBudget ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.proposedBudget && <span className="text-red-500">{errors.proposedBudget}</span>}
 
            <label className="block text-lg">Negotiated Price Point</label>
            <input
              type="text"
              value={formData.negotiatedPricePoint}
              onChange={(e) => handleChange("negotiatedPricePoint", e.target.value)}
              className={`block p-3 w-full text-lg border rounded-md ${errors.negotiatedPricePoint ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.negotiatedPricePoint && <span className="text-red-500">{errors.negotiatedPricePoint}</span>}
 
            <label className="block text-lg">Billing Cycle</label>
            <select
              value={formData.billingCycle}
              onChange={(e) => handleChange("billingCycle", e.target.value)}
              className={`block w-full p-3 border rounded-md ${errors.billingCycle ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Billing Cycle</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
            {errors.billingCycle && <span className="text-red-500">{errors.billingCycle}</span>}
 
            <label className="block text-lg">MRF Type</label>
            <select
              value={formData.mrfType}
              onChange={(e) => handleChange("mrfType", e.target.value)}
              className={`block w-full p-3 border rounded-md ${errors.mrfType ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select MRF Type</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            {errors.mrfType && <span className="text-red-500">{errors.mrfType}</span>}
 
            <label className="block text-lg">Required Skills</label>
            <Select
              isMulti
              options={skillOptions}
              value={formData.requiredSkills.map(skill => ({ value: skill, label: skill }))}
              onChange={handleSkillChange}
              className={`basic-multi-select ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
          </div>
        );
 
      case 3: // Preview & Confirm step
        return (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="flex justify-between my-2">
                <span className="font-medium">{key.replace(/([A-Z])/g, " $1")}: </span>
                <span className="text-right">{value || "N/A"}</span>
              </div>
            ))}
          </div>
        );
 
      default:
        return null;
    }
  };
 
  return (
    <div className="flex min-h-screen bg-[#eeeeee] items-center justify-center">
      <h3 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800 z-20">
        Update Man Power Requirement Form
      </h3>
     
      <ClientNavbar />
 
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
            <p><strong>Budget:</strong> ${requirementDetails.requirement.budget?.toFixed(2)}</p>
            <p><strong>Timeline:</strong> {requirementDetails.requirement.timeline}</p>
            <p><strong>Role:</strong> {requirementDetails.subRequirements.role}</p>
            <p><strong>Resource Count:</strong> {requirementDetails.subRequirements.resourceCount}</p>
          </div>
        </div>
      )}
      <div className="flex-grow p-8 ml-40">
        <div className="w-full max-w-4xl mb-6 mx-auto mt-20 ">
          <ol className="relative flex items-center justify-between">
            {steps.map((label, index) => (
              <li key={label} className="flex flex-col items-center" style={{ flex: 1 }}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
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
              <button
                onClick={handleSubmit}
                className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default UpdateMRFForm;
