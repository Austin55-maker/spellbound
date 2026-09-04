import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'selected';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all duration-150 transform active:scale-95 shadow-[0_4px_0_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0_rgba(0,0,0,0.4)] active:shadow-none active:translate-y-[4px]";
  
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-300 border-2 border-yellow-500 dark:border-yellow-600",
    secondary: "bg-blue-500 text-white hover:bg-blue-400 border-2 border-blue-600 dark:border-blue-700",
    danger: "bg-red-500 text-white hover:bg-red-400 border-2 border-red-600 dark:border-red-700",
    outline: "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 shadow-[0_4px_0_rgba(203,213,225,1)] dark:shadow-[0_4px_0_rgba(71,85,105,1)]",
    selected: "bg-indigo-600 text-white border-2 border-indigo-800 shadow-[0_4px_0_rgba(55,48,163,1)] ring-2 ring-indigo-300 dark:ring-indigo-700 ring-offset-2 dark:ring-offset-slate-900"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
    xl: "w-12 h-12 flex items-center justify-center text-xl p-0" // Square button for grid
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;