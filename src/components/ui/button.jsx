import React from 'react';

const buttonVariants = {
    default: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:brightness-110',
    outline: 'border border-teal-500/50 bg-transparent hover:bg-teal-500/10 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-white',
};

const buttonSizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
};

export const Button = React.forwardRef(({
    className = '',
    variant = 'default',
    size = 'default',
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={`
        inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 transform hover:scale-105
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
