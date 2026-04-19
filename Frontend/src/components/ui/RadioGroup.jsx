import React from 'react';

const RadioGroup = ({ options, name, selectedValue, onChange }) => {
  return (
    <div className="flex gap-4 w-full">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <label 
            key={option.value}
            className={`flex-1 relative cursor-pointer group`}
          >
            <input 
              type="radio" 
              name={name} 
              value={option.value} 
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3
              ${isSelected 
                ? 'border-white bg-[#111] shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                : 'border-[#222] bg-[#0a0a0a] hover:border-[#444] hover:bg-[#111]'
              }
            `}>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300
                ${isSelected ? 'border-white' : 'border-[#444] group-hover:border-[#666]'}
              `}>
                <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`} />
              </div>
              <span className={`text-sm font-medium transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                {option.label}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
