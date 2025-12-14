
import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
    recipe: Recipe;
    onSelect: () => void;
}

// FIX: Replaced JSX.Element with React.ReactElement to fix issue with JSX namespace not being found.
const InfoPill: React.FC<{ icon: React.ReactElement, text: string }> = ({ icon, text }) => (
    <div className="flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-full">
        {icon}
        <span className="ml-1.5">{text}</span>
    </div>
);

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
    const TimeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const LevelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6M9 19a2 2 0 002 2h2a2 2 0 002-2M9 19a2 2 0 01-2-2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2m-6 0h6" /></svg>;
    const ServingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    
    // Use generated image if available, otherwise fallback to picsum
    const displayImage = recipe.imageUrl || `https://picsum.photos/seed/${recipe.recipeName}/400/250`;

    return (
        <div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col"
            onClick={onSelect}
        >
            <div className="relative w-full h-40 bg-gray-200">
                <img 
                    src={displayImage} 
                    alt={recipe.recipeName} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-serif text-gray-800 mb-2">{recipe.recipeName}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{recipe.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                    <InfoPill icon={<TimeIcon />} text={recipe.estimatedTime} />
                    <InfoPill icon={<LevelIcon />} text={recipe.difficultyLevel} />
                    <InfoPill icon={<ServingIcon />} text={recipe.servingSize} />
                </div>
            </div>
        </div>
    );
};