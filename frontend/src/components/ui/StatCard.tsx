import React from 'react';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  sub: string;
  color?: string;
}

export default function StatCard({ icon, value, label, sub, color }: StatCardProps) {
  return (
    <div className="stat-card" style={color ? { '--stat-c': color } as React.CSSProperties : {}}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}
