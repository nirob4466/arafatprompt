import React, { useState, useCallback, useEffect } from 'react';
import { AiPromptGenerator } from './components/AiPromptGenerator';
import { ImageToPrompt } from './components/ImageToPrompt';
import { PromptDisplay } from './components/PromptDisplay';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { CreativePrompt } from './types';
import { PromptEditorModal } from './components/PromptEditorModal';

type Mode = 'ai' | 'image';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

const Header: React.FC<{ onSettingsClick: () => void }> = ({ onSettingsClick }) => (
    <header className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-wide flex items-center gap-3">
                <span className="text-brand-accent">⚡</span>
                Arafat Prompt V2.4 Deep
            </h1>
            <p className="mt-1 text-md text-text-secondary">Crafting Aesthetic AI Wallpaper Prompts</p>
        </div>
        <button onClick={onSettingsClick} className="p-2 rounded-full text-text-secondary hover:bg-white/10 hover:text-text-primary transition-colors" aria-label="Open Settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
    </header>
);

const ModeToggle: React.FC<{ mode: Mode; onModeChange: (mode: Mode) => void; }> = ({ mode, onModeChange }) => (
    <div className="flex items-center bg-black/20 rounded-full p-1 shadow-inner w-full max-w-lg mx-auto border border-white/5">
        <button
            onClick={() => onModeChange('ai')}
            className={`w-1/2 py-2.5 rounded-full font-bold text-lg transition-all duration-300 ${mode === 'ai' ? 'bg-brand-accent text-bg-primary shadow-md' : 'text-text-secondary hover:bg-white/5'}`}
        >
            AI Prompt Generator
        </button>
        <button
            onClick={() => onModeChange('image')}
            className={`w-1/2 py-2.5 rounded-full font-bold text-lg transition-all duration-300 ${mode === 'image' ? 'bg-brand-accent text-bg-primary shadow-md' : 'text-text-secondary hover:bg-white/5'}`}
        >
            Image to Prompt
        </button>
    </div>
);

const Footer: React.FC = () => (
    <footer className="text-center mt-12 py-4 col-span-1 lg:col-span-2">
        <p className="text-sm text-text-secondary/80">Arafat Prompt V2.4 Deep © 2025. AI-powered creativity.</p>
    </footer>
);

const App: React.FC = () => {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [mode, setMode] = useState<Mode>('ai');
  const [prompts, setPrompts] = useState<CreativePrompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [promptToEdit, setPromptToEdit] = useState<CreativePrompt | null>(null);

  const [geminiApiKey, setGeminiApiKey] = useLocalStorage('gemini_api_key', '');
  const [openRouterApiKey, setOpenRouterApiKey] = useLocalStorage('open_router_api_key', '');
  const [theme, setTheme] = useLocalStorage('app_theme', 'yellow');
  const [favorites, setFavorites] = useLocalStorage<CreativePrompt[]>('app_favorites', []);
  const [history, setHistory] = useLocalStorage<CreativePrompt[][]>('app_history', []);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleClear = useCallback(() => {
    setPrompts([]);
    setError(null);
    setIsLoading(false);
  }, []);
  
  const handleAppStart = () => setIsAppStarted(true);

  const handleModeChange = (newMode: Mode) => {
    if(mode !== newMode) {
        setMode(newMode);
        handleClear();
    }
  };

  const handleGenerationStart = () => {
    setIsLoading(true);
    setPrompts([]);
    setError(null);
  };

  const handleGenerationComplete = (newPrompts: CreativePrompt[]) => {
    const freshPrompts = newPrompts.map(p => ({ ...p, isFavorite: false }));
    setPrompts(freshPrompts);
    setHistory(prev => [freshPrompts, ...prev].slice(0, 10));
    setIsLoading(false);
  };

  const handleGenerationError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };
  
  const handleToggleFavorite = (promptToToggle: CreativePrompt) => {
    const updatedPrompt = { ...promptToToggle, isFavorite: !promptToToggle.isFavorite };

    setPrompts(prev => prev.map(p => p.id === promptToToggle.id ? updatedPrompt : p));
    setHistory(prev => prev.map(batch => batch.map(p => p.id === promptToToggle.id ? updatedPrompt : p)));

    if (updatedPrompt.isFavorite) {
        setFavorites(prev => [...prev, updatedPrompt]);
    } else {
        setFavorites(prev => prev.filter(p => p.id !== promptToToggle.id));
    }
  };
  
  const handleEditPrompt = (prompt: CreativePrompt) => {
    setPromptToEdit(prompt);
    setIsEditorOpen(true);
  };

  const handleUpdatePrompt = (promptId: string, newText: string) => {
      const updateFn = (p: CreativePrompt) => p.id === promptId ? { ...p, text: newText } : p;
      setPrompts(prev => prev.map(updateFn));
      setFavorites(prev => prev.map(updateFn));
      setHistory(prev => prev.map(batch => batch.map(updateFn)));
      setIsEditorOpen(false);
      setPromptToEdit(null);
  };

  return (
    <div className="min-h-screen text-text-primary">
      {!isAppStarted ? (
        <SplashScreen onStarted={handleAppStart} />
      ) : (
        <>
            <PromptEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                prompt={promptToEdit}
                onSave={handleUpdatePrompt}
            />
            <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
              <div className="max-w-7xl mx-auto">
                <SettingsModal 
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    geminiApiKey={geminiApiKey}
                    setGeminiApiKey={setGeminiApiKey}
                    openRouterApiKey={openRouterApiKey}
                    setOpenRouterApiKey={setOpenRouterApiKey}
                    theme={theme}
                    setTheme={setTheme}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="lg:col-span-2">
                        <Header onSettingsClick={() => setIsSettingsOpen(true)} />
                    </div>

                    <div className="space-y-6 lg:sticky top-8 self-start">
                        <ModeToggle mode={mode} onModeChange={handleModeChange} />
                        <div className="bg-surface/50 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg border border-white/10">
                            {mode === 'ai' ? (
                                <AiPromptGenerator
                                    onGenerateStart={handleGenerationStart}
                                    onGenerateComplete={handleGenerationComplete}
                                    onGenerateError={handleGenerationError}
                                    apiKey={openRouterApiKey}
                                />
                            ) : (
                                <ImageToPrompt
                                    onGenerateStart={handleGenerationStart}
                                    onGenerateComplete={handleGenerationComplete}
                                    onGenerateError={handleGenerationError}
                                    onClear={handleClear}
                                    apiKey={geminiApiKey}
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="lg:row-start-2">
                        <PromptDisplay 
                            prompts={prompts}
                            favorites={favorites}
                            history={history}
                            isLoading={isLoading}
                            error={error}
                            onToggleFavorite={handleToggleFavorite}
                            onEditPrompt={handleEditPrompt}
                        />
                    </div>
                    
                    <Footer />
                </div>
              </div>
            </div>
        </>
      )}
    </div>
  );
};

export default App;