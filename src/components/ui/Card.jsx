import clsx from 'clsx';

const Card = ({ children, className, variant = 'default', ...props }) => {
  const variantClass = variant === 'glass' ? 'glass' : 'card';
  
  return (
    <div className={clsx(variantClass, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
