'use client';

import { useEffect, useRef, TextareaHTMLAttributes } from 'react';

interface AutoExpandTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function AutoExpandTextarea({
    value,
    onChange,
    className = '',
    rows = 3,
    ...props
}: AutoExpandTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea based on content
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    // Adjust height when value changes
    useEffect(() => {
        adjustHeight();
    }, [value]);

    // Adjust height on initial mount
    useEffect(() => {
        adjustHeight();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e);
        adjustHeight();
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            rows={rows}
            className={`resize-none overflow-hidden ${className}`}
            {...props}
        />
    );
}