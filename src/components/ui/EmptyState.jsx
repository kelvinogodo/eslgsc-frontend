import React from 'react';

const EmptyState = ({ title = 'No items', description = '', action }) => {
  return (
    <div className="rounded-lg border border-gov-gray-200 p-8 text-center">
      <h3 className="text-lg font-semibold text-gov-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gov-gray-600 mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;