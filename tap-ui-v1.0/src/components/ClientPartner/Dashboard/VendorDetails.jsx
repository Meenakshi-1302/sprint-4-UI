import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// VendorDetails Component
function VendorDetails({ vendor, closeModal }) {
  if (!vendor) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button 
          className="absolute top-2 right-2"
          onClick={() => {
            console.log("Close button clicked!"); // Log for debugging
            closeModal();
          }}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} style={{ color: 'red', cursor: 'pointer', fontSize: '1.5rem' }} />
        </button>
        
        <h2 className="text-lg font-semibold mb-4 text-center">Vendor Details</h2>

        <div className="mb-4 flex justify-between">
          <span className="font-semibold">Organization Name:</span>
          <span>{vendor.organizationName}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Vendor Username:</span>
          <span>{vendor.vendorUsername}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Contact Name:</span>
          <span>{vendor.contactName}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Contact Number:</span>
          <span>{vendor.contactNumber}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Address:</span>
          <span>{vendor.address}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{vendor.email}</span>
        </div>
      </div>
    </div>
  );
}

export default VendorDetails;