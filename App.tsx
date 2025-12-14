
import React, { useState, useEffect, useCallback } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { RecipeList } from './components/RecipeList';
import { RecipeModal } from './components/RecipeModal';
import { CookingModeModal } from './components/CookingModeModal';
import { FavoritesModal } from './components/FavoritesModal';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { NoResults } from './components/NoResults';
import type { Recipe } from './types';
import { generateRecipes, generateRecipeImage } from './services/geminiService';
import { INGREDIENTS, CUISINES, DIETS, COOKING_TIMES, LANGUAGES, IMAGE_SIZES } from './constants';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [selectedCuisine, setSelectedCuisine] = useState<string>('Any');
    const [selectedDiet, setSelectedDiet] = useState<string>('Any');
    const [selectedTime, setSelectedTime] = useState<string>('Any');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
    const [selectedImageSize, setSelectedImageSize] = useState<string>('1K');
    
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [recommendations, setRecommendations] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<React.ReactNode | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isCookingMode, setIsCookingMode] = useState(false);
    const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

    const [favorites, setFavorites] = useState<Recipe[]>([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteRecipes');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    const toggleFavorite = (recipe: Recipe) => {
        let updatedFavorites;
        if (favorites.some(fav => fav.recipeName === recipe.recipeName)) {
            updatedFavorites = favorites.filter(fav => fav.recipeName !== recipe.recipeName);
        } else {
            updatedFavorites = [...favorites, recipe];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    };

    const handleGenerateRecipes = useCallback(async () => {
        if (selectedIngredients.length === 0) {
            setError('Please select at least one ingredient.');
            return;
        }
        setIsLoading(true);
        setHasSearched(true);
        setError(null);
        setRecipes([]);
        setRecommendations(null);

        try {
            // 1. Generate text recipes first (Fast)
            const result = await generateRecipes(selectedIngredients, selectedCuisine, selectedDiet, selectedTime, selectedLanguage);
            const initialRecipes = result.recipes || [];
            setRecipes(initialRecipes);
            setRecommendations(result.recommendations || null);
            setIsLoading(false);

            // 2. Generate images in the background (Slower)
            // We use the index to identify the recipe to update
            initialRecipes.forEach(async (recipe, index) => {
                const imageUrl = await generateRecipeImage(recipe.recipeName, recipe.description, selectedImageSize as '1K' | '2K' | '4K');
                if (imageUrl) {
                    setRecipes(currentRecipes => {
                        const newRecipes = [...currentRecipes];
                        // Verify we are updating the correct recipe
                        if (newRecipes[index] && newRecipes[index].recipeName === recipe.recipeName) {
                            newRecipes[index] = { ...newRecipes[index], imageUrl };
                            return newRecipes;
                        }
                        return currentRecipes;
                    });
                }
            });

        } catch (e: any) {
            console.error("Recipe generation error:", e);
            
            const rawMsg = e.message || e.toString() || 'Failed to generate recipes. Please try again.';
            let friendlyMsg: React.ReactNode = rawMsg;

            // Attempt to parse JSON error from the raw message string
            try {
                // Check for 403 Permission Denied
                if (rawMsg.includes('403') || rawMsg.includes('PERMISSION_DENIED') || rawMsg.includes('The caller does not have permission')) {
                     friendlyMsg = (
                        <div>
                            <strong>Access Denied (403):</strong> The API Key is valid, but the project does not have permission.
                            <ul className="list-disc list-inside mt-2 text-sm">
                                <li>Ensure <strong>"Generative Language API"</strong> is enabled in your Google Cloud Console.</li>
                                <li>Check if your API Key has <strong>HTTP Referrer restrictions</strong> blocking this domain.</li>
                            </ul>
                            <a 
                                href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block mt-2 underline font-bold hover:text-red-900"
                            >
                                Enable API in Cloud Console &rarr;
                            </a>
                        </div>
                     );
                }
            } catch (parseErr) {
                // Fallback
            }

            setError(friendlyMsg);
            setIsLoading(false);
        }
    }, [selectedIngredients, selectedCuisine, selectedDiet, selectedTime, selectedLanguage, selectedImageSize]);

    return (
        <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
            <Header onShowFavorites={() => setIsFavoritesModalOpen(true)} />
            <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <FilterPanel
                        ingredientsData={INGREDIENTS}
                        cuisines={CUISINES}
                        diets={DIETS}
                        cookingTimes={COOKING_TIMES}
                        languages={LANGUAGES}
                        selectedIngredients={selectedIngredients}
                        setSelectedIngredients={setSelectedIngredients}
                        selectedCuisine={selectedCuisine}
                        setSelectedCuisine={setSelectedCuisine}
                        selectedDiet={selectedDiet}
                        setSelectedDiet={setSelectedDiet}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        onGenerate={handleGenerateRecipes}
                        isLoading={isLoading}
                        imageSizes={IMAGE_SIZES}
                        selectedImageSize={selectedImageSize}
                        setSelectedImageSize={setSelectedImageSize}
                    />
                </div>
                <div className="lg:col-span-8 xl:col-span-9">
                    {isLoading && <LoadingSpinner />}
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm" role="alert">
                        <div className="flex items-center gap-2 mb-1">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                             <strong className="font-bold">Error</strong>
                        </div>
                        <div className="block sm:inline">{error}</div>
                    </div>}
                    
                    {!isLoading && !hasSearched && !error && (
                        <WelcomeScreen />
                    )}

                    {!isLoading && hasSearched && recipes.length === 0 && !error && (
                        <NoResults />
                    )}

                    {recommendations && (
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-r-lg shadow-md" role="alert">
                            <p className="font-bold">Smart Suggestions</p>
                            <p>{recommendations}</p>
                        </div>
                    )}
                    
                    {recipes.length > 0 && (
                        <RecipeList recipes={recipes} onSelectRecipe={setSelectedRecipe} />
                    )}
                </div>
            </main>

            {selectedRecipe && !isCookingMode && (
                <RecipeModal 
                    recipe={selectedRecipe} 
                    onClose={() => setSelectedRecipe(null)}
                    onStartCooking={() => setIsCookingMode(true)}
                    isFavorite={favorites.some(fav => fav.recipeName === selectedRecipe.recipeName)}
                    onToggleFavorite={toggleFavorite}
                />
            )}
            
            {selectedRecipe && isCookingMode && (
                <CookingModeModal 
                    recipe={selectedRecipe} 
                    onClose={() => {
                        setIsCookingMode(false);
                        setSelectedRecipe(null);
                    }} 
                />
            )}

            {isFavoritesModalOpen && (
                <FavoritesModal
                    favorites={favorites}
                    onClose={() => setIsFavoritesModalOpen(false)}
                    onSelectRecipe={(recipe) => {
                        setIsFavoritesModalOpen(false);
                        setSelectedRecipe(recipe);
                    }}
                    onRemoveFavorite={toggleFavorite}
                />
            )}
        </div>
    );
};

export default App;