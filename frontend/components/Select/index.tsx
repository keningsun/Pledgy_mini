import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <select
      className={`select w-full bg-transparent focus:outline-none border-none text-base appearance-none  selection:bg-transparent ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
