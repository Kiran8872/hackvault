import React from 'react';

interface BadgeProps {
  type?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ type, className = '', children }: BadgeProps) {
  const badgeClass = type ? `badge-${type}` : '';
  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children}
    </span>
  );
}
