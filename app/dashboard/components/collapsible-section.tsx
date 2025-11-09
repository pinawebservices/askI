'use client';

import { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      )}
    </div>
  );
}