
import React, { useState } from 'react';
import type { Recipe } from '../types';

interface CookingModeModalProps {
    recipe: Recipe;
    onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = recipe.cookingSteps;

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="cooking-mode-title">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl text-center p-8 relative flex flex-col">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                <h2 id="cooking-mode-title" className="text-3xl font-bold font-serif text-orange-600 mb-4">Cooking Mode</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-8">{recipe.recipeName}</h3>

                <div className="flex-grow flex items-center justify-center min-h-[200px]">
                    <div>
                        <p className="text-gray-500 font-medium mb-2">Step {currentStep + 1} of {steps.length}</p>
                        <p className="text-3xl lg:text-4xl font-medium text-gray-800 leading-snug">{steps[currentStep]}</p>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-between items-center">
                    <button 
                        onClick={prevStep} 
                        disabled={currentStep === 0}
                        className="bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {steps.map((_, index) => (
                            <div key={index} className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        ))}
                    </div>
                    {currentStep < steps.length - 1 ? (
                        <button 
                            onClick={nextStep} 
                            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            onClick={onClose} 
                            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                        >
                            Finish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};