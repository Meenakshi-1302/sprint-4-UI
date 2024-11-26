import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
 
function ClientDetailsModal({ client, closeModal }) {
  if (!client) return null;
 
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-0 z-50">
      <div className="bg-opacity-0 rounded-lg shadow-lg p-6 max-w-lg w-full relative" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <button
          className="absolute top-2 right-2"
          onClick={closeModal}
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faTimes} style={{ color: 'red', cursor: 'pointer', fontSize: '1.5rem' }} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Client Details</h2>
 
        {/* Client Information */}
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Client Name:</span>
          <span>{client.name}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Position:</span>
          <span>{client.role}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Mobile:</span>
          <span>{client.mobile || 'N/A'}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{client.email || 'N/A'}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Status:</span>
          <span>{client.status}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Created At:</span>
          <span>{new Date(client.createdAt).toLocaleString() || 'N/A'}</span>
        </div>
 
        {/* Optionally add more details here */}
        {/* Example for 'Additional Info' section */}
        {client.additionalInfo && (
          <div className="mb-2 flex justify-between">
            <span className="font-semibold">Additional Info:</span>
            <span>{client.additionalInfo}</span>
          </div>
        )}
      </div>
     </div>
  );
}
 
export default ClientDetailsModal;