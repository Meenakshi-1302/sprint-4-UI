import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAdminLocation } from "../../../redux/actions/Admin/Location/AdminLocationActions"; // Correct import path for actions
import { useNavigate } from "react-router-dom";

const AdminAddLocation = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [organizationName, setOrganizationName] = useState(
    "Relevantz Technology"
  );
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const navigate = useNavigate();

  // Error state for field validation
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state to control error visibility

  // Validate fields before submission
  const validateFields = () => {
    const newErrors = {};
    if (!locationAddress.trim() || !/[a-zA-Z]/.test(locationAddress.trim())) {
      newErrors.locationAddress =
        "Location Address must include at least one letter";
    }
    if (!locationName) newErrors.locationName = "Location Name is required";
    if (!locationAddress)
      newErrors.locationAddress = "Location Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Mark as submitted to show validation errors

    // Validate fields before submission
    if (!validateFields()) return;

    const newLocation = {
      organizationName: "Relevantz Technology",
      locationName,
      locationAddress,
    };

    // Dispatch action to create the location
    dispatch(createAdminLocation(newLocation));
    navigate("/admindash");
    onClose();
  };

  // Function to restrict input for Location Name to only alphabets and spaces
  const handleTextInput = (e, setter) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s]*$/; // Only letters and spaces
    if (regex.test(value) || value === "") {
      setter(value);
    }
  };

  // Function to restrict input for Location Address to specific symbols and chars
  const handleAddressInput = (e) => {
    const value = e.target.value;
    // Allow letters, numbers, spaces, &, /, ', -, and comma (,)
    const regex = /^[A-Za-z0-9\s&,/'-]*$/;
    if (regex.test(value) || value === "") {
      setLocationAddress(value);
    }
  };

  // Handle focus event to remove the error when focusing on the field
  const handleFocus = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName]; // Remove the error for the field
        return newErrors;
      });
    }
  };

  // Only render the modal if isOpen is true
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative transform transition-all duration-500"
        style={{
          transform: isOpen ? "scale(1)" : "scale(0.8)", // Minimized to full size on open
          opacity: isOpen ? 1 : 0, // Fade in/out effect
        }}
      >
        <h2 className="text-2xl font-semibold text-[#27235E] text-center mb-4">
          Add New Location
        </h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl font-bold text-red-600 hover:text-red-800 transition-all"
        >
          &times;
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Name Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[#27235E]">
              Organization Name
            </label>
            <input
              type="text"
              value={organizationName}
              readOnly
              placeholder="Enter organization name"
              className="border p-3 rounded-lg focus:outline-none h-12 mt-2 text-sm transition-colors duration-300 bg-gray-100"
            />
          </div>

          {/* Location Name Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[#27235E]">
              Location Name
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => handleTextInput(e, setLocationName)}
              onFocus={() => handleFocus("locationName")}
              placeholder="Enter location name"
              className={`border p-3 rounded-lg focus:outline-none h-12 mt-2 text-sm transition-colors duration-300 ${
                errors.locationName && isSubmitted
                  ? "border-red-600"
                  : "border-[#ddd]"
              } focus:ring-2 focus:ring-[#27235E]`}
            />
            {errors.locationName && isSubmitted && (
              <span className="text-red-600 text-xs mt-1">
                {errors.locationName}
              </span>
            )}
          </div>

          {/* Location Address Input */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[#27235E]">
              Location Address
            </label>
            <input
              type="text"
              value={locationAddress}
              onChange={handleAddressInput} // Use handleAddressInput here
              onFocus={() => handleFocus("locationAddress")}
              placeholder="Enter location address"
              className={`border p-3 rounded-lg focus:outline-none h-12 mt-2 text-sm transition-colors duration-300 ${
                errors.locationAddress && isSubmitted
                  ? "border-red-600"
                  : "border-[#ddd]"
              } focus:ring-2 focus:ring-[#27235E]`}
            />
            {errors.locationAddress && isSubmitted && (
              <span className="text-red-600 text-xs mt-1">
                {errors.locationAddress}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-[#27235E] w-full p-2 text-white rounded-lg  hover:bg-[#1C1A4E] text-sm transition duration-200"
              // style={{
              //   background:
              //     "linear-gradient(to right, rgb(151, 36, 126), rgb(224, 25, 80))",
              // }}
            >
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddLocation;
