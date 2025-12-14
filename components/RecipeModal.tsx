
import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ChefChat } from './ChefChat';

interface RecipeModalProps {
    recipe: Recipe;
    onClose: () => void;
    onStartCooking: () => void;
    isFavorite: boolean;
    onToggleFavorite: (recipe: Recipe) => void;
}

// FIX: Replaced JSX.Element with React.ReactElement to fix issue with JSX namespace not being found.
const DetailSection: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactElement }> = ({ title, children, icon }) => (
    <div className="mb-6">
        <h3 className="text-2xl font-semibold font-serif text-gray-800 mb-3 flex items-center gap-3">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onStartCooking, isFavorite, onToggleFavorite }) => {
    const [showChat, setShowChat] = useState(false);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
    const IngredientsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const StepsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    const VariationsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477zM12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>;
    const ShoppingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" /></svg>;
    const NutritionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

    const displayImage = recipe.imageUrl || `https://picsum.photos/seed/${recipe.recipeName}/800/400`;

    const handleShare = async () => {
        const shareText = `Check out this recipe for ${recipe.recipeName}!\n\n${recipe.description}\n\nKey Ingredients: ${recipe.requiredIngredients.slice(0, 5).join(', ')}... and more!`;
        
        try {
            await navigator.clipboard.writeText(shareText);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000);
            // Fallback for some browsers or non-secure contexts
            alert("Could not copy to clipboard. Please copy manually.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="recipe-modal-title">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
                
                {/* Main Content Area */}
                <div className="flex-grow flex flex-col overflow-hidden">
                    <div className="relative h-48 sm:h-64 flex-shrink-0">
                        <img 
                            src={displayImage} 
                            alt={recipe.recipeName} 
                            className="w-full h-full object-cover"
                        />
                        <button onClick={onClose} className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition z-10">
                            <CloseIcon />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                            <h2 id="recipe-modal-title" className="text-3xl md:text-4xl font-bold font-serif text-white drop-shadow-md">{recipe.recipeName}</h2>
                        </div>
                    </div>
                    
                    <div className="p-6 border-b flex justify-between items-start gap-4 bg-white">
                        <p className="text-gray-600 mt-1">{recipe.description}</p>
                        <div className="flex gap-2 flex-shrink-0">
                            <button 
                                onClick={handleShare}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Copy Recipe to Clipboard"
                            >
                                {copyStatus === 'copied' ? (
                                    <span className="text-xs font-bold text-green-600">Copied!</span>
                                ) : copyStatus === 'error' ? (
                                     <span className="text-xs font-bold text-red-600">Error</span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
                            <div className="bg-orange-50 p-3 rounded-lg"><span className="font-semibold">Time:</span> {recipe.estimatedTime}</div>
                            <div className="bg-orange-50 p-3 rounded-lg"><span className="font-semibold">Difficulty:</span> {recipe.difficultyLevel}</div>
                            <div className="bg-orange-50 p-3 rounded-lg"><span className="font-semibold">Serves:</span> {recipe.servingSize}</div>
                        </div>

                        {recipe.drinkPairing && (
                             <div className="mb-6 bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-start gap-3">
                                <span className="text-2xl">🍷</span>
                                <div>
                                    <h4 className="font-bold text-purple-900">Sommelier's Pick</h4>
                                    <p className="text-purple-700 text-sm">{recipe.drinkPairing}</p>
                                </div>
                             </div>
                        )}

                        <DetailSection title="Required Ingredients" icon={<IngredientsIcon />}>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 columns-2">
                                {recipe.requiredIngredients.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </DetailSection>

                        <DetailSection title="Cooking Steps" icon={<StepsIcon />}>
                            <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                {recipe.cookingSteps.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </DetailSection>
                        
                        {recipe.optionalVariations && recipe.optionalVariations.length > 0 && (
                            <DetailSection title="Variations" icon={<VariationsIcon />}>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {recipe.optionalVariations.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </DetailSection>
                        )}
                        
                        {recipe.shoppingList && recipe.shoppingList.length > 0 && (
                            <DetailSection title="Shopping List" icon={<ShoppingIcon />}>
                                <p className="text-sm text-gray-500 mb-2">Items you might need to buy:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 columns-2">
                                    {recipe.shoppingList.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </DetailSection>
                        )}

                        {recipe.nutritionalInfo && (
                            <DetailSection title="Nutritional Info" icon={<NutritionIcon />}>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    {recipe.nutritionalInfo.calories && <div className="bg-red-50 p-3 rounded-lg"><div className="font-semibold text-red-800">Calories</div><div className="text-gray-700">{recipe.nutritionalInfo.calories}</div></div>}
                                    {recipe.nutritionalInfo.protein && <div className="bg-green-50 p-3 rounded-lg"><div className="font-semibold text-green-800">Protein</div><div className="text-gray-700">{recipe.nutritionalInfo.protein}</div></div>}
                                    {recipe.nutritionalInfo.carbs && <div className="bg-blue-50 p-3 rounded-lg"><div className="font-semibold text-blue-800">Carbs</div><div className="text-gray-700">{recipe.nutritionalInfo.carbs}</div></div>}
                                    {recipe.nutritionalInfo.fats && <div className="bg-yellow-50 p-3 rounded-lg"><div className="font-semibold text-yellow-800">Fats</div><div className="text-gray-700">{recipe.nutritionalInfo.fats}</div></div>}
                                </div>
                            </DetailSection>
                        )}
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
                         <button 
                            onClick={() => setShowChat(!showChat)}
                            className="text-orange-600 font-semibold hover:text-orange-800 flex items-center gap-2 md:hidden"
                        >
                            <span className="text-xl">👨‍🍳</span> {showChat ? 'Hide Chef' : 'Ask Chef'}
                        </button>
                        
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => onToggleFavorite(recipe)} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isFavorite ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                                {isFavorite ? 'Favorited' : 'Favorite'}
                            </button>
                            <button onClick={onStartCooking} className="flex-1 sm:flex-none bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                                Start Cooking
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Section - Sidebar on Desktop, Toggle on Mobile */}
                <div className={`${showChat ? 'flex' : 'hidden'} md:flex md:w-80 border-l border-gray-200 bg-gray-50 flex-col`}>
                    <div className="p-4 border-b border-gray-200 bg-white md:bg-gray-50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">👨‍🍳</span> Ask the Chef
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Stuck? Missing something? Ask me!</p>
                    </div>
                    <div className="flex-grow p-4 overflow-hidden">
                        <ChefChat recipe={recipe} />
                    </div>
                </div>

            </div>
        </div>
    );
};