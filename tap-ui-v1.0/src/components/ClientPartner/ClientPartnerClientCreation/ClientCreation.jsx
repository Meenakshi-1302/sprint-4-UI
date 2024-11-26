// import React, { useState } from 'react';
 
// import { useDispatch } from 'react-redux';
 
// import { addUser as addUserService } from '../../services/Client/ClientService';
 
// import { addUser } from '../../redux/actions/Client/ClientAction';
 
// import Navbar from '../../components/client/ClientNavbar';
 
// import FloatingLabelInput from '../../components/client/FloatingLabelInput';
 
// import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
 
// import Swal from 'sweetalert2';
 
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
 
 
// const steps = [
 
//   'Organization Details',
 
//   'Organization Address',
 
//   'Client Details',
 
//   'Preview',
 
// ];
 
 
 
// const ClientCreation = () => {
 
//   const dispatch = useDispatch();
 
//   const navigate = useNavigate();
 
//   const [formData, setFormData] = useState({
 
//     organizationName: '',
 
//     organizationEmail: '',
 
//     organizationPhoneNumber: '',
 
//     organizationIndustryType: '',
 
//     organizationLogo: null,
 
//     organizationAddress: '',
 
//     clientName: '',
 
//     email: '',
 
//     mobileNumber: '',
 
//     clientPosition: '',
 
//     clientCreatedDate: new Date().toISOString().split('T')[0],
 
//     clientStatus: 'Pending',
 
//     location: null, // For storing selected location
 
//   });
 
 
 
//   const [activeStep, setActiveStep] = useState(0);
 
//   const totalSteps = steps.length;
 
//   const [errors, setErrors] = useState({});
 
//   const [places, setPlaces] = useState([]);
 
//   const [markers, setMarkers] = useState([]);
 
 
 
//   const handleFileChange = (e) => {
 
//     const file = e.target.files[0];
 
//     if (file) {
 
//       if (file.size > 2 * 1024 * 1024) {
 
//         Swal.fire('Error', 'File size must be less than 2MB', 'error');
 
//         return;
 
//       }
 
//       const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
 
//       if (!validImageTypes.includes(file.type)) {
 
//         Swal.fire('Error', 'Only JPEG, PNG, and GIF files are allowed', 'error');
 
//         return;
 
//       }
 
//       setFormData({ ...formData, organizationLogo: file });
 
//     }
 
//   };
 
 
 
//   const validateStep = (step) => {
 
//     const newErrors = {};
 
//     switch (step) {
 
//       case 0:
 
//         if (!formData.organizationName) newErrors.organizationName = "Organization Name is required";
 
//         if (!/\S+@\S+\.\S+/.test(formData.organizationEmail)) newErrors.organizationEmail = "Invalid Organization Email";
 
//         if (!/^\d{10}$/.test(formData.organizationPhoneNumber)) newErrors.organizationPhoneNumber = "Phone Number must be exactly 10 digits and contain only numbers";
 
//         if (!formData.organizationIndustryType) newErrors.organizationIndustryType = "Industry Type is required";
 
//         if (!formData.organizationLogo) newErrors.organizationLogo = "Organization Logo is required";
 
//         break;
 
//       case 1:
 
//         if (!formData.organizationAddress) newErrors.organizationAddress = "Organization Address is required";
 
//         break;
 
//       case 2:
 
//         if (!formData.clientName) newErrors.clientName = "Client Name is required";
 
//         if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid Email";
 
//         if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Mobile Number must be exactly 10 digits and contain only numbers";
 
//         if (!formData.clientPosition) newErrors.clientPosition = "Client Position is required";
 
//         break;
 
//       default:
 
//         break;
 
//     }
 
//     return newErrors;
 
//   };
 
 
 
//   const handleInputChange = (name, value) => {
 
//     setFormData({ ...formData, [name]: value });
 
//     setErrors({ ...errors, [name]: undefined });
 
//   };
 
 
 
//   const handleNext = () => {
 
//     const newErrors = validateStep(activeStep);
 
//     if (Object.keys(newErrors).length > 0) {
 
//       setErrors(newErrors);
 
//     } else {
 
//       setErrors({});
 
//       setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
 
//     }
 
//   };
 
 
 
//   const handleComplete = async () => {
 
//     const finalErrors = validateStep(activeStep);
 
//     if (Object.keys(finalErrors).length > 0) {
 
