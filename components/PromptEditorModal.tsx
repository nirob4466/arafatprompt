import React, { useState, useEffect } from 'react';
import { CreativePrompt } from '../types';

interface PromptEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    prompt: CreativePrompt | null;
    onSave: (promptId: string, newText: string) => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({ isOpen, onClose, prompt, onSave }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        if (prompt) {
            setText(prompt.text);
        }
    }, [prompt]);

    if (!isOpen || !prompt) return null;

    const handleSave = () => {
        onSave(prompt.id, text);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-surface/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl p-8 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Edit Prompt</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors" aria-label="Close Editor">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-40 bg-black/25 text-text-primary p-4 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all resize-none"
                />

                <div className="mt-6 flex justify-end gap-4">
                     <button
                        onClick={onClose}
                        className="bg-white/10 text-text-primary font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-white/20"
                    >
                        Cancel
                    </button>
                     <button
                        onClick={handleSave}
                        className="bg-brand-accent text-bg-primary font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};