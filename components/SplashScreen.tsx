
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
    onStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStarted }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadedTimer = setTimeout(() => {
            setIsLoaded(true);
        }, 5000); // Match the animation duration
        
        return () => {
            clearTimeout(loadedTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-surface/50 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-lg border border-white/10 text-center animate-slide-in-up">
                <img 
                    src="https://iili.io/FAVL9Du.md.jpg" 
                    alt="App Icon" 
                    className="w-32 h-32 mx-auto mb-6 rounded-full shadow-lg border-2 border-white/20"
                />
                
                <h1 className="text-3xl font-black text-text-primary tracking-wide">
                    Arafat Prompt <span className="text-brand-accent">V2.4 Deep</span>
                </h1>
                <p className="mt-2 text-md text-text-secondary mb-8">
                    Crafting Aesthetic AI Wallpaper Prompts
                </p>
                
                <div className="w-full bg-black/25 rounded-full h-2.5 mb-8 overflow-hidden border border-white/10">
                    <div 
                        className="bg-brand-accent h-full" 
                        style={{ animation: 'fill-bar 5s linear forwards' }}
                    ></div>
                </div>

                {/* Container to prevent layout shift when button appears */}
                <div className="h-14">
                    {isLoaded && (
                        <button
                            onClick={onStarted}
                            className="bg-brand-accent text-bg-primary font-bold text-lg py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-accent-glow animate-fade-in"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};