//       Swal.fire('Error', 'Please resolve the errors before submission.', 'error');
 
//       return;
 
//     }
 
 
 
//     const newUser = {
 
//       clientName: formData.clientName || null,
 
//       clientPosition: formData.clientPosition || null,
 
//       clientMobile: formData.mobileNumber || null,
 
//       clientEmail: formData.email || null,
 
//       password: "TapClient@123",
 
//       clientStatus: formData.clientStatus || null,
 
//       createdAt: new Date().toISOString(),
 
//       clientOrganization: {
 
//         organizationName: formData.organizationName || null,
 
//         organizationIndustry: formData.organizationIndustryType || null,
 
//         organizationAddress: formData.organizationAddress || null,
 
//         organizationContactNumber: formData.organizationPhoneNumber || null,
 
//         organizationEmail: formData.organizationEmail || null,
 
//       }
 
//     };
 
 
 
//     const requestData = new FormData();
 
//     requestData.append('client', JSON.stringify(newUser));
 
//     requestData.append('organizationLogo', formData.organizationLogo);
 
 
 
//     try {
 
//       await addUserService(requestData);
 
//       dispatch(addUser(newUser));
 
//       Swal.fire('Success', 'Client added successfully!', 'success').then(() => {
//         navigate('/clientDash');
 
//       });
 
 
 
//       // Reset the form
 
//       setFormData({
 
//         organizationName: '',
 
//         organizationEmail: '',
 
//         organizationPhoneNumber: '',
 
//         organizationIndustryType: '',
 
//         organizationLogo: null,
 
//         organizationAddress: '',
 
//         clientName: '',
 
//         email: '',
 
//         mobileNumber: '',
 
//         clientPosition: '',
 
//         clientCreatedDate: new Date().toISOString().split('T')[0],
 
//         clientStatus: 'Pending',
 
//         location: null,
 
//       });
 
//       setActiveStep(0);
 
//       setErrors({});
 
 
 
//     } catch (error) {
 
//       console.error('Error adding user:', error);
 
//       Swal.fire('Error', `Error: ${error.message}`, 'error');
 
//     }
 
//   };
 
 
 
//   // Fetch places based on organization name input
 
//   const fetchPlaces = async (query) => {
 
//     if (!query) {
 
//       setPlaces([]);
 
//       setMarkers([]);
 
//       return;
 
//     }
 
//     try {
 
//       const response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
 
//         params: {
 
//           input: query,
 
//           inputtype: 'textquery',
 
//           fields: 'photos,formatted_address,name,geometry',
 
//           key: 'AIzaSyCWSd_nRJajVFtIWR_SsvT1fNLJ7B7IiBE', // Replace with your actual key
 
//         },
 
//       });
 
//       const results = response.data.candidates;
 
//       setPlaces(results);
 
 
 
//       // Create marker positions for each result
 
//       const newMarkers = results.map(place => ({
 
//         position: {
 
//           lat: place.geometry.location.lat,
 
//           lng: place.geometry.location.lng,
 
//         },
 
//         name: place.name,
 
//         address: place.formatted_address,
 
//       }));
 
//       setMarkers(newMarkers);
 
 
 
//     } catch (error) {
 
//       console.error("Error fetching places:", error);
 
//     }
 
//   };
 
 
 
//   const onPlaceSelected = (place) => {
 
//     // Get the latitude and longitude from the selected place
 
//     const lat = place.geometry.location.lat();
 
//     const lng = place.geometry.location.lng();
 
//     const address = place.formatted_address;
 
 
 
//     // Update the formData state to include the selected organization address
 
//     setFormData(prevData => ({
 
//       ...prevData,
 
//       organizationAddress: address, // Set the address based on the selected place
 
//       location: { lat, lng }
 
//     }));
 
 
 
//     // Clear place suggestions
 
//     setPlaces([]);
 
//   };
 
 
 
//   const onMapClick = async (event) => {
 
//     const lat = event.latLng.lat();
 
//     const lng = event.latLng.lng();
 
 
 
//     const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCWSd_nRJajVFtIWR_SsvT1fNLJ7B7IiBE`);
 
//     const result = response.data.results[0];
 
 
 
//     if (result) {
 
//       setFormData(prevData => ({
 
//         ...prevData,
 
//         organizationAddress: result.formatted_address,
 
