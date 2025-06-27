import React, { useState } from 'react';
import { CreativePrompt } from '../types';

interface PromptItemProps {
  prompt: CreativePrompt;
  index: number;
  onToggleFavorite: (prompt: CreativePrompt) => void;
  onEdit: (prompt: CreativePrompt) => void;
}

const ActionButton: React.FC<{ onClick: () => void; ariaLabel: string; children: React.ReactNode }> = ({ onClick, ariaLabel, children }) => (
    <button
        onClick={onClick}
        className="group bg-black/20 hover:bg-black/40 p-2 rounded-md transition-all duration-200"
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

const CopyIcon: React.FC<{ copied: boolean }> = ({ copied }) => {
    if (copied) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
};

const FavoriteIcon: React.FC<{ isFavorite: boolean }> = ({ isFavorite }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors" viewBox="0 0 20 20" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" className={isFavorite ? 'text-yellow-400' : 'text-text-secondary group-hover:text-yellow-400'} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

const EditIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

export const PromptItem: React.FC<PromptItemProps> = ({ prompt, index, onToggleFavorite, onEdit }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };
    
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AI Wallpaper Prompt',
                    text: prompt.text,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            handleCopy();
            alert('Prompt copied to clipboard! (Sharing not supported on this browser)');
        }
    };

    return (
        <li
            className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center gap-4 animate-slide-in-up shadow-sm transition-all hover:border-brand-accent/50 hover:bg-white/10"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
        >
            <p className="text-text-primary flex-1">{prompt.text}</p>
            <div className="flex items-center gap-1 flex-shrink-0">
                <ActionButton onClick={() => onToggleFavorite(prompt)} ariaLabel="Toggle favorite">
                    <FavoriteIcon isFavorite={!!prompt.isFavorite} />
                </ActionButton>
                <ActionButton onClick={handleShare} ariaLabel="Share prompt">
                    <ShareIcon />
                </ActionButton>
                <ActionButton onClick={() => onEdit(prompt)} ariaLabel="Edit prompt">
                    <EditIcon />
                </ActionButton>
                <ActionButton onClick={handleCopy} ariaLabel="Copy prompt">
                    <CopyIcon copied={copied} />
                </ActionButton>
            </div>
        </li>
    );
};