import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail } from '../../../redux/actions/Client/StoreEmail/EmailActions';
import { getForgetpassword } from '../../../services/Client/ForgetPasswordService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmailInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true); 

    // Trim the email to avoid leading/trailing spaces
    const trimmedEmail = email.trim();

    // Check if email is empty
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      setIsLoading(false); 
      return;
    }

    // Check if email is valid
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setIsLoading(false); 
      return;
    }

    try {
      const response = await getForgetpassword(trimmedEmail);

      if (response) {
        setMessage('A reset link has been sent to your email address.');
        dispatch(setEmail(trimmedEmail));
        navigate('/clientotp');
      }

    } catch (error) {
      toast.error('This Email is not registered. Please check the email and try again!');
      console.error('Error sending reset link:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleBackButtonClick = () => {
    navigate('/clientlogin'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7FAFC] p-4">
      <div className="bg-white shadow-lg rounded-lg px-16 pt-12 pb-16 mb-4 w-full max-w-xl relative">
        
        <button 
          onClick={handleBackButtonClick}
          className="absolute top-14 left-14 text-[#27235C] hover:text-[#524F7D] transform hover:scale-110 transition duration-200 focus:outline-none text-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5m7-7l-7 7 7 7"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center text-[#27235C]">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">We will email you the OTP to reset your password.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              className={`shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#524F7D] transition duration-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
              aria-describedby="emailHelp"
            />
            {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className={`bg-[#27235C] hover:bg-[#524F7D] text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#524F7D] transition duration-200 ease-in-out w-full ${isLoading ? 'cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div role="status" className="flex justify-center items-center">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center transition-opacity duration-300 ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