//         location: { lat, lng }
 
//       }));
 
//     }
 
//   };
 
 
 
//   const handleMarkerClick = (marker) => {
 
//     setFormData(prevData => ({
 
//       ...prevData,
 
//       organizationAddress: marker.address,
 
//       location: marker.position
 
//     }));
 
//   };
 
 
 
//   const pages = [
 
//     () => (
 
//       <div className="space-y-4">
 
//         <h2 className="text-lg font-semibold leading-6 text-gray-900">Organization Details</h2>
 
//         <FloatingLabelInput
 
//           label="Organization Name"
 
//           value={formData.organizationName}
 
//           onChange={(e) => handleInputChange('organizationName', e.target.value)}
 
//           error={errors.organizationName}
 
//         />
 
//         <FloatingLabelInput
 
//           label="Organization Email"
 
//           type="email"
 
//           value={formData.organizationEmail}
 
//           onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
 
//           error={errors.organizationEmail}
 
//         />
 
//         <FloatingLabelInput
 
//           label="Organization Phone Number"
 
//           value={formData.organizationPhoneNumber}
 
//           onChange={(e) => handleInputChange('organizationPhoneNumber', e.target.value)}
 
//           error={errors.organizationPhoneNumber}
 
//         />
 
//         <FloatingLabelInput
 
//           label="Organization Industry Type"
 
//           value={formData.organizationIndustryType}
 
//           onChange={(e) => handleInputChange('organizationIndustryType', e.target.value)}
 
//           error={errors.organizationIndustryType}
 
//         />
 
//         <label className="block text-sm font-medium text-gray-700">Upload Organization Logo</label>
 
//         <input
 
//           type="file"
 
//           accept="image/*"
 
//           onChange={handleFileChange}
 
//           className={`block w-full p-2 border ${errors.organizationLogo ? 'border-red-500' : 'border-gray-300'} rounded-md`}
 
//         />
 
//         {errors.organizationLogo && <p className="text-red-500 text-xs">{errors.organizationLogo}</p>}
 
//       </div>
 
//     ),
 
//     () => (
 
//       <div className="space-y-4">
 
//         <h2 className="text-lg font-semibold leading-6 text-gray-900">Organization Address</h2>
 
//         <LoadScript googleMapsApiKey="AIzaSyCWSd_nRJajVFtIWR_SsvT1fNLJ7B7IiBE" libraries={["places"]}>
 
//           <Autocomplete
 
//             onPlaceSelected={onPlaceSelected}
 
//             onInput={(e) => fetchPlaces(e.target.value)} // Get places based on input
 
//             types={['establishment']}
 
//           >
 
//             <input
 
//               type="text"
 
//               placeholder="Search for an organization"
 
//               className={`block w-full h-12 px-3 border rounded-md transition ${errors.organizationAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring focus:ring-[#27235C]`}
 
//               value={formData.organizationAddress} // Set to read value
 
//               onChange={(e) => handleInputChange('organizationAddress', e.target.value)} // Allow manual input
 
//             />
 
//           </Autocomplete>
 
//           <GoogleMap
 
//             mapContainerStyle={{ width: '100%', height: '400px' }}
 
//             center={formData.location || { lat: 20.5937, lng: 78.9629 }} // Default coordinates for India
 
//             zoom={5}
 
//             onClick={onMapClick}
 
//           >
 
//             {markers.map((marker, index) => (
 
//               <Marker key={index} position={marker.position} onClick={() => handleMarkerClick(marker)} />
 
//             ))}
 
//           </GoogleMap>
 
//         </LoadScript>
 
//       </div>
 
//     ),
 
//     () => (
 
//       <div className="space-y-4">
 
//         <h2 className="text-lg font-semibold leading-6 text-gray-900">Client Details</h2>
 
//         <FloatingLabelInput
 
//           label="Client Name"
 
//           value={formData.clientName}
 
//           onChange={(e) => handleInputChange('clientName', e.target.value)}
 
//           error={errors.clientName}
 
//         />
 
//         <FloatingLabelInput
 
//           label="Email"
 
//           type="email"
 
//           value={formData.email}
 
//           onChange={(e) => handleInputChange('email', e.target.value)}
 
//           error={errors.email}
 
//         />
 
//         <FloatingLabelInput
 
//           label="Mobile Number"
 
//           value={formData.mobileNumber}
 
