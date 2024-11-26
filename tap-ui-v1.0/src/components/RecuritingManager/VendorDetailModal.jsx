import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import MRFModal from './MRFModal';

const VendorDetailModal = ({ isOpen, onClose, vendor, handleAssign }) => {
    const [isMRFModalOpen, setIsMRFModalOpen] = useState(false);
    const [mrfSearchTerm, setMrfSearchTerm] = useState('');

    const lockScroll = () => {
        document.body.style.overflow = 'hidden';
    };

    const unlockScroll = () => {
        document.body.style.overflow = 'unset';
    };

    // Only show the modal content if it is open
    if (!isOpen) {
        return null; // This early return prevents rendering the modal content
    }

    // Open the MRF modal and lock scroll
    const openMRFModal = () => {
        setIsMRFModalOpen(true);
        lockScroll();
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-200 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-lg" />
                    </button>

                    <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-300 pb-4 text-center">
                        Vendor Details
                    </h2>

                    <div className="space-y-4">
                        {[
                            { label: 'Organization Name', value: vendor.organizationName },
                            { label: 'Vendor Username', value: vendor.vendorUsername },
                            { label: 'Email', value: vendor.email },
                            { label: 'Address', value: vendor.address },
                            { label: 'Contact Number', value: vendor.contactNumber },
                            { label: 'Website URL', value: vendor.websiteUrl },
                            { label: 'Tax ID Number', value: vendor.taxIdentifyNumber },
                            { label: 'Contact Name', value: vendor.contactName },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-center items-center">
                                <span className="font-medium text-center flex-1">{label}:</span>
                                <span className="text-center flex-1">{value || 'N/A'}</span>
                            </div>
                        ))}
                    </div>

                    <MRFModal
                        isOpen={isMRFModalOpen}
                        onClose={() => {
                            setIsMRFModalOpen(false);
                            unlockScroll();
                        }}
                        vendorid={vendor.vendorId}  // Pass the vendor ID
                        searchTerm={mrfSearchTerm}
                        setSearchTerm={setMrfSearchTerm}
                    />

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={openMRFModal}  // Open MRF modal on button click
                            style={{ backgroundColor: '#27235c' }} // Setting button color
                            className="text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 transition duration-200"
                        >
                            Assign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailModal;