import React from 'react';

/**
 * A reusable, styled button component.
 *
 * @param {object} props
 * @param {'primary' | 'secondary'} [props.variant='primary'] - The button style variant.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The button's type.
 * @param {Function} props.onClick - The click event handler.
 * @param {React.ReactNode} props.children - The content inside the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.className=''] - Additional CSS classes.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles =
    'inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out';

  // Variant-specific styles
  const primaryStyles =
    'text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 hover:scale-105 transform hover:shadow-lg focus:ring-orange-500';

  const secondaryStyles =
    'text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-gray-400';

  // Disabled styles
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  // Combine the classes
  const appliedClasses = `
    ${baseStyles}
    ${variant === 'primary' ? primaryStyles : secondaryStyles}
    ${disabled ? disabledStyles : ''}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={appliedClasses.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

