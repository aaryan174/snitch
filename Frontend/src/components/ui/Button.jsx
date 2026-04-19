import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "w-full rounded-xl font-semibold transition-all duration-300 flex items-center justify-center outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 hover:scale-[1.02] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] py-3.5 text-base active:scale-[0.98]",
    social: "bg-transparent border border-[#333] text-white hover:bg-[#111] hover:border-[#555] py-3 text-sm flex gap-3 hover:-translate-y-0.5",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
