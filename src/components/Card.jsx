import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Card({ children, className, ...props }) {
  return (
    <div 
      className={twMerge(
        "glass-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