//           onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
 
//           error={errors.mobileNumber}
 
//         />
 
//         <FloatingLabelInput
 
//           label="Client Position"
 
//           value={formData.clientPosition}
 
//           onChange={(e) => handleInputChange('clientPosition', e.target.value)}
 
//           error={errors.clientPosition}
 
//         />
 
//       </div>
 
//     ),
 
//     () => (
 
//       <div className="space-y-4">
 
//         <h2 className="text-lg font-semibold leading-6 text-gray-900">Preview</h2>
 
//         <div className="border border-gray-300 rounded-md p-4">
 
//           <h3 className="font-semibold">Organization Details</h3>
 
//           <p><strong>Name:</strong> {formData.organizationName}</p>
 
//           <p><strong>Email:</strong> {formData.organizationEmail}</p>
 
//           <p><strong>Phone Number:</strong> {formData.organizationPhoneNumber}</p>
 
//           <p><strong>Industry Type:</strong> {formData.organizationIndustryType}</p>
 
//           <p><strong>Address:</strong> {formData.organizationAddress}</p>
 
//           {formData.organizationLogo && (
 
//             <div>
 
//               <strong>Logo:</strong>
 
//               <img src={URL.createObjectURL(formData.organizationLogo)} alt="Organization Logo" className="mt-2 w-32 h-32 object-cover" />
 
//             </div>
 
//           )}
 
//         </div>
 
//         <div className="border border-gray-300 rounded-md p-4 mt-4">
 
//           <h3 className="font-semibold">Client Details</h3>
 
//           <p><strong>Name:</strong> {formData.clientName}</p>
 
//           <p><strong>Email:</strong> {formData.email}</p>
 
//           <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
 
//           <p><strong>Position:</strong> {formData.clientPosition}</p>
 
//           <p><strong>Created Date:</strong> {formData.clientCreatedDate}</p>
 
//           <p><strong>Status:</strong> {formData.clientStatus}</p>
 
//         </div>
 
//       </div>
 
//     ),
 
//   ];
 
 
 
//   return (
 
//     <div className="flex flex-col min-h-screen bg-[#eeeeee]">
 
//       <Navbar />
 
//       <div className="flex-grow flex flex-col items-center justify-start mt-28">
 
//         <div className="w-full max-w-2xl mb-6">
 
//           <ol className="relative flex items-center justify-between w-full">
 
//             {steps.map((label, index) => (
 
//               <li key={label} className="flex flex-col items-center w-full">
 
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
 
//                   {activeStep > index ? (
 
//                     <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
 
//                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917L5.724 10.5 15 1.5" />
 
//                     </svg>
 
//                   ) : (
 
//                     <span className="text-lg">{index + 1}</span>
 
//                   )}
 
//                 </div>
 
//                 <span className="mt-2 text-sm text-center">{label}</span>
 
//               </li>
 
//             ))}
 
//           </ol>
 
//         </div>
 
//         <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-md bg-white shadow-xl">
 
//           {pages[activeStep]()}
 
//           <div className="flex justify-between mt-4">
 
//             {activeStep > 0 && (
 
//               <button
 
//                 onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
 
//                 className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
 
//               >
 
//                 Back
 
//               </button>
 
//             )}
 
//             {activeStep < totalSteps - 1 ? (
 
//               <button
 
//                 onClick={handleNext}
 
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
 
//               >
 
//                 Next
 
//               </button>
 
//             ) : (
 
//               <button
 
//                 onClick={handleComplete}
 
//                 className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
 
//               >
 
//                 Submit
 
//               </button>
 
//             )}
 
//           </div>
 
//         </div>
 
//       </div>
 
//     </div>
 
//   );
 
// };
 
 
 
// export default ClientCreation;





import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUser as addUserService } from '../../../services/ClientPartner/ClientService';
import { addUser } from '../../../redux/actions/ClientPartner/Client/ClientAction';
import ClientPartnerNavbar from '../../NavbarComponent/ClientPartnerNavbar';
import FloatingLabelInput from './FloatingLabelInput';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import axios from 'axios';
 
const libraries = ["places"];
const steps = [
  'Organization Details',
  'Organization Address',
  'Client Details',
  'Preview',
];
 
