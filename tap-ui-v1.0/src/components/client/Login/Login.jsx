import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INITIAL_VALUES } from "../../constants/LoginConstant";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { ValidateLogin } from "../../services/Login/LoginService";
import backgroundImage from '../../assets/AdminLoginBackground.webp'; // Ensure this path is correct
import relevantzLogo from '../../assets/relevantzwhite.PNG'; // Import the new logo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons
import Loader from "./Loader"; // Import the loader component


const Login = () => {
  const [email, setEmail] = useState(INITIAL_VALUES.EMAIL);
  const [password, setPassword] = useState(INITIAL_VALUES.PASSWORD);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [isLoading, setIsLoading] = useState(false); // State for showing loader
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.login.error);
  const successMessage = useSelector((state) => state.login.successMessage);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAdminAttempt = email.toLowerCase().includes('auth');
    try {
      // Only set loading if it's an admin login attempt
      if (isAdminAttempt) {
        setIsLoading(true);
      }
      const response = await ValidateLogin(email, password);
      console.log(response);
      const id = response.id;

      if (response.status === "Success") {

        sessionStorage.setItem("UserId", id);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("role", response.role);
        sessionStorage.setItem("employeeId", response.employeeId);

        if (response.role === "Admin") {
          navigate("/Otp");
        } else if (response.role === "Recruiting Manager") {
          navigate('/RecruitingManagerdashboard');
        } else if (response.role === "Client Partner") {
          navigate("/clientPartnerDashboard");
        } else if (response.role === "Recruiter") {
          navigate("/recruiterMainLayout");
        } else {
          navigate("/employeeDashboard");
        }
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again.");
      console.error("Login error:", error);
    } finally {
      if (isAdminAttempt) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {isLoading && <Loader />}

      <div className="flex max-w-2xl w-full bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
        <div className="w-1/3 bg-gradient-to-r from-[#E01950] to-[#97247E] flex flex-col items-center justify-center relative">
          {/* Card LOGO */}
        </div>
        <div className="w-2/3 p-8">
          <div className="flex justify-center mb-4 pb-4"> {/* Center the logo */}
            <img src={relevantzLogo} alt="Relevantz Logo" className="h-12" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative flex items-center">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="absolute right-3 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r mb-2 from-[#97247E] to-[#E01950] text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:shadow-lg"
              >
                Login
              </button>
            </div>
            <div className="flex flex-col items-center">
              <a href="/ForgetPassword" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;