import React, { useState, useCallback } from 'react';
import { generateWallpaperPrompts } from '../services/geminiService';
import { CreativePrompt } from '../types';

interface AiPromptGeneratorProps {
    onGenerateStart: () => void;
    onGenerateComplete: (prompts: CreativePrompt[]) => void;
    onGenerateError: (message: string) => void;
    apiKey: string;
}

const categories = [
    "Landscapes", 
    "Cityscapes", 
    "Space & Cosmos", 
    "Abstract", 
    "Animals", 
    "Fantasy Worlds", 
    "Sci-Fi Futures", 
    "Nature's Details", 
    "Underwater Realms", 
    "Architecture", 
    "Vehicles", 
    "Minimalist", 
    "Dreamlike & Surreal", 
    "Gothic & Dark", 
    "Mythology", 
    "Vaporwave & Retro", 
    "Food & Drink", 
    "Steampunk", 
    "Crystalline & Gemstones", 
    "Biomechanical"
];
const visualStyles = ["Anime", "Photorealistic", "3D Render", "Impressionistic", "Minimalist", "Cyberpunk", "Vintage", "Surreal"];

const SelectInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ label, value, onChange, options }) => (
    <div className="flex-1">
        <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
        <select value={value} onChange={onChange} className="w-full bg-black/25 text-text-primary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all">
            {options.map(option => <option key={option} value={option} className="bg-bg-secondary">{option}</option>)}
        </select>
    </div>
);

const ToggleSwitch: React.FC<{ label: string; description: string; enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ label, description, enabled, setEnabled }) => (
    <div className="bg-black/25 p-4 rounded-lg flex items-center justify-between border border-white/10">
        <div>
            <h4 className="font-bold text-text-primary">{label}</h4>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${enabled ? 'bg-brand-yellow' : 'bg-black/40'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

export const AiPromptGenerator: React.FC<AiPromptGeneratorProps> = ({ onGenerateStart, onGenerateComplete, onGenerateError, apiKey }) => {
    const [category, setCategory] = useState(categories[0]);
    const [visualStyle, setVisualStyle] = useState(visualStyles[0]);
    const [isOled, setIsOled] = useState(false);

    const handleGenerate = useCallback(async () => {
        if (!apiKey) {
            onGenerateError("OpenRouter API Key is missing. Please add it in the settings (cogwheel icon) before generating prompts.");
            return;
        }
        onGenerateStart();
        try {
            const results = await generateWallpaperPrompts(category, visualStyle, isOled, apiKey);
            const newPrompts = results.map(text => ({ id: crypto.randomUUID(), text }));
            onGenerateComplete(newPrompts);
        } catch (err) {
            onGenerateError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    }, [category, visualStyle, isOled, onGenerateStart, onGenerateComplete, onGenerateError, apiKey]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <SelectInput label="Category" value={category} onChange={e => setCategory(e.target.value)} options={categories} />
                <SelectInput label="Visual Style" value={visualStyle} onChange={e => setVisualStyle(e.target.value)} options={visualStyles} />
            </div>
            <ToggleSwitch
                label="OLED Optimized Prompts"
                description="Prioritize dark backgrounds & high contrast."
                enabled={isOled}
                setEnabled={setIsOled}
            />
            <button
                onClick={handleGenerate}
                className="w-full bg-brand-yellow text-bg-primary font-bold text-lg py-3.5 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-glow shadow-brand-glow animate-glow-pulse"
            >
                Generate Prompts
            </button>
        </div>
    );
};