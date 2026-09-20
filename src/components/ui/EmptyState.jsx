import React from 'react';
import { InboxIcon } from '@heroicons/react/24/outline';

/**
 * Friendly "nothing here yet" panel. Always try to pass an `action` so the
 * operator knows the next step instead of hitting a dead end.
 */
const EmptyState = ({ title = 'No items', description = '', action, icon: Icon = InboxIcon }) => {
  return (
    <div className="rounded-2xl border border-dashed border-gov-gray-200 bg-gov-gray-50/40 px-6 py-10 text-center">
      <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gov-gray-400 shadow-sm ring-1 ring-gov-gray-100">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-base font-bold text-gov-gray-900 mb-1">{title}</h3>
      {description && <p className="mx-auto max-w-sm text-sm leading-relaxed text-gov-gray-500">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
