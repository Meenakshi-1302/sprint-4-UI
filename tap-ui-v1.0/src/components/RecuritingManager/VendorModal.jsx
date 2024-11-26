import React, { useState, useEffect } from 'react';
import vendorImage from '../../assets/logo.jfif'; // Ensure this path is correct
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import { putUpdateVendor } from '../../services/RecruitingManager/VendorService';

const VendorModal = ({ isOpen, onClose, vendor, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [organisationName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [emailError, setEmailError] = useState(''); // State for email error message

  useEffect(() => {
    if (vendor) {
      setEmail(vendor.email);
      setOrgName(vendor.organizationName); // Updated to use the right property based on your backend
    }
  }, [vendor]);

  const validateEmail = (email) => {
    // Regular expression for validating email
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]{2,}\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    const updatedVendor = {
      ...vendor,
      email,
      organizationName: organisationName, // Updated to match backend expectations
    };

    setLoading(true); // Set loading to true 

    // Create a variable to track the completion of the update operation
    const updateResponse = await putUpdateVendor(vendor.vendorId, updatedVendor);

    // Use a timeout to ensure the loader displays for at least 3 seconds
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      if (!updateResponse.ok) {
        const errorData = await updateResponse;
        console.error('Error updating vendor:', errorData);
        return;
      }
      onUpdate(updatedVendor); // Call the update function passed in props
      // Show success toast notification after update
      toast.success('Updated successfully!');
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      await timeoutPromise; // Wait for the 3-second timeout
      setLoading(false); // Set loading to false
      window.location.reload();
      onClose(); // Close the modal after updating
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="flex max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/3 bg-indigo-900 flex items-center justify-center">
          <img
            src={vendorImage}
            alt="Vendor"
            className="object-contain h-32 w-32"
          />
        </div>
        <div className="w-2/3 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Vendor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('Please enter a valid email address.');
                }}
                className={`border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200`}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>} {/* Display error message */}
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={organisationName}
                onChange={(e) => setOrgName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
              />
            </div>
            <div className="flex justify-center">
              {loading ? (
                <div className="animate-spin rounded-full border-t-2 border-b-2 border-indigo-600 h-8 w-8"></div> // Loader
              ) : (
                <button
                  type="submit"
                  className="w-1/2 bg-indigo-900 text-white py-2 rounded-lg shadow-md hover:bg-indigo-800 hover:shadow-lg transition duration-200 mx-auto"
                >
                  Update
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-400 hover:shadow-lg transition duration-200 mx-auto block mt-4" // Changed to ash color
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorModal;