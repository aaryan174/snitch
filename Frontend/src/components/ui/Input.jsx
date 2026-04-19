import React, { useState } from 'react';

const Input = ({ label, icon: Icon, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-300 tracking-wide">
          {label}
        </label>
      )}
      <div 
        className={`relative flex items-center bg-[#111111] border rounded-xl overflow-hidden transition-all duration-300 ${
          isFocused ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'border-[#222222] hover:border-[#444444]'
        }`}
      >
        {Icon && (
          <div className="pl-4 pr-2 text-gray-500">
            <Icon />
          </div>
        )}
        <input
          type={inputType}
          className={`w-full bg-transparent py-3 text-white placeholder-gray-500 outline-none text-sm transition-all focus:ring-0 ${
            !Icon ? 'pl-4' : 'pl-1'
          } ${isPassword ? 'pr-12' : 'pr-4'}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 p-1 text-gray-500 hover:text-white transition-colors duration-200 outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
