import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { generatePromptsFromImage } from '../services/geminiService';
import { CreativePrompt } from '../types';

interface ImageToPromptProps {
    onGenerateStart: () => void;
    onGenerateComplete: (prompts: CreativePrompt[]) => void;
    onGenerateError: (message: string) => void;
    onClear: () => void;
    apiKey: string;
}

export const ImageToPrompt: React.FC<ImageToPromptProps> = ({ onGenerateStart, onGenerateComplete, onGenerateError, onClear, apiKey }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const handleImageUpload = useCallback((file: File) => {
        onClear(); // Clear previous results
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [onClear]);

    const handleGenerate = useCallback(async () => {
        if (!imageFile || !imageBase64) {
            onGenerateError("Please upload an image first.");
            return;
        }
        if (!apiKey) {
            onGenerateError("Gemini API Key is missing. Please add it in the settings (cogwheel icon).");
            return;
        }

        onGenerateStart();
        try {
            const base64Data = imageBase64.split(',')[1];
            const generatedTexts = await generatePromptsFromImage(base64Data, imageFile.type, apiKey);
            const newPrompts = generatedTexts.map(text => ({
                id: crypto.randomUUID(),
                text: text,
                isFavorite: false
            }));
            onGenerateComplete(newPrompts);
        } catch (err) {
            onGenerateError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    }, [imageFile, imageBase64, onGenerateStart, onGenerateComplete, onGenerateError, apiKey]);

    const handleClearUploader = useCallback(() => {
        setImageFile(null);
        setImageBase64(null);
        onClear();
    }, [onClear]);


    return (
        <div className="space-y-6 flex flex-col items-center">
            <ImageUploader
                onImageUpload={handleImageUpload}
                imageUrl={imageBase64}
                onClear={handleClearUploader}
            />
            {imageBase64 && (
                 <button
                    onClick={handleGenerate}
                    className="w-full bg-brand-accent text-bg-primary font-bold text-lg py-3.5 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-accent-glow shadow-brand-accent-glow animate-glow-pulse"
                >
                    Generate Prompts from Image
                </button>
            )}
        </div>
    );
};