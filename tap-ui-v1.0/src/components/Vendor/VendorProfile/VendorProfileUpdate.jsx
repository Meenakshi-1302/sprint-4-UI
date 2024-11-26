import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import VendorNavbar from '../../NavbarComponent/VendorNavbar';
 
// Confirmation modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm text-center">
          <h2 className="text-lg font-bold text-[#27235C] mb-4">
            Are you sure you want to delete this logo?
          </h2>
          <div className="flex justify-between">
            <button
              onClick={onConfirm}
              className="bg-[#27235C] text-white rounded-lg px-4 py-2 hover:bg-[#1C1A4E] mr-2"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="bg-[#EEEEEE] text-[#27235C] rounded-lg px-4 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};
 
const VendorProfileUpdate = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState(null);
  const [editableFields, setEditableFields] = useState({
    username: '',
    logo: '',
    address: '',
    contactNumber: '',
    websiteUrl: '',
    contactName: '',
  });
  const [hasUploadedLogo, setHasUploadedLogo] = useState(false);
  const [error, setError] = useState({
    username: '',
    logo: '',
    address: '',
    contactNumber: '',
    websiteUrl: '',
    contactName: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // State to hold logo file
  const vendorId = sessionStorage.getItem("vendorId");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/vendors/${vendorId}`);
        const vendor = response.data;
 
        setVendorData(vendor);
        setEditableFields({
          username: vendor.username,
          logo: vendor.vendorOrganizationLogo
            ? `data:image/jpeg;base64,${vendor.vendorOrganizationLogo}`
            : '',
          address: vendor.address,
          contactNumber: vendor.contactNumber,
          websiteUrl: vendor.websiteUrl || '',
          contactName: vendor.contactName || '',
        });
        setHasUploadedLogo(!!vendor.vendorOrganizationLogo);
      } catch (error) {
        setError((prev) => ({ ...prev, username: error.message }));
        toast.error("Failed to fetch vendor data");
      }
    };
    fetchData();
  }, []);
 
  const validate = () => {
    let isValid = true;
    const validationError = {
      username: '',
      logo: '',
      address: '',
      contactNumber: '',
      websiteUrl: '',
      contactName: '',
    };
 
    // const usernameRegex = /^[A-Za-z_]*$/;
    // if (!usernameRegex.test(editableFields.username) || editableFields.username === '') {
    //   validationError.username = 'Username is required and can contain underscores.';
    //   isValid = false;
    // }
 
    const contactNumberRegex = /^\d{10}$/;
    if (!contactNumberRegex.test(editableFields.contactNumber)) {
      validationError.contactNumber = 'Contact number must be exactly 10 digits.';
      isValid = false;
    }
 
    if (!editableFields.address) {
      validationError.address = 'Address is required.';
      isValid = false;
    }
 
    const validSuffixes = ['.com', '.org', '.co', '.net', '.edu'];
    const isValidWebsite = validSuffixes.some(suffix => editableFields.websiteUrl.endsWith(suffix));
    if (!isValidWebsite) {
      validationError.websiteUrl = 'Website URL must end with .com, .org, .co, .net, or .edu';
      isValid = false;
    }
 
    if (!editableFields.contactName) {
      validationError.contactName = 'Contact Name is required.';
      isValid = false;
    }
 
    setError(validationError);
    return isValid;
  };
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
 
    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
 
    setError((prev) => ({
      ...prev,
      [name]: '', // Clear error for the corresponding field
    }));
  };
 
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 80000) {
        setLogoFile(file); // Save the file
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditableFields((prev) => ({
            ...prev,
            logo: reader.result,
          }));
          setHasUploadedLogo(true);
          setError((prev) => ({ ...prev, logo: '' }));
        };
        reader.readAsDataURL(file);
      } else {
        setError((prev) => ({ ...prev, logo: 'Logo must be a JPEG or PNG file under 80KB' }));
      }
    }
  };
 
  const handleRemoveLogo = () => {
    setEditableFields((prev) => ({
      ...prev,
      logo: '',
    }));
    setLogoFile(null); // Clear saved file
    setHasUploadedLogo(false);
  };
 
  // Save logo method
  const handleLogoUpload = async (vendorId) => {
    if (logoFile) {
      const formData = new FormData();
      formData.append('vendorOrganizationLogo', logoFile); // Ensure this key matches the expected key in the backend
 
      try {
        const response = await axios.patch(
          `http://localhost:8080/api/vendors/vendor-logo-update-by-id/${vendorId}/logo`, // URL update for vendor logo
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (response.status === 200) {
          toast.success("Logo updated successfully!");
        } else {
          toast.error("Error updating logo, please try again.");
        }
      } catch (error) {
        console.error('Error uploading logo:', error.response?.data || error.message);
        toast.error("Error uploading logo, please try again.");
      }
    }
  };
 
  const handleSave = async () => {
    if (validate()) {
      try {
        const vendorId = vendorData.vendorId; // Assuming vendorData has a vendorId field
        const dataToUpdate = {
          // vendorUsername: editableFields.username,
          address: editableFields.address,
          contactNumber: editableFields.contactNumber,
          websiteUrl: editableFields.websiteUrl,
          contactName: editableFields.contactName,
        };
 
        // const response = await axios.patch(`http://localhost:8080/api/vendors/updatevendor/${vendorId}`, {
        //   params: {
        //     address: dataToUpdate.address,
        //     contactName: dataToUpdate.contactName,
        //     contactNumber: dataToUpdate.contactNumber,
        //     websiteUrl: dataToUpdate.websiteUrl
        //   }
        // });
 
        const response = await axios.patch(`http://localhost:8080/api/vendors/updatevendor/${vendorId}`, null, {
          params: {
            address: dataToUpdate.address,
            contactName: dataToUpdate.contactName,
            contactNumber: dataToUpdate.contactNumber,
            websiteUrl: dataToUpdate.websiteUrl
          }
        });
 
        if (response.status === 200) {
          await handleLogoUpload(vendorId); // Call logo upload separately
          toast.success("Profile updated successfully!");
          navigate('/vendorDashboard/vendorprofileview');
        } else {
          toast.error("Error updating profile, please try again.");
        }
      } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        toast.error("Error updating profile, please try again.");
      }
    }
  };
 
  const handleCancel = () => {
    if (vendorData) {
      setEditableFields({
        username: vendorData.username || '',
        logo: vendorData.vendorOrganizationLogo
          ? `data:image/jpeg;base64,${vendorData.vendorOrganizationLogo}`
          : '',
        address: vendorData.address || '',
        contactNumber: vendorData.contactNumber || '',
        websiteUrl: vendorData.websiteUrl || '',
        contactName: vendorData.contactName || '',
      });
 
      setHasUploadedLogo(!!vendorData.vendorOrganizationLogo);
      setError({
        username: '',
        logo: '',
        address: '',
        contactNumber: '',
        websiteUrl: '',
        contactName: ''
      });
    }
    navigate('/vendorDashboard');
  };
 
  const handleTrashClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
 
  const handleGoBack = () => {
    navigate(-1);
  };
 
  const handleConfirmRemoveLogo = () => {
    handleRemoveLogo();
    setIsModalOpen(false);
  };
 
  if (!vendorData) return <div>Loading...</div>;
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
      {/* <VendorNavbar /> */}
      <Toaster />
      <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg mt-16 mb-5">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleGoBack}
            className="text-[#27235C] hover:text-[#1C1A4E] transition duration-200"
          >
            <FaArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-[#27235C] text-center flex-grow ml-20">
            Vendor Profile Update
          </h1>
          <p className="text-lg font-semibold text-[#27235C]">
            TAX ID: {vendorData.taxIdentifyNumber}
          </p>
        </div>
 
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-[#27235C] flex justify-center items-center overflow-hidden">
              <img
                src={editableFields.logo || "path/to/default/logo.png"}
                alt="Current logo"
                className="object-cover w-full h-full"
              />
            </div>
            <label className="absolute cursor-pointer bottom-0 right-0 bg-white p-1 rounded-full shadow-lg hover:bg-gray-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                onClick={(e) => e.stopPropagation()}
              />
              {hasUploadedLogo ? (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-[#27235C] text-xl"
                  onClick={handleTrashClick}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCamera}
                  className="text-[#27235C] text-xl"
                />
              )}
            </label>
          </div>
          <p className="text-2xl mt-4 font-bold text-[#27235C]">{vendorData.organizationName}</p>
          <p className="text-xl mt-2 text-gray-600">{vendorData.email}</p>
        </div>
 
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField
              label="Username"
              value={editableFields.username}
              onChange={handleInputChange}
              name="username"
              error={error.username}
              readonly={true}
            />
            <ProfileField
              label="Contact Name"
              value={editableFields.contactName}
              onChange={handleInputChange}
              name="contactName"
              error={error.contactName}
            />
            <ProfileField
              label="Contact Number"
              value={editableFields.contactNumber}
              onChange={handleInputChange}
              name="contactNumber"
              error={error.contactNumber}
            />
            <ProfileField
              label="Address"
              value={editableFields.address}
              onChange={handleInputChange}
              name="address"
              error={error.address}
            />
            <ProfileField
              label="Website URL"
              value={editableFields.websiteUrl}
              onChange={handleInputChange}
              name="websiteUrl"
              error={error.websiteUrl}
            />
          </div>
 
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSave}
              className="bg-[#27235E] text-white rounded-lg px-4 py-2 shadow-lg hover:bg-[#1C1A4E] mr-4"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 shadow-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
 
        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmRemoveLogo}
        />
      </div>
    </div>
  );
};
 
// Profile field component for rendering input fields
const ProfileField = ({ label, value, onChange, name, readonly, error }) => (
  <div>
    <label className="block font-semibold text-[#27235C]">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      name={name}
      readOnly={readonly}
      className={`w-full p-2 mt-1 rounded-lg border ${readonly ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
        } ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
 
export default VendorProfileUpdate;