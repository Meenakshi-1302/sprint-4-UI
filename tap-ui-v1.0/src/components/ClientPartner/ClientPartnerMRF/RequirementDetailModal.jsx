// RequirementDetailModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; 

const RequirementDetailModal = ({ requirement, onClose, position }) => {
  const navigate = useNavigate();

  const handleCreateMRF = () => {
    // Navigate and pass requirement data
    navigate('/createMrf', { state: { requirement } });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-5"
        style={{
          top: position.top,
          left: position.left,
          width: '800px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Requirement Details</h2>
        <div className="mt-2">
          <p><strong>Designation:</strong> {requirement.probableDesignation}</p>
          <p><strong>Resource Count:</strong> {requirement.requiredResourceCount}</p>
          <p><strong>Required Skills:</strong> {requirement.requiredSkills}</p>
          <p><strong>Required Experience:</strong> {requirement.requiredExperience}</p>
          <p><strong>Timeline:</strong> {requirement.timeline}</p>
          <p><strong>Job Location:</strong> {requirement.jobLocation}</p>
          <p><strong>Minimun Budget:</strong> {requirement.minimumBudget}</p>
          <p><strong>Maximun Budget:</strong> {requirement.maximumBudget}</p>
          <p><strong>Created By:</strong> {requirement.createdBy}</p>
        
          <p><strong>Client Name:</strong> {requirement.client.clientName}</p>
          <p><strong>Client Position:</strong> {requirement.client.clientPosition}</p>
          <p><strong>Email:</strong> {requirement.client.clientEmail}</p>
          <p><strong>Contact:</strong> {requirement.client.clientMobile}</p>
          <p><strong>Organization:</strong> {requirement.client.clientOrganization.organizationName}</p>
          <p><strong>Industry:</strong> {requirement.client.clientOrganization.organizationIndustry}</p>
          <p><strong>Address:</strong> {requirement.client.clientOrganization.organizationAddress}</p>
          <p><strong>Contact Number:</strong> {requirement.client.clientOrganization.organizationContactNumber}</p>
          {/* <p><strong>Website:</strong> 
            <a 
              href={requirement.client.clientOrganization.organizationWebsite} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              {requirement.client.clientOrganization.organizationWebsite}
            </a>
          </p> */}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          {/* <button 
            className="bg-green-500 text-white py-1 px-2 rounded text-sm flex items-center" 
            onClick={handleCreateMRF}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-1" />
            Create MRF
          </button> */}
          <button className="bg-red-500 text-white py-1 px-2 rounded text-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementDetailModal;
