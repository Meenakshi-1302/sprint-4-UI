import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updatePasswordAPI } from "../../services/Login/UpdatePasswordService";
import toast from 'react-hot-toast';
 
const UpdatePassword = () => {
  const location = useLocation();
  const email = location.state?.email;
 
  const [formData, setFormData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: ''
  });
 
  useEffect(() => {
    if (!email) {
      console.error("No email passed to UpdatePassword");
    }
  }, [email]);
 
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
 
  const [touched, setTouched] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false
  });
 
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();
 
  const validatePassword = (password) => {
    const criteria = {
      minLength: password.length >= 14,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasWhitespace: !/\s/.test(password),
    };
    return criteria;
  };
 
  const validateForm = () => {
    const newErrors = {};
 
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }
 
    if (!formData.password.trim()) {
      newErrors.password = 'New password is required';
    } else {
      const passwordCriteria = validatePassword(formData.password);
      if (!Object.values(passwordCriteria).every(Boolean)) {
        newErrors.password = 'Password does not meet all requirements';
      }
      if (formData.password === formData.oldPassword) {
        newErrors.password = 'New password must be different from current password';
      }
    }
 
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
 
    if (formData.password.toLowerCase().includes(formData.oldPassword.toLowerCase())) {
      newErrors.password = 'New password cannot contain the old password';
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
 
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        if (name === 'password' && newErrors.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        return newErrors;
      });
    }
  };
 
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateForm();
  };
 
  // Add this import at the top
 
const handleSubmit = async (e) => {
    e.preventDefault();
 
    setTouched({
      oldPassword: true,
      password: true,
      confirmPassword: true
    });
 
    if (validateForm()) {
      setStatus('loading');
 
      try {
        // Simulate API call
        const response = await updatePasswordAPI(email, formData.password);
 
        if(response.data.message === "Password updated successfully"){
          sessionStorage.getItem("email");
          sessionStorage.getItem("role");
          sessionStorage.getItem("employeeId");
 
          // Show success toast notification
          toast.success('Password reset successfully!', {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#4CAF50',
              color: '#fff',
            },
          });
 
          if (response.role === "Recruiting Manager") {
            navigate('/RecruitingManagerdashboard');
          } else if (response.role === "Client Partner") {
            navigate("/clientPartnerDashboard");
          } else if (response.role === "Recruiter") {
            navigate("/recruiterMainLayout");
          } else {
            navigate("/employeeDashboard");
          }
        }
 
        setTimeout(() => {
          setFormData({
            oldPassword: '',
            password: '',
            confirmPassword: ''
          });
          setStatus('success');
          setTouched({
            oldPassword: false,
            password: false,
            confirmPassword: false
          });
          setErrors({});
        }, 2000);
      } catch (error) {
        console.error("Error updating password:", error);
        setStatus('error');
        // Show error toast notification
        toast.error('Failed to reset password. Please try again.', {
          duration: 3000,
          position: 'top-center',
        });
      }
    } else {
      setStatus('error');
    }
  };
 
  const passwordCriteria = validatePassword(formData.password);
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Lock className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.old ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter your current password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('oldPassword')}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 ${
                    touched.oldPassword && errors.oldPassword
                      ? 'border-red-500 bg-red-50'
                      : touched.oldPassword
                        ? 'border-green-500'
                        : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, old: !prev.old }))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.oldPassword && errors.oldPassword && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.oldPassword}
                </p>
              )}
            </div>
 
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="password"
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 ${
                    touched.password && errors.password
                      ? 'border-red-500 bg-red-50'
                      : touched.password && !errors.password
                        ? 'border-green-500'
                        : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
 
              <div className="text-sm space-y-2 mt-2 bg-gray-50 p-3 rounded-md">
                {Object.entries({
                  'At least 14 characters': passwordCriteria.minLength,
                  'One uppercase letter': passwordCriteria.hasUpperCase,
                  'One lowercase letter': passwordCriteria.hasLowerCase,
                  'One number': passwordCriteria.hasNumber,
                  'One special character': passwordCriteria.hasSpecial,
                  'No whitespace': passwordCriteria.hasWhitespace,
                }).map(([text, met]) => (
                  <div key={text} className={` flex items-center space-x-2 ${met ? 'text-green-600' : 'text-gray-500'}`}>
                    {met ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-500 bg-red-50'
                      : touched.confirmPassword && !errors.confirmPassword
                        ? 'border-green-500'
                        : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
 
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md animate-shake flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Please check all fields and ensure your new password meets all requirements</span>
              </div>
            )}
 
            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md animate-fadeIn flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your password has been successfully reset!</span>
              </div>
            )}
 
            <button
              type="submit"
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center space-x-2 ${
                status === 'loading' ? 'opacity-75 cursor-not-allowed' :
                status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
              disabled={status === 'success' || status === 'loading'}
            >
              {status === 'loading' ? (
                <span>Processing...</span>
              ) : (
                <span>Reset Password</span>
              )}
              {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
 
 
export default UpdatePassword;