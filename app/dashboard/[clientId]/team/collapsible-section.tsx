'use client';

import { ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  count,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between"
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
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <span className="text-sm text-gray-600">{count} {count === 1 ? 'member' : 'members'}</span>
      </button>
      {isOpen && (
        <div className="overflow-x-auto">
          {children}
        </div>
      )}
    </div>
  );
}