import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    geminiApiKey: string;
    setGeminiApiKey: (key: string) => void;
    openRouterApiKey: string;
    setOpenRouterApiKey: (key: string) => void;
    theme: string;
    setTheme: (theme: string) => void;
}

const themes = [
    { name: 'yellow', color: 'bg-yellow-400' },
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'pink', color: 'bg-pink-500' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, geminiApiKey, setGeminiApiKey, openRouterApiKey, setOpenRouterApiKey, theme, setTheme }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-surface/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors" aria-label="Close Settings">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-3">Theme</h3>
                        <div className="bg-black/25 p-4 rounded-lg border border-white/10">
                            <label className="block text-sm font-medium text-text-secondary mb-2">Accent Color</label>
                            <div className="flex space-x-3">
                                {themes.map((t) => (
                                    <button
                                        key={t.name}
                                        onClick={() => setTheme(t.name)}
                                        className={`w-8 h-8 rounded-full ${t.color} transition-transform hover:scale-110 ${theme === t.name ? 'ring-2 ring-offset-2 ring-offset-surface ring-white' : ''}`}
                                        aria-label={`Set ${t.name} theme`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold text-text-primary mb-3">API Keys</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="openrouter-api-key" className="block text-sm font-medium text-text-secondary mb-2">
                                    OpenRouter API Key
                                </label>
                                <input
                                    id="openrouter-api-key"
                                    type="password"
                                    value={openRouterApiKey}
                                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                                    placeholder="Enter your OpenRouter API key..."
                                    className="w-full bg-black/25 text-text-primary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                                />
                                <p className="text-xs text-text-placeholder mt-2">Used for the 'AI Prompt Generator'. Your key is saved in your browser's local storage.</p>
                            </div>
                             <div>
                                <label htmlFor="gemini-api-key" className="block text-sm font-medium text-text-secondary mb-2">
                                    Gemini API Key
                                </label>
                                <input
                                    id="gemini-api-key"
                                    type="password"
                                    value={geminiApiKey}
                                    onChange={(e) => setGeminiApiKey(e.target.value)}
                                    placeholder="Enter your Gemini API key..."
                                    className="w-full bg-black/25 text-text-primary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                                />
                                <p className="text-xs text-text-placeholder mt-2">Used for the 'Image to Prompt' feature. Your key is saved in your browser's local storage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-right">
                     <button
                        onClick={onClose}
                        className="bg-brand-accent text-bg-primary font-bold py-2 px-6 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};