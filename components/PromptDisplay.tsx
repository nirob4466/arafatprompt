import React, { useState } from 'react';
import { Loader } from './Loader';
import { CreativePrompt } from '../types';

interface PromptDisplayProps {
  prompts: CreativePrompt[];
  isLoading: boolean;
  error: string | null;
  currentMode: 'ai' | 'image';
}

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

const PromptItem: React.FC<{ prompt: CreativePrompt; index: number }> = ({ prompt, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <li
            className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-start gap-4 animate-slide-in-up shadow-sm transition-all hover:border-brand-yellow/50 hover:bg-white/10"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
        >
            <span className="text-sm font-bold text-text-secondary mt-1">#{index + 1}</span>
            <p className="text-text-primary flex-1">{prompt.text}</p>
            <button
                onClick={handleCopy}
                className="group bg-black/20 hover:bg-black/40 p-2 rounded-md transition-all duration-200 flex-shrink-0"
                aria-label="Copy prompt"
            >
                <CopyIcon copied={copied} />
            </button>
        </li>
    );
};

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-text-placeholder p-10 bg-surface/50 backdrop-blur-xl rounded-2xl border border-dashed border-white/20">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-placeholder mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
         </svg>
        <h3 className="text-xl font-bold text-text-secondary">Ready to Spark Creativity?</h3>
        <p className="mt-2 max-w-sm">Select your preferences on the left and click "Generate" to conjure up some magical prompts!</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-400 bg-red-500/10 backdrop-blur-xl p-8 rounded-2xl border border-red-400/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-red-300">An Error Occurred</h3>
        <p className="mt-2 text-red-400">{message}</p>
    </div>
);

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompts, isLoading, error, currentMode }) => {
    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }
    
    if (prompts.length === 0) {
        return <InitialState />;
    }

    return (
        <div className="bg-surface/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg h-full">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Generated Prompts</h2>
            <ul className="flex flex-col h-full space-y-3">
                {prompts.map((prompt, index) => (
                    <PromptItem
                        key={prompt.id}
                        prompt={prompt}
                        index={index}
                    />
                ))}
            </ul>
        </div>
    );
};