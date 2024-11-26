import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios

const ClientModal = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({
    clientName: '',
    clientPosition: '',
    clientEmail: '',
    clientMobile: '',
    profileImage: '',
  }); // Initialize with default values
  const { clientId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isOpen && clientId) {
        console.log('Fetching user data for clientId:', clientId);
        try {
          const response = await axios.get(`http://localhost:3002/clients?clientId=${clientId}`);
          console.log('Fetched User Data:', response.data);
          if (response.data.length > 0) {
            setEditableUser(response.data[0]); // Set user data if found
          } else {
            console.error('No user data found for this client ID:', clientId);
            Swal.fire({
              icon: 'warning',
              title: 'User Not Found',
              text: 'No user found for this client ID.',
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Swal.fire({
            icon: 'error',
            title: 'Fetch Failed',
            text: 'There was an error fetching your profile. Please try again.',
          });
        }
      }
    };

    fetchUserData();
  }, [isOpen, clientId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({ ...prev, [name]: value }));
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(email);
  };

  const isMobileValid = (mobile) => {
    return /^\d{10}$/.test(mobile); // Check if mobile is exactly 10 digits
  };

  const handleSave = async () => {
    if (!clientId) {
      console.error("Client ID is undefined! Can't update client.");
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to update user: Client ID is missing.',
      });
      return;
    }

    // Validation checks
    if (!isEmailValid(editableUser.clientEmail)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    if (!isMobileValid(editableUser.clientMobile)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Mobile',
        text: 'Mobile number must be exactly 10 digits.',
      });
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3002/clients/${clientId}`, editableUser);
      console.log('User updated successfully:', response.data);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully!',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating your profile. Please try again.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg relative w-1/3">
        <div
          className="h-32 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://via.placeholder.com/600x200)',
          }}
        />
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <img
            src={editableUser.profileImage || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white"
          />
        </div>
        <div className="mt-16 p-4">
          <h2 className="text-xl font-semibold">{editableUser.clientName}</h2>
          <p className="mt-1 text-gray-600">{editableUser.clientPosition}</p>
          <div className="mt-2">
            <label className="block">
              Email:
              {isEditing ? (
                <input
                  type="email"
                  name="clientEmail"
                  value={editableUser.clientEmail || ''} // Ensure it's defined
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-1 mt-1 w-full"
                />
              ) : (
                <span className="block">{editableUser.clientEmail}</span>
              )}
            </label>
          </div>
          <div className="mt-2">
            <label className="block">
              Phone:
              {isEditing ? (
                <input
                  type="tel"
                  name="clientMobile"
                  value={editableUser.clientMobile || ''} // Ensure it's defined
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-1 mt-1 w-full"
                />
              ) : (
                <span className="block">{editableUser.clientMobile}</span>
              )}
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;