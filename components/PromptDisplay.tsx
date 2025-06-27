import React, { useState } from 'react';
import { Loader } from './Loader';
import { CreativePrompt } from '../types';
import { PromptItem } from './PromptItem';

interface PromptDisplayProps {
  prompts: CreativePrompt[];
  favorites: CreativePrompt[];
  history: CreativePrompt[][];
  isLoading: boolean;
  error: string | null;
  onToggleFavorite: (prompt: CreativePrompt) => void;
  onEditPrompt: (prompt: CreativePrompt) => void;
}

type Tab = 'generated' | 'favorites' | 'history';

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-text-placeholder p-10 bg-surface/50 backdrop-blur-xl rounded-2xl border border-dashed border-white/20">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-placeholder mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
         </svg>
        <h3 className="text-xl font-bold text-text-secondary">Ready to Spark Creativity?</h3>
        <p className="mt-2 max-w-sm">Select your preferences on the left and click "Generate" to conjure up some magical prompts!</p>
    </div>
);

const EmptyState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
    <div className="flex flex-col items-center justify-center text-center text-text-placeholder p-10">
         <h3 className="text-xl font-bold text-text-secondary">{title}</h3>
         <p className="mt-2 max-w-sm">{message}</p>
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


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 font-semibold rounded-md transition-colors text-sm ${active ? 'bg-brand-accent text-bg-primary' : 'text-text-secondary hover:bg-white/10'}`}
    >
        {children}
    </button>
);


export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompts, favorites, history, isLoading, error, onToggleFavorite, onEditPrompt }) => {
    const [activeTab, setActiveTab] = useState<Tab>('generated');

    const renderContent = () => {
        if (isLoading) return <Loader />;
        if (error) return <ErrorState message={error} />;

        if (activeTab === 'generated') {
            if (prompts.length === 0) return <InitialState />;
            return (
                <ul className="flex flex-col h-full space-y-3">
                    {prompts.map((prompt, index) => (
                        <PromptItem key={prompt.id} prompt={prompt} index={index} onToggleFavorite={onToggleFavorite} onEdit={onEditPrompt} />
                    ))}
                </ul>
            );
        }

        if (activeTab === 'favorites') {
            if (favorites.length === 0) return <EmptyState title="No Favorites Yet" message="Click the star icon on a prompt to save it here." />;
            return (
                 <ul className="flex flex-col h-full space-y-3">
                    {favorites.map((prompt, index) => (
                        <PromptItem key={prompt.id} prompt={prompt} index={index} onToggleFavorite={onToggleFavorite} onEdit={onEditPrompt} />
                    ))}
                </ul>
            );
        }

        if (activeTab === 'history') {
             if (history.length === 0) return <EmptyState title="No History Found" message="Generated prompts will appear here for you to revisit." />;
            return (
                <div className="flex flex-col h-full space-y-6">
                    {history.map((batch, batchIndex) => (
                        <div key={batchIndex}>
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Generation #{history.length - batchIndex}</h3>
                            <ul className="space-y-3">
                                {batch.map((prompt, promptIndex) => (
                                    <PromptItem key={prompt.id} prompt={prompt} index={promptIndex} onToggleFavorite={onToggleFavorite} onEdit={onEditPrompt} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="bg-surface/50 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-lg h-full min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Results</h2>
                <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-lg">
                    <TabButton active={activeTab === 'generated'} onClick={() => setActiveTab('generated')}>Generated</TabButton>
                    <TabButton active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')}>Favorites</TabButton>
                    <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>History</TabButton>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                 {renderContent()}
            </div>
        </div>
    );
};