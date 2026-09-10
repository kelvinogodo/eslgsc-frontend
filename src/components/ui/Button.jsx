import { forwardRef, useMemo } from 'react';
import clsx from 'clsx';

const Button = forwardRef(({
  as: Component = 'button',
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
  onClick,
  tabIndex,
  ...props
}, ref) => {
  const isNativeButton = Component === 'button' || Component === undefined;

  const classes = useMemo(
    () => clsx(
      'btn',
      {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost'
      }[variant],
      `btn-${size}`,
      className
    ),
    [variant, size, className]
  );

  if (isNativeButton) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={classes}
        tabIndex={tabIndex}
        data-disabled={disabled ? '' : undefined}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <Component
      ref={ref}
      className={classes}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : tabIndex}
      data-disabled={disabled ? '' : undefined}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
