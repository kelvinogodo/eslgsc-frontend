import { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(({ 
  className, 
  error,
  label,
  id,
  required,
  ...props 
}, ref) => {
  const textareaId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium text-gov-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={clsx('textarea', error && 'border-red-500 focus:ring-red-200', className)}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
