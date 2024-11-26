
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';


const VendorProfileView = () => {
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorId = sessionStorage.getItem("vendorId");
        const response = await axios.get(`http://localhost:8080/api/vendors/${vendorId}`); // Replace 1 with dynamic vendor ID as needed
        setVendorData(response.data);
      } catch (error) {
        setError('Error fetching data. Please try again.');
        toast.error(error.response?.data?.message || 'Error fetching data');
      }
    };
    fetchData();
  }, [navigate]); // Fetch on component mount

  const handleEditProfile = () => {
    navigate('/vendorDashboard/vendorProfileUpdate'); // Navigate to the update page
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!vendorData) return <div>Loading...</div>; // Loading state

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 px-4 py-8">
      <Toaster />

      <div className="max-w-5xl w-full sticky top-0 mt-2 mb-5"> {/* Make this div sticky */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          {/* Header Section with Go Back Button, Title, and Tax ID */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleGoBack}
              className="text-[#27235C] hover:text-[#1C1A4E] transition duration-200 mr-4"
            >
              <FaArrowLeft size={24} />
            </button>
            <h1 className="flex-grow text-3xl font-bold text-[#27235C] text-center ml-20">Vendor Profile</h1>
            <span className="text-lg font-semibold text-[#27235C] ml-4">Tax ID: {vendorData.taxIdentifyNumber}</span>
          </div>

          {/* Logo and Organization Details */}
          <div className="flex flex-col justify-center items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-[#27235C] flex justify-center items-center overflow-hidden">
                {vendorData.vendorOrganizationLogo ? (
                  <img
                    src={`data:image/jpeg;base64,${vendorData.vendorOrganizationLogo}`}
                    alt="Organization Logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img src="path/to/default/logo.png" alt="Default Logo" className="object-cover w-full h-full" />
                )}
              </div>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-[#27235C]">{vendorData.organizationName}</h2>
              <h3 className="text-xl text-gray-400">{vendorData.username}</h3>
            </div>
          </div>

          {/* Display Vendor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProfileField label="Contact Number" value={vendorData.contactNumber} />
            <ProfileField label="Email" value={vendorData.email} />
            <ProfileField label="Address" value={vendorData.address} />
            <ProfileField label="Website URL" value={vendorData.websiteUrl} />
            <ProfileField label="Contact Name" value={vendorData.contactName} />
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleEditProfile}
              className="bg-[#27235C] text-white rounded-lg px-4 py-2 hover:bg-[#1C1A4E] transition duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProfileField component that displays label and value
const ProfileField = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="block font-semibold text-[#27235C]">{label}:</span>
    <span className="block text-[#27235C]">{value || 'N/A'}</span>
  </div>
);

export default VendorProfileView;