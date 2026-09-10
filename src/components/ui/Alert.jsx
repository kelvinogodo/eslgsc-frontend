import clsx from 'clsx';
import { 
  InformationCircleIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

const icons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon
};

const Alert = ({ children, variant = 'info', className, ...props }) => {
  const Icon = icons[variant];
  const variantClass = `alert-${variant}`;
  
  return (
    <div className={clsx('alert', variantClass, className)} {...props}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Alert;
