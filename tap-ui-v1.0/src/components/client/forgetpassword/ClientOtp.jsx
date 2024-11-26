import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../../../services/Client/OtpService';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
 
const ClientOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  let intervalId;
 
  const email = useSelector((state) => state.email.email);
 
  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    const newOtp = [...otp];
 
    if (value.length <= 1) {
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5 && value) {
        document.getElementById(`otp-${index + 1}`).focus(); // Focus next input if value entered
      }
    }
 
    if (e.key === 'Backspace' && !value) {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus(); // Focus previous input if backspace pressed
      }
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };
 
  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      handleSubmit();
    }
  }, [otp]);
 
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
 
    const otpCode = otp.join('');
 
    if (otpCode.length < 6) {
      toast.error('Please enter the full OTP.');
      return;
    }
 
    setIsLoading(true);
    try {
      const otpwithoutCommas = otp.join('').replace(/,/g, "");
      const response = await verifyOtp(email, otpwithoutCommas);
      if (response === "OTP verified") {
        toast.success('OTP verified successfully!');
        setOtp(['', '', '', '', '', '']);
        navigate('/confirmpassword');
      } else {
        toast.error('Invalid OTP. Please try again.');
        setIsResendEnabled(true);
      }
    } catch (error) {
      toast.error('Error verifying OTP. Please try again.');
      console.error('Error verifying OTP:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleResend = async () => {
    setIsLoading(true);
    await sendOtp();
    toast.success('OTP has been resent to your email.');
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setIsResendEnabled(false);
    startTimer();
    setIsLoading(false);
  };
 
  const startTimer = () => {
    clearInterval(intervalId);
    setTimer(30);
    intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
 
  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalId);
  }, []);
 
  const handleBackButtonClick = () => {
    setShowModal(true);
  };
 
  const confirmNavigation = () => {
    setShowModal(false);
    navigate('/forgetpassword');
  };
 
  const cancelNavigation = () => {
    setShowModal(false);
  };
 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg px-8 py-6 w-full max-w-md relative">
        <button
          onClick={handleBackButtonClick}
          className="absolute top-2 left-0 text-indigo-900 hover:text-indigo-800 transform hover:scale-105 transition duration-200 mt-4 ml-4 focus:outline-none"
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
 
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Enter OTP</h2>
        <p className="text-center text-gray-600 mb-4">Please enter the OTP sent to your email.</p>
 
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit} // Show the actual digit instead of "*"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleChange(e, index)}
                className={`shadow border rounded w-12 py-2 px-3 text-gray-700 text-center leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${index === 5 ? 'mr-0' : 'mr-2'} ${digit ? 'border-indigo-500' : 'border-gray-300'}`}
                maxLength="1"
                autoComplete="off"
              />
            ))}
          </div>
 
          {timer === 0 && (
            <div className="text-red-600 text-sm text-center mb-2">
              OTP expired. Please request a new one.
            </div>
          )}
 
          <button
            type="submit"
            className={`bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
 
        <div className="flex justify-between mt-4">
          <span className="text-gray-600">{timer > 0 ? `Resend OTP in ${timer}s` : ''}</span>
          <button
            onClick={handleResend}
            className={`bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out ${!isResendEnabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isResendEnabled || isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 inline-block mr-2 transform rotate-90"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m7-7l-7 7 7 7"
              />
            </svg>
            Resend OTP
          </button>
        </div>
      </div>
 
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Navigation</h3>
            <p className="mb-4">Are you sure you want to leave this page?</p>
            <div className="flex gap-x-4 justify-center ">
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
  );
};
 
export default ClientOtp;