import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border bg-white dark:bg-gray-900/80 border-gray-200/80 dark:border-gray-800 p-5 shadow-sm transition-all duration-200',
          glass && 'backdrop-blur-md bg-white/70 dark:bg-gray-900/60',
          hoverEffect && 'hover:shadow-md hover:border-brand-500/40 dark:hover:border-brand-500/40 hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
