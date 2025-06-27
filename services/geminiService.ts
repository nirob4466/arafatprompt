import { GoogleGenAI } from "@google/genai";

const geminiModel = "gemini-2.5-flash-preview-04-17";
const openRouterModel = "google/gemini-flash-1.5"; // A good default on OpenRouter

const parseJsonResponse = (text: string): string[] => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }

    try {
        const parsedData = JSON.parse(jsonStr);
        if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
            return parsedData;
        } else {
            const arrayKey = Object.keys(parsedData).find(k => Array.isArray(parsedData[k]));
            if(arrayKey && Array.isArray(parsedData[arrayKey]) && parsedData[arrayKey].every((item: any) => typeof item === 'string')) {
                return parsedData[arrayKey];
            }
            throw new Error("AI response is not a valid array of strings.");
        }
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", jsonStr);
        throw new Error("The AI returned an unexpected format. Please try again.");
    }
}


export async function generatePromptsFromImage(base64Image: string, mimeType: string, apiKey: string): Promise<string[]> {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing. Please add it in the settings.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: { data: base64Image, mimeType: mimeType },
    };

    const textPart = {
        text: `Analyze this image and generate 5 creative, short, and inspiring wallpaper prompts for an artist. The prompts should be diverse, aesthetic, and thought-provoking, suitable for generating stunning visuals. Return the result as a JSON array of 5 strings.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: geminiModel,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                temperature: 0.8,
                topP: 0.95,
            },
        });
        return parseJsonResponse(response.text);
    } catch (error) {
        console.error("Error calling Gemini API for image:", error);
        throw new Error("Failed to generate prompts. Please check your Gemini API key and network connection.");
    }
}


export async function generateWallpaperPrompts(category: string, visualStyle: string, isOled: boolean, apiKey: string): Promise<string[]> {
    if (!apiKey) {
        throw new Error("OpenRouter API Key is missing. Please add it in the settings (cogwheel icon).");
    }
    
    const oledInstruction = isOled ? "The prompts must be optimized for OLED screens, meaning they should describe scenes with deep blacks, high contrast, and vibrant, glowing elements against dark backgrounds." : "";

    const systemPrompt = `You are an expert AI prompt generator specializing in creating aesthetic and highly detailed prompts for AI image generation models. Your goal is to produce 5 unique and creative wallpaper prompts.
- Each prompt must be a single, coherent sentence.
- The prompts must be exceptionally descriptive and visually rich.
- ${oledInstruction}
- Return ONLY a JSON object with a single key "prompts" containing an array of 5 strings. Do not include any other text, explanations, or markdown. Example: {"prompts": ["prompt 1", "prompt 2", "prompt 3", "prompt 4", "prompt 5"]}`;

    const userPrompt = `Generate 5 wallpaper prompts based on the following criteria:
- Category: ${category}
- Visual Style: ${visualStyle}`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: openRouterModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.9,
                top_p: 1.0,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Catch if error body is not json
            const errorMessage = errorData?.error?.message || `HTTP Error: ${response.status} ${response.statusText}`;
            throw new Error(`OpenRouter API Error: ${errorMessage}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error("Received an empty response from OpenRouter.");
        }

        return parseJsonResponse(content);

    } catch (error) {
        console.error("Error calling OpenRouter API for text prompts:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to generate prompts. Please check your OpenRouter API key and network connection.");
    }
}