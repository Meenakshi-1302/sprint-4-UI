import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBussinessUnitAction } from '../../../redux/actions/Admin/BussinessUnit/AdminBussinessUnitActions'; // Action to update business unit
import { getLocations } from '../../../services/Admin/Location/LocationService'; // Import the getLocations function
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';

const EditBussinessUnit = ({ isOpen, onClose, businessUnit }) => {
  const dispatch = useDispatch();

  // Form state
  const [businessUnitName, setBusinessUnitName] = useState('');
  const [businessUnitLocation, setBusinessUnitLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Error state
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State to store locations
  const [locations, setLocationsState] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Fetch locations when modal is open
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await getLocations(); // Get the data from the API
        setLocationsState(locationData); // Directly set the fetched location data into state
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    if (isOpen) {
      fetchLocations(); // Fetch locations only when modal is open
    }
  }, [isOpen]);

  // Set form fields if editing a business unit
  useEffect(() => {
    if (isOpen && businessUnit) {
      setBusinessUnitName(businessUnit.businessUnitName);
      setBusinessUnitLocation(businessUnit.businessUnitLocation);
      setDescription(businessUnit.description || '');
    }
  }, [isOpen, businessUnit]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setBusinessUnitName('');
      setBusinessUnitLocation('');
      setDescription('');
      setErrors({});
      setIsSubmitted(false);
    }
  }, [isOpen]);

  // Validate fields before submission
  const validateFields = () => {
    const newErrors = {};
    if (!businessUnitName.trim() || !/[a-zA-Z]/.test(businessUnitName.trim())) {
      newErrors.businessUnitName = 'Business Unit Name must include at least one letter';
    }
    if (!businessUnitLocation.trim()) {
      newErrors.businessUnitLocation = 'Business Unit Location is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Business Unit Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission for updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  
    if (!validateFields()) return;

    setIsLoading(true);
    setErrorMessage(''); 
  
    const updatedBusinessUnit = {
      businessUnitName: businessUnitName.trim(),
      businessUnitLocation: businessUnitLocation.trim(),
      description: description.trim(),
    };
  
    // Use businessunitId (correct name) for the ID
    const businessUnitId = businessUnit.businessunitId; // access the correct field
  
    // Dispatch the update action
    try{
      await dispatch(updateBussinessUnitAction(businessUnitId, updatedBusinessUnit));
      setIsLoading(false);
      Swal.fire({
        title: 'Success!',
        text: 'Business Unit updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        onClose();
        navigate("/admindash");  
      });
    } catch (error) {
      setIsLoading(false); // Stop loading state
      setErrorMessage('Failed to update Business Unit. Please try again later.');
    }
  };

  // Handle input change for Business Unit Name (allow letters and numbers only)
  const handleBusinessUnitNameChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9\s]*$/; // Allow letters and numbers
    if (regex.test(value) || value === '') {
      setBusinessUnitName(value);
    }
  };

  // Handle input change for Business Unit Description (allow letters, spaces, &, /, -, and comma)
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z\s&,/-]*$/; // Allow letters, spaces, &, /, -, and comma
    if (regex.test(value) || value === '') {
      setDescription(value);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#27235E]">Edit Business Unit</h3>
            <button
              onClick={() => {
                onClose();
                setBusinessUnitName('');
                setBusinessUnitLocation('');
                setDescription('');
                setErrors({});
                setIsSubmitted(false);
              }}
              className="text-3xl font-bold text-red-600 hover:text-red-800 transition-all p-2"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            {/* Business Unit Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-[#27235E]">Business Unit Name</label>
              <input
                type="text"
                value={businessUnitName}
                onChange={handleBusinessUnitNameChange} // Use new handler
                placeholder="Enter Business Unit name"
                className={`border p-2 rounded-lg shadow-sm focus:outline-none h-10 ${errors.businessUnitName && isSubmitted ? 'border-red-600' : ''}`}
              />
              {errors.businessUnitName && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.businessUnitName}</span>
              )}
            </div>

            {/* Business Unit Description */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-[#27235E]">Business Unit Description</label>
              <input
                type="text"
                value={description}
                onChange={handleDescriptionChange} // Use new handler
                placeholder="Enter Business Unit description"
                className={`border p-2 rounded-lg shadow-sm focus:outline-none h-10 ${errors.description && isSubmitted ? 'border-red-600' : ''}`}
              />
              {errors.description && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.description}</span>
              )}
            </div>

            {/* Business Unit Location Dropdown */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-[#27235E]">Business Unit Location</label>
              <select
                value={businessUnitLocation}
                onChange={(e) => setBusinessUnitLocation(e.target.value)}
                className={`border p-2 rounded-lg shadow-sm focus:outline-none h-10 ${errors.businessUnitLocation && isSubmitted ? 'border-red-600' : ''}`}
              >
                <option value="">Select a location</option>
                {loadingLocations ? (
                  <option>Loading...</option>
                ) : (
                  locations.map((location) => (
                    <option key={location.id} value={location.locationName}>
                      {location.locationName}
                    </option>
                  ))
                )}
              </select>
              {errors.businessUnitLocation && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.businessUnitLocation}</span>
              )}
            </div>

            {/* Update Business Unit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#27235E] text-white rounded-lg px-6 py-3 shadow-lg hover:bg-[#1C1A4E] w-full"
              >
                {isLoading ? 'Updating...' : 'Update Business Unit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditBussinessUnit;