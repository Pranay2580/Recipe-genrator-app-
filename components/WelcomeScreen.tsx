
import React from 'react';

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-lg">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-orange-600 mb-4">Welcome to Your AI Chef!</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Ready to cook something amazing? Just select the ingredients you have on the left, and I'll whip up some delicious recipe ideas for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-orange-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-xl text-orange-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">1️⃣</span> Select Ingredients
                    </h3>
                    <p className="text-gray-700">Pick what you have in your fridge and pantry.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-xl text-green-800 mb-2 flex items-center gap-2">
                         <span className="text-2xl">2️⃣</span> Add Preferences
                    </h3>
                    <p className="text-gray-700">Choose cuisine, diet, and cooking time if you like.</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-xl text-blue-800 mb-2 flex items-center gap-2">
                         <span className="text-2xl">3️⃣</span> Get Recipes!
                    </h3>
                    <p className="text-gray-700">Click "Find Recipes" to see the magic happen.</p>
                </div>
            </div>
        </div>
    );
};