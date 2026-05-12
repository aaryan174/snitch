import React from 'react';

const Checkbox = ({ id, label, checked, onChange, required = false }) => {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          required={required}
          className="peer sr-only"
        />
        <div className={`w-5 h-5 rounded-[4px] border transition-all duration-200 flex items-center justify-center
          ${checked 
            ? 'bg-white border-white' 
            : 'bg-transparent border-[#444] group-hover:border-[#666]'
          }
        `}>
          <svg 
            className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors select-none leading-tight">
        {label}
      </div>
    </label>
  );
};

export default Checkbox;
