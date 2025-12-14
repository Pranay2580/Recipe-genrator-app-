
import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
    recipes: Recipe[];
    onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe }) => {
    return (
        <div>
            <h2 className="text-4xl font-bold font-serif text-gray-800 mb-6">Recipe Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                    <RecipeCard key={recipe.recipeName + index} recipe={recipe} onSelect={() => onSelectRecipe(recipe)} />
                ))}
            </div>
        </div>
    );
};