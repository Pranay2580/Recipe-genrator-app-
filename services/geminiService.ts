
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Recipe } from '../types';
import { SYSTEM_PROMPT } from '../constants';

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: "Name of the recipe." },
    description: { type: Type.STRING, description: "A short, appealing description of the dish." },
    requiredIngredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of all ingredients needed for the recipe." },
    cookingSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step instructions for cooking." },
    estimatedTime: { type: Type.STRING, description: "e.g., '25 mins'" },
    difficultyLevel: { type: Type.STRING, description: "e.g., 'Easy', 'Medium', 'Hard'" },
    servingSize: { type: Type.STRING, description: "e.g., 'Serves 2'" },
    optionalVariations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggestions for variations or substitutions." },
    nutritionalInfo: {
      type: Type.OBJECT,
      nullable: true,
      properties: {
        calories: { type: Type.STRING, description: "e.g., '240 kcal'" },
        protein: { type: Type.STRING, description: "e.g., '10g'" },
        carbs: { type: Type.STRING, description: "e.g., '30g'" },
        fats: { type: Type.STRING, description: "e.g., '15g'" },
      },
      description: "Optional nutritional information per serving."
    },
    shoppingList: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients required for the recipe that were NOT in the user's provided list." },
    drinkPairing: { type: Type.STRING, description: "A beverage that goes well with this dish." }
  },
  required: ['recipeName', 'description', 'requiredIngredients', 'cookingSteps', 'estimatedTime', 'difficultyLevel', 'servingSize', 'shoppingList', 'drinkPairing']
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recipes: {
            type: Type.ARRAY,
            items: recipeSchema,
            description: "An array of 3 to 5 recipe objects."
        },
        recommendations: {
            type: Type.STRING,
            nullable: true,
            description: "Suggestions for extra items to buy or simpler dishes if ingredients are missing."
        }
    }
};

const getApiKey = (): string | undefined => {
    // Robustly retrieve API key, handling various build tool behaviors
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        let key = process.env.API_KEY;
        // Check if the build tool replaced it with the literal string "undefined"
        if (key !== 'undefined' && key.trim() !== '') {
            // Remove surrounding quotes if present (common env var issue)
            key = key.replace(/^["']|["']$/g, '');
            return key;
        }
    }
    return undefined;
};

export const generateRecipes = async (
    ingredients: string[],
    cuisine: string,
    diet: string,
    time: string,
    language: string
): Promise<{ recipes: Recipe[], recommendations: string | null }> => {
    
    const apiKey = getApiKey();

    if (!apiKey) {
        const msg = "API Key is missing or invalid. Please ensure process.env.API_KEY is configured.";
        console.error(msg);
        throw new Error(msg);
    }

    // DEBUG: Log the first 4 chars to verify key presence without leaking the full key
    console.log(`[GeminiService] Initializing with key: ${apiKey.substring(0, 4)}...`);

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const userPrompt = `
        User selected ingredients: ${ingredients.join(', ')}
        Cuisine preference: ${cuisine}
        Diet preference: ${diet}
        Time preference: ${time}
        Language preference: ${language}

        Generate 3–5 complete recipes based on these preferences.
    `;

    try {
        const response = await ai.models.generateContent({
            // Using 'gemini-2.5-flash' as 'gemini-1.5-flash' is prohibited by guidelines.
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });
        
        let jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("Empty response from AI");
        }

        // Clean up markdown code blocks to ensure valid JSON
        jsonText = jsonText.replace(/^```json\s*/, '')
                           .replace(/^```\s*/, '')
                           .replace(/\s*```$/, '');

        const parsedResponse = JSON.parse(jsonText);
        
        return {
            recipes: parsedResponse.recipes || [],
            recommendations: parsedResponse.recommendations || null,
        };

    } catch (error: any) {
        console.error("Error generating recipes with Gemini:", error);
        // If it's a permission denied error, throw it so UI shows it
        throw error;
    }
};

export const generateRecipeImage = async (
    recipeName: string,
    description: string,
    size: '1K' | '2K' | '4K'
): Promise<string | null> => {
    
    const apiKey = getApiKey();

    if (!apiKey) {
        console.warn("API Key is missing. Image generation will not work.");
        return null;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    try {
        // Using 'gemini-2.5-flash-image' as 'gemini-1.5-flash' is prohibited and 'gemini-3-pro-image-preview' requires payment.
        // Note: imageSize is not supported in the standard flash image model, so it is omitted from config.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `A photorealistic, professional food photography shot of ${recipeName}. ${description}. High resolution, appetizing, studio lighting, beautiful plating.` }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9" 
                }
            }
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image generation failed:", error);
        return null;
    }
};

export const createChefChat = (recipe: Recipe): Chat => {
    const apiKey = getApiKey();

    if (!apiKey) {
         throw new Error("API Key missing");
    }
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const context = `You are a professional, friendly chef assistant. The user is currently viewing the recipe: "${recipe.recipeName}".
    
    Recipe Details:
    - Description: ${recipe.description}
    - Ingredients: ${recipe.requiredIngredients.join(', ')}
    - Steps: ${recipe.cookingSteps.join('; ')}
    
    Your goal is to answer the user's questions about this specific recipe.
    You can suggest substitutions, explain cooking techniques mentioned in the steps, or give advice on storage and leftovers.
    Keep your answers concise, helpful, and encouraging. Do not invent ingredients not mentioned unless asked for substitutions.`;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: context,
        }
    });
};