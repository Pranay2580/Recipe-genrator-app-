
import React from 'react';

export const NoResults: React.FC = () => {
    return (
        <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-4xl font-bold font-serif text-orange-600 mb-4">No Recipes Found</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Sorry, the AI chef couldn't find any recipes with that combination of ingredients. Try selecting a few more items or adjusting your preferences!
            </p>
            <div className="text-6xl">🍲</div>
        </div>
    );
};