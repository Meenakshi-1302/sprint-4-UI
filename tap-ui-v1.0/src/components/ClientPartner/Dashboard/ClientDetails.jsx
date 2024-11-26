import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// ClientDetails Component
function ClientDetails({ organizationClientDetails, onClose }) {
    if (!organizationClientDetails) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 relative">
                <button 
                    className="absolute top-2 right-2"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <FontAwesomeIcon icon={faTimes} style={{ color: 'red', cursor: 'pointer', fontSize: '1.5rem' }} />
                </button>

                {organizationClientDetails.clientOrganization.organizationLogo && (
                    <div className="flex justify-center mb-4">
                        <img className='rounded-lg' src={`data:image/jpeg;base64,${organizationClientDetails.clientOrganization.organizationLogo}`} alt="Organization Logo" style={{ width: '100px', height: '100px' }} />
                    </div>
                )}

                <h2 className="text-xl font-bold text-center mb-4">{organizationClientDetails.clientOrganization.organizationName}</h2>

                <div>
                    <label className="font-semibold text-left">Industry:</label>
                    <p className="text-right">{organizationClientDetails.clientOrganization.organizationIndustry}</p>

                    <label className="font-semibold text-left">Address:</label>
                    <p className="text-right">{organizationClientDetails.clientOrganization.organizationAddress}</p>

                    <label className="font-semibold text-left">Contact Number:</label>
                    <p className="text-right">{organizationClientDetails.clientOrganization.organizationContactNumber}</p>

                    <label className="font-semibold text-left">Email:</label>
                    <p className="text-right">{organizationClientDetails.clientOrganization.organizationEmail}</p>
                </div>

                {/* Client Details Section */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <h3 className="text-lg font-bold col-span-2">Client Details</h3>
                    <label className="font-semibold text-left">Contact Person:</label>
                    <p className="text-right">{organizationClientDetails.clientName}</p>

                    <label className="font-semibold text-left">Position:</label>
                    <p className="text-right">{organizationClientDetails.clientPosition}</p>

                    <label className="font-semibold text-left">Mobile:</label>
                    <p className="text-right">{organizationClientDetails.clientMobile}</p>

                    <label className="font-semibold text-left">Email:</label>
                    <p className="text-right">{organizationClientDetails.clientEmail}</p>

                    <label className="font-semibold text-left">Status:</label>
                    <p className="text-right">{organizationClientDetails.clientStatus}</p>
                </div>
            </div>
        </div>
    );
}

export default ClientDetails;

