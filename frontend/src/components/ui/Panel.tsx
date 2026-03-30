import React from 'react';

interface PanelProps {
  title: string;
  iconColor?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Panel({ title, iconColor = 'var(--accent)', action, children, className = '' }: PanelProps) {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-hd">
        <div className="panel-title">
          <span className="dot" style={{ background: iconColor, boxShadow: `0 0 6px ${iconColor}` }}></span>
          {title}
        </div>
        {action}
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
}
