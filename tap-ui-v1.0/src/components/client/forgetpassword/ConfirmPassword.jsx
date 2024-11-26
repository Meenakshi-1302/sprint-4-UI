import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateForgotPassword } from '../../../services/Client/ConfirmPasswordservice';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ConfirmPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const calculateStrength = (password) => {
    let score = 0;
    const passwordMinLength = 8;

    if (password.length >= passwordMinLength) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    setStrength(score);
  };

  const email = useSelector((state) => state.email.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      setError('Please fill out both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Please recheck the passwords you entered.');
      return;
    }

    const passwordMinLength = 8;
    if (newPassword.length < passwordMinLength) {
      setError(`Password must be at least ${passwordMinLength} characters long.`);
      return;
    }

    if (strength < 3) {
      setError('Password must include a mix of uppercase, lowercase, numbers, and special characters.');
      return;
    }

    try {
      updateForgotPassword(email, newPassword);
      setMessage('Your new password has been created!');
      toast.success('Password updated successfully');
      setTimeout(() => {
        navigate('/clientlogin');
      }, 2000);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    }
  };

  const handleBackButtonClick = () => {
    setShowModal(true);
  };

  const confirmNavigation = () => {
    setShowModal(false);
    navigate('/otp');
  };

  const cancelNavigation = () => {
    setShowModal(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl relative"> 
        {/* Back Button */}
        <button
          onClick={handleBackButtonClick}
          className="absolute top-8 left-8 text-[#27235C] hover:text-[#524F7D] transform hover:scale-105 transition duration-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 inline-block align-middle"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5m7-7l-7 7 7 7"
            />
          </svg>
        </button>
        
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#27235C]">Create New Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="newPassword">
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                calculateStrength(e.target.value);
              }}
              placeholder="Enter new password"
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#27235C] focus:border-[#27235C]"
            />
          </div>

          {newPassword && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${strength === 0 ? 'bg-transparent' :
                      strength === 1 ? 'bg-red-500' :
                        strength === 2 ? 'bg-yellow-500' :
                          strength >= 3 ? 'bg-green-500' :
                            'bg-green-500'
                    }`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#27235C] mt-1">
                {strength === 0 ? 'Very Weak' :
                  strength === 1 ? 'Weak' :
                    strength === 2 ? 'Fair' :
                      strength === 3 ? 'Good' :
                        'Strong'}
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[#27235C] text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="shadow-sm border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#27235C] focus:border-[#27235C]"
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
          {message && <p className="text-green-500 text-xs italic mb-2">{message}</p>}

          <button
            type="submit"
            className="bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 w-full"
          >
            Reset Password
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Confirm Navigation</h3>
              <p className="mb-4">Are you sure you want to leave this page?</p>
              <div className="flex gap-x-4 justify-center"> 
                <button
                  onClick={confirmNavigation}
                  className="bg-[#27235C] text-white py-2 px-4 rounded hover:bg-[#524F7D]"
                >
                  Yes
                </button>
                <button
                  onClick={cancelNavigation}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmPassword;
