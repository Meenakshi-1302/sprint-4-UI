import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBussinessUnitAction } from '../../../redux/actions/Admin/BussinessUnit/AdminBussinessUnitActions';
import { getLocations } from '../../../services/Admin/Location/LocationService';
import Select from 'react-select'; // Import react-select

const AddBussinessUnit = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // Form state
  const [businessUnitName, setBusinessUnitName] = useState('');
  const [businessUnitLocation, setBusinessUnitLocation] = useState('');
  const [description, setDescription] = useState('');

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
        const locationData = await getLocations();
        console.log(locationData); // Debug log to see the structure of the response
        setLocationsState(locationData);
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
    if (!businessUnitName.trim()) newErrors.businessUnitName = 'Business Unit Name is required';
    if (!businessUnitLocation.trim()) newErrors.businessUnitLocation = 'Business Unit Location is required';
    if (!description.trim()) newErrors.description = 'Business Unit Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateFields()) return;

    // Prepare the data to be dispatched
    const newBussinessUnit = {
      businessUnitName: businessUnitName.trim(),
      businessUnitLocation: businessUnitLocation.trim(),
      description: description.trim(),
    };

    // Log form data before dispatching
    console.log("Form data before dispatch:", newBussinessUnit);

    // Dispatch action to add the business unit
    dispatch(addBussinessUnitAction(newBussinessUnit));
    onClose(); // Close the modal after successful submission
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

  // Prepare options for the react-select dropdown
  const locationOptions = locations.map(location => ({
    value: location.locationName, // Use the location name as the value
    label: location.locationName, // Use the location name as the label
  }));

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#27235E]">Add New Business Unit</h3>
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

            {/* Business Unit Location Dropdown using react-select */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-[#27235E]">Business Unit Location</label>
              <Select
                value={locationOptions.find(option => option.value === businessUnitLocation)}
                onChange={(selectedOption) => setBusinessUnitLocation(selectedOption.value)}
                options={locationOptions}
                placeholder="Select a location"
                isLoading={loadingLocations}
                className={`react-select-container ${errors.businessUnitLocation && isSubmitted ? 'border-red-600 w-full mt-2' : ''}`}
              />
              {errors.businessUnitLocation && isSubmitted && (
                <span className="text-red-600 text-xs mt-1">{errors.businessUnitLocation}</span>
              )}
            </div>

            {/* Create Business Unit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-[#27235E] text-white rounded-lg px-6 py-3 shadow-lg hover:bg-[#1C1A4E] w-full"
              >
                Create Business Unit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddBussinessUnit;
