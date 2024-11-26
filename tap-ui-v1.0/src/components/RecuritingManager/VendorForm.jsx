import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vendorImage from '../../assets/logo.jfif'; // Ensure this path is correct
import RecruitingManagerNavbar from './RecruitingManagerNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postNewVendor } from '../../services/RecruitingManager/VendorService';

//Author: PRINCE AROCKIA SAMUEL S

const VendorForm = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [taxId, setTaxId] = useState(''); // State for Tax Identification Number
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [emailError, setEmailError] = useState(''); // State for email error message
  const [taxIdError, setTaxIdError] = useState(''); // State for TIN error message
  const navigate = useNavigate();

  // Using the same email validation regex used in VendorModal.js
  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]{2,}\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateTaxId = (taxId) => {
    // Regex for validating TIN format (sample formt ex: 00xXyYy0000)
    const tinRegex = /^\d{2}[a-zA-Z]{4}\d{5}$/;
    return tinRegex.test(taxId);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true); // Open confirmation modal
  };

  const handleConfirm = async () => {
    const vendorDetails = {
      organizationName: orgName,
      email,
      taxIdentifyNumber: taxId, // Include TIN in the vendor details
    };

    setLoading(true); // Set loading to true
    try {
      const response = await postNewVendor(vendorDetails);

      if (response.status === 200) {
        // Clear the form
        setEmail('');
        setOrgName('');
        setTaxId(''); // Clear TIN field
        toast.success('Vendor has been added successfully.');
        setTimeout(() => {
          navigate('/ListVendors'); // Navigate to vendor list after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      // Check for specific error status
      if (error.response && error.response.status === 500) {
        toast.error('Email or Org Name in use. Please try a different one.');
      } else {
        toast.error('Failed to add vendor: ' + (error.response.data.message || error.message));
      }
    } finally {
      setLoading(false); // Set loading to false
      setIsModalOpen(false); // Close modal after processing
    }
  };

  const checkEmail = () => {
    // Check email validity
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError(''); // Reset error message if valid
    }
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

      // Toggle function for sidebar
      const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
      };

  const checkTaxId = (taxId) => {
    // Check TIN validity
    if (!validateTaxId(taxId)) {
      setTaxIdError('Please enter a valid Tax Identification Number.');
      return;
    } else {
      setTaxIdError(''); // Reset error message if valid
    }
  }

  return (
    <>
      <RecruitingManagerNavbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> <br />
      <div className="flex items-center justify-center min-h-screen bg-[#EEEEEE] relative">
        <div className="flex max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-1/3 bg-indigo-900 flex items-center justify-center">
            <img
              src={vendorImage}
              alt="Vendor"
              className="object-contain h-32 w-32"
            />
          </div>
          <div className="w-2/3 p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Vendor</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    checkEmail()
                  }}
                  className={`border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200`}
                  required
                />
                {/* Display error message directly under the email input */}
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Identification Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={taxId}
                  maxLength={11}
                  onChange={(e) => {
                    setTaxId(e.target.value);
                    checkTaxId(e.target.value); // Validate TIN on change
                  }}
                  className={`border ${taxIdError ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200`}
                  required
                />
                {/* Display error message directly under the TIN input */}
                {taxIdError && <p className="text-red-500 text-sm">{taxIdError}</p>}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate(-1)} // Go back to previous page
                  className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-400 hover:shadow-lg transition duration-200 mr-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-indigo-900 text-white py-2 rounded-lg shadow-md hover:bg-indigo-800 hover:shadow-lg transition duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-md font-bold">Confirm Submission</h2>
              <p>Are you sure you want to add this vendor?</p>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition duration-200"
                  disabled={loading} // Disable button while loading
                >
                  Cancel
                </button>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full border-t-2 border-b-2 border-indigo-600 h-8 w-8 mr-2"></div>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirm}
                    className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-500 transition duration-200"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default VendorForm;