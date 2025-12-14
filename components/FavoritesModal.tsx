
import React from 'react';
import type { Recipe } from '../types';

interface FavoritesModalProps {
    favorites: Recipe[];
    onClose: () => void;
    onSelectRecipe: (recipe: Recipe) => void;
    onRemoveFavorite: (recipe: Recipe) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ favorites, onClose, onSelectRecipe, onRemoveFavorite }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="favorites-modal-title">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 id="favorites-modal-title" className="text-3xl font-bold font-serif text-orange-600">Favorite Recipes</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {favorites.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">You haven't saved any favorite recipes yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {favorites.map(recipe => (
                                <li key={recipe.recipeName} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{recipe.recipeName}</h3>
                                        <p className="text-sm text-gray-500">{recipe.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onSelectRecipe(recipe)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">View</button>
                                        <button onClick={() => onRemoveFavorite(recipe)} className="text-red-500 hover:text-red-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                 <div className="p-4 border-t mt-auto bg-gray-50 rounded-b-2xl flex justify-end">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};