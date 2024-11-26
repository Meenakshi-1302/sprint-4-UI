import React, { useState } from 'react';

const FloatingLabelInput = ({ label, value, onChange, type = "text", error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false);
    }
  };

  return (
    <div className="relative mb-5">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 
          ${error ? 'border-red-500' : 'border-gray-300'} focus:border-[#27235C] focus:ring-[#27235C]`}
        placeholder=" " // Use a space to create a placeholder without visible text
      />
      <label 
        className={`absolute left-3 top-2 transform transition-all duration-200
          ${isFocused || value ? 'transform -translate-y-5 scale-75 text-[#27235C]' : 'top-2.5 scale-100'}
          origin-[0_0] bg-white px-1`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FloatingLabelInput;