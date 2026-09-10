import { forwardRef } from 'react';
import clsx from 'clsx';

const Select = forwardRef(({ 
  className, 
  error,
  label,
  id,
  required,
  options = [],
  placeholder,
  helperText,
  children,
  ...props 
}, ref) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gov-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={clsx('select', error && 'border-red-500 focus:ring-red-200', className)}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gov-gray-600">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
