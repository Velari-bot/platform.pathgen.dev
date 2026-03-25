"use client"
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    size?: number;
    color?: string;
}

export default function CopyButton({ text, size = 16, color = '#9CA3AF' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button 
            onClick={handleCopy}
            style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s active',
                color: copied ? '#10B981' : color
            }}
            className="active-scale"
            title="Copy to clipboard"
        >
            {copied ? <Check size={size} /> : <Copy size={size} />}
        </button>
    );
}
