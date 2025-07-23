import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-lg shadow border ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 pt-6 pb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`px-6 pb-6 pt-2 ${className}`}>{children}</div>;
} 