const ClientCreation = () => {
  const dispatch = useDispatch();
 
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationEmail: '',
    organizationPhoneNumber: '',
    organizationIndustryType: '',
    organizationLogo: null,
    organizationAddress: '',
    clientName: '',
    email: '',
    mobileNumber: '',
    clientPosition: '',
    clientCreatedDate: new Date().toISOString().split('T')[0],
    clientStatus: 'Pending',
    location: null, // Keep track of the latitude and longitude
  });
 
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;
  const [errors, setErrors] = useState({});
  const [autocomplete, setAutocomplete] = useState(null); // Store Autocomplete instance
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  useEffect(() => {
    // Load Google Maps Script only once
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCWSd_nRJajVFtIWR_SsvT1fNLJ7B7IiBE&libraries=${libraries.join(",")}`;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
     
      return () => {
        document.body.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);
 
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };
 
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
       
        setFormData(prevData => ({
          ...prevData,
          organizationAddress: place.formatted_address,
          location: { lat, lng }
        }));
       
        console.log("Selected Address:", place.formatted_address); // Debug Log
      }
    }
  };
 
  const handleAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };
 
  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.organizationName) newErrors.organizationName = "Organization Name is required.";
        if (!/\S+@\S+\.\S+/.test(formData.organizationEmail)) newErrors.organizationEmail = "Invalid Organization Email.";
        if (!/^\d{10}$/.test(formData.organizationPhoneNumber)) newErrors.organizationPhoneNumber = "Phone Number must be exactly 10 digits.";
        if (!formData.organizationIndustryType) newErrors.organizationIndustryType = "Industry Type is required.";
        if (!formData.organizationLogo) newErrors.organizationLogo = "Organization Logo is required.";
        break;
      case 1:
        if (!formData.organizationAddress) newErrors.organizationAddress = "Organization Address is required.";
        break;
      case 2:
        if (!formData.clientName) newErrors.clientName = "Client Name is required.";
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid Email.";
        if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = "Mobile Number must be exactly 10 digits.";
        if (!formData.clientPosition) newErrors.clientPosition = "Client Position is required.";
        break;
      default:
        break;
    }
    return newErrors;
  };
 
  const handleNext = () => {
    const newErrors = validateStep(activeStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };
 
  const handleComplete = async () => {
    const finalErrors = validateStep(activeStep);
    if (Object.keys(finalErrors).length > 0) {
      Swal.fire('Error', 'Please resolve the errors before submission.', 'error');
      return;
    }
 
    const newUser = {
      clientName: formData.clientName || null,
      clientPosition: formData.clientPosition || null,
      clientMobile: formData.mobileNumber || null,
      clientEmail: formData.email || null,
      password: "TapClient@123",
      clientStatus: formData.clientStatus || null,
      createdAt: new Date().toISOString(),
      clientOrganization: {
        organizationName: formData.organizationName || null,
        organizationIndustry: formData.organizationIndustryType || null,
        organizationAddress: formData.organizationAddress || null,
        organizationContactNumber: formData.organizationPhoneNumber || null,
        organizationEmail: formData.organizationEmail || null,
      }
    };
 
    const requestData = new FormData();
    requestData.append('client', JSON.stringify(newUser));
    requestData.append('organizationLogo', formData.organizationLogo);
 
    try {
      await addUserService(requestData);
      dispatch(addUser(newUser));
      Swal.fire('Success', 'Client created successfully!', 'success');
     
      // Reset form data
      setFormData({
        organizationName: '',
        organizationEmail: '',
        organizationPhoneNumber: '',
        organizationIndustryType: '',
        organizationLogo: null,
        organizationAddress: '',
        clientName: '',
        email: '',
        mobileNumber: '',
        clientPosition: '',
        clientCreatedDate: new Date().toISOString().split('T')[0],
        clientStatus: 'Pending',
        location: null,
      });
      setActiveStep(0);
      setErrors({});
    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire('Error', `Error: ${error.message}`, 'error');
    }
  };
 
  const pages = [
    () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Organization Details</h2>
        <FloatingLabelInput
          label="Organization Name"
          value={formData.organizationName}
          onChange={(e) => handleInputChange('organizationName', e.target.value)}
          error={errors.organizationName}
        />
        <FloatingLabelInput
          label="Organization Email"
          type="email"
          value={formData.organizationEmail}
          onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
          error={errors.organizationEmail}
        />
        <FloatingLabelInput
          label="Organization Phone Number"
          value={formData.organizationPhoneNumber}
          onChange={(e) => handleInputChange('organizationPhoneNumber', e.target.value)}
          error={errors.organizationPhoneNumber}
        />
        <FloatingLabelInput
          label="Organization Industry Type"
          value={formData.organizationIndustryType}
          onChange={(e) => handleInputChange('organizationIndustryType', e.target.value)}
          error={errors.organizationIndustryType}
        />
        <label className="block text-sm font-medium text-gray-700">Upload Organization Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleInputChange('organizationLogo', e.target.files[0])}
          className={`block w-full p-2 border ${errors.organizationLogo ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.organizationLogo && <p className="text-red-500 text-xs">{errors.organizationLogo}</p>}
      </div>
    ),
    () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Organization Address</h2>
        {scriptLoaded && (
          <div>
            <Autocomplete
              onLoad={handleAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Search for an organization"
                className={`block w-full h-12 px-3 border rounded-md transition ${errors.organizationAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring focus:ring-[#27235C]`}
                value={formData.organizationAddress}
                onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
              />
            </Autocomplete>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={formData.location || { lat: 20.5937, lng: 78.9629 }}
              zoom={10}
            >
              {formData.location && (
                <Marker position={formData.location} />
              )}
            </GoogleMap>
          </div>
        )}
      </div>
    ),
    () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Client Details</h2>
        <FloatingLabelInput
          label="Client Name"
          value={formData.clientName}
          onChange={(e) => handleInputChange('clientName', e.target.value)}
          error={errors.clientName}
        />
        <FloatingLabelInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
        />
        <FloatingLabelInput
          label="Mobile Number"
          value={formData.mobileNumber}
          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
          error={errors.mobileNumber}
        />
        <FloatingLabelInput
          label="Client Position"
          value={formData.clientPosition}
          onChange={(e) => handleInputChange('clientPosition', e.target.value)}
          error={errors.clientPosition}
        />
      </div>
    ),
    () => (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Preview</h2>
        <div className="border border-gray-300 rounded-md p-4">
          <h3 className="font-semibold">Organization Details</h3>
          <p><strong>Name:</strong> {formData.organizationName}</p>
          <p><strong>Email:</strong> {formData.organizationEmail}</p>
          <p><strong>Phone Number:</strong> {formData.organizationPhoneNumber}</p>
          <p><strong>Industry Type:</strong> {formData.organizationIndustryType}</p>
          <p><strong>Address:</strong> {formData.organizationAddress}</p>
          {formData.organizationLogo && (
            <div>
              <strong>Logo:</strong>
              <img src={URL.createObjectURL(formData.organizationLogo)} alt="Organization Logo" className="mt-2 w-32 h-32 object-cover" />
            </div>
          )}
        </div>
        <div className="border border-gray-300 rounded-md p-4 mt-4">
          <h3 className="font-semibold">Client Details</h3>
          <p><strong>Name:</strong> {formData.clientName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Mobile Number:</strong> {formData.mobileNumber}</p>
          <p><strong>Position:</strong> {formData.clientPosition}</p>
          <p><strong>Created Date:</strong> {formData.clientCreatedDate}</p>
          <p><strong>Status:</strong> {formData.clientStatus}</p>
        </div>
      </div>
    ),
  ];
 
  return (
    <div className="flex flex-col min-h-screen bg-[#eeeeee]">
      <ClientPartnerNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`flex-grow flex flex-col items-center justify-start mt-28 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="w-full max-w-2xl mb-6">
          <ol className="relative flex items-center justify-between w-full">
            {steps.map((label, index) => (
              <li key={label} className="flex flex-col items-center w-full">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${activeStep > index ? 'border-[#27235C] bg-[#27235C] text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  {activeStep > index ? (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917L5.724 10.5 15 1.5" />
                    </svg>
                  ) : (
                    <span className="text-lg">{index + 1}</span>
                  )}
                </div>
                <span className="mt-2 text-sm text-center">{label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-md bg-white shadow-xl">
          {pages[activeStep]()}
          <div className="flex justify-between mt-4">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 text-[#27235C] bg-white rounded-md border border-[#27235C] hover:bg-gray-200"
              >
                Back
              </button>
            )}
            {activeStep < totalSteps - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-4 py-2 font-semibold text-white bg-[#27235C] rounded-md hover:bg-[#1E1A4C]"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ClientCreation;