/**
 * "Nothing here" panel. Pass an `action` where there is an obvious next step.
 */
const EmptyState = ({ title = 'No items', description = '', action, icon: Icon }) => (
  <div className="rounded-2xl border border-dashed border-gov-gray-200 px-6 py-10 text-center">
    {Icon && <Icon className="mx-auto mb-3 h-8 w-8 text-gov-gray-300" aria-hidden="true" />}
    <h3 className="mb-1 text-base font-bold text-gov-gray-900">{title}</h3>
    {description && <p className="mx-auto max-w-sm text-sm leading-relaxed text-gov-gray-500">{description}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
