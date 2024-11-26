import React, { useState, useRef, useEffect } from 'react';
import { ValidateOtp } from '../../services/Login/OtpService';
import { ResendOtp } from '../../services/Login/ResendOtpService';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../../assets/AdminLoginBackground.webp'; // Ensure this path is correct
import relevantzLogo from '../../assets/relevantzwhite.PNG'; // Import the logo
 
const Otp = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60); // Changed from 30 to 60 seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();
 
  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalId);
  }, []);
 
  let intervalId;
 
  const startTimer = () => {
    clearInterval(intervalId);
    setTimer(60); // Set the timer to 60 seconds
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
 
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
 
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
 
    if (element.value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };
 
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
 
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 4).split('');
    if (pasteData.length === 4 && pasteData.every(x => !isNaN(x))) {
      setOtp(pasteData);
      inputRefs[3].current.focus();
    }
  };
 
  const verifyOTP = async () => {
    const email = sessionStorage.getItem("email");
    const otpValue = otp.join('');
 
    try {
      const response = await ValidateOtp(otpValue, email);
      console.log(response);
      if (response === "OTP Verified") {
        // sessionStorage.clear();
        navigate("/AdminDashboard");
      } else {
        toast.error("Wrong OTP. Please try again.");
       
        // Clear the OTP fields if OTP verification fails
        setOtp(['', '', '', '']);
        inputRefs.forEach(ref => ref.current.value = ''); // Clear each input field
      }
    } catch (error) {
      toast.error("Error verifying OTP. Please try again.");
      console.error("Verification error:", error);
     
      // Clear the OTP fields on error
      setOtp(['', '', '', '']);
      inputRefs.forEach(ref => ref.current.value = ''); // Clear each input field
    }
  };
 
 
  const resendOTP = async () => {
   
    const email = sessionStorage.getItem("email");
   
    try {
      await ResendOtp(email);
      toast.info("OTP has been resent to the email!");
     
      setOtp(['', '', '', '']);
      inputRefs.forEach(ref => ref.current.value = '');
      setIsResendEnabled(false);
      startTimer(); // Restart the timer
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };
 
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex justify-center mb-4">
          <img src={relevantzLogo} alt="Relevantz Logo" className="h-10" /> {/* Centered logo */}
        </div>
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-2xl font-semibold text-gray-800">
              Email Verification
            </h1>
            <p className="text-sm text-gray-500 px-4">
              We have sent a code to your email
            </p>
          </div>
 
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 px-2">
              {otp.map((digit, index) => (
                <div key={index} className="w-full h-12 sm:h-16">
                  <input
                    ref={inputRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-full h-full text-center text-lg sm:text-xl px-2 sm:px-4
                             outline-none rounded-xl border border-gray-200
                             bg-white focus:bg-gray-50 focus:ring-2
                             focus:ring-blue-600 focus:border-transparent
                             transition-all duration-200"
                  />
                </div>
              ))}
            </div>
 
            <div className="space-y-4">
              <button
                onClick={verifyOTP}
                type="button"
                className="w-full py-3 sm:py-4 px-4 text-white text-sm sm:text-base
                         rounded-xl bg-gradient-to-r from-[rgb(151,36,126)]
                         to-[rgb(224,25,80)] hover:opacity-90
                         transition-opacity duration-200
                         focus:ring-2 focus:ring-offset-2
                         focus:ring-pink-500 focus:outline-none"
              >
                Verify Account
              </button>
 
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span className="text-gray-500">Didn't receive code?</span>
                <button onClick={resendOTP}
                  className={`text-blue-600 hover:text-blue-800
                           transition-colors duration-200
                           focus:outline-none focus:underline ${!isResendEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isResendEnabled}
                  style={{ fontSize: '1.1rem', fontWeight: 'bold' }} // Increased size and weight
                >
                  Resend {timer > 0 && `(${timer}s)`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
 
export default Otp;