import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ 
  className, 
  error,
  label,
  id,
  required,
  helperText,
  ...props 
}, ref) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gov-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx('input', error && 'border-red-500 focus:ring-red-200', className)}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gov-gray-600">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
