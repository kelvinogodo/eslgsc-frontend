import clsx from 'clsx';

const Badge = ({ children, variant = 'blue', className, ...props }) => {
  const variantClass = `badge-${variant}`;
  
  return (
    <span className={clsx('badge', variantClass, className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
