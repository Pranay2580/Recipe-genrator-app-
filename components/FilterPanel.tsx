
import React, { useState } from 'react';

interface FilterPanelProps {
    ingredientsData: { [key: string]: string[] };
    cuisines: string[];
    diets: string[];
    cookingTimes: string[];
    languages: string[];
    selectedIngredients: string[];
    setSelectedIngredients: (ingredients: string[]) => void;
    selectedCuisine: string;
    setSelectedCuisine: (cuisine: string) => void;
    selectedDiet: string;
    setSelectedDiet: (diet: string) => void;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
    selectedLanguage: string;
    setSelectedLanguage: (language: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    imageSizes?: string[];
    selectedImageSize?: string;
    setSelectedImageSize?: (size: string) => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode; headerContent?: React.ReactNode }> = ({ title, children, headerContent }) => (
    <div className="mb-6">
        <div className="flex justify-between items-center mb-3 border-b-2 border-orange-200 pb-2">
            <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
            {headerContent}
        </div>
        {children}
    </div>
);

export const FilterPanel: React.FC<FilterPanelProps> = ({
    ingredientsData, cuisines, diets, cookingTimes, languages,
    selectedIngredients, setSelectedIngredients,
    selectedCuisine, setSelectedCuisine,
    selectedDiet, setSelectedDiet,
    selectedTime, setSelectedTime,
    selectedLanguage, setSelectedLanguage,
    onGenerate, isLoading,
    imageSizes, selectedImageSize, setSelectedImageSize
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleIngredientToggle = (ingredient: string) => {
        const newSelection = selectedIngredients.includes(ingredient)
            ? selectedIngredients.filter(i => i !== ingredient)
            : [...selectedIngredients, ingredient];
        setSelectedIngredients(newSelection);
    };
    
    const handleAddCustom = () => {
        const term = searchTerm.trim();
        if (!term) return;
        
        // Capitalize first letter for consistency
        const formattedTerm = term.charAt(0).toUpperCase() + term.slice(1);
        
        if (!selectedIngredients.includes(formattedTerm)) {
            setSelectedIngredients([...selectedIngredients, formattedTerm]);
        }
        setSearchTerm('');
    };

    // FIX: Replaced Object.entries with Object.keys to fix type inference issue on `ingredients`.
    const filteredIngredients = Object.keys(ingredientsData).map((category) => {
        const ingredients = ingredientsData[category];
        const filtered = ingredients.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
        return { category, ingredients: filtered };
    }).filter(group => group.ingredients.length > 0);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full sticky top-8 flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden">
            <h2 className="text-3xl font-bold font-serif text-orange-600 mb-6 flex-shrink-0">Your Kitchen</h2>
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <FilterSection 
                    title="Ingredients"
                    headerContent={
                        selectedIngredients.length > 0 && (
                            <button 
                                onClick={() => setSelectedIngredients([])}
                                className="text-sm font-semibold text-orange-600 hover:text-orange-800 transition"
                            >
                                Clear All
                            </button>
                        )
                    }
                >
                    {/* Selected Ingredients Chips */}
                    {selectedIngredients.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                             {selectedIngredients.map(ing => (
                                <button
                                    key={ing}
                                    onClick={() => handleIngredientToggle(ing)}
                                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition group"
                                    title="Click to remove"
                                >
                                    {ing}
                                    <span className="text-orange-400 group-hover:text-orange-600 ml-1">×</span>
                                </button>
                            ))}
                        </div>
                    )}

                     <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Search or add (e.g. Atta)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                             onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddCustom();
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                        />
                        <button
                            onClick={handleAddCustom}
                            disabled={!searchTerm.trim()}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
                        >
                            Add
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-2">
                        {filteredIngredients.length === 0 && searchTerm ? (
                             <div className="text-center py-4 text-gray-500">
                                 <p className="text-sm">"{searchTerm}" not in list.</p>
                                 <button onClick={handleAddCustom} className="text-orange-600 hover:underline font-medium text-sm mt-1">
                                     Add "{searchTerm}" manually?
                                 </button>
                             </div>
                        ) : (
                            filteredIngredients.map(({category, ingredients}) => (
                                <div key={category} className="mb-3">
                                    <h4 className="font-semibold text-gray-600 mb-2 text-xs uppercase tracking-wider">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {ingredients.map(ingredient => (
                                            <button
                                                key={ingredient}
                                                onClick={() => handleIngredientToggle(ingredient)}
                                                className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${
                                                    selectedIngredients.includes(ingredient)
                                                        ? 'bg-orange-500 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {ingredient}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </FilterSection>

                <FilterSection title="Preferences">
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <select id="language-select" value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition">
                                {languages.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cuisine-select" className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                            <select id="cuisine-select" value={selectedCuisine} onChange={e => setSelectedCuisine(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition">
                                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="diet-select" className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
                            <select id="diet-select" value={selectedDiet} onChange={e => setSelectedDiet(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition">
                                {diets.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="time-select" className="block text-sm font-medium text-gray-700 mb-1">Cooking Time</label>
                            <select id="time-select" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition">
                                {cookingTimes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        {imageSizes && setSelectedImageSize && (
                            <div>
                                <label htmlFor="image-size-select" className="block text-sm font-medium text-gray-700 mb-1">Image Quality</label>
                                <select id="image-size-select" value={selectedImageSize} onChange={e => setSelectedImageSize(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition">
                                    {imageSizes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </FilterSection>
            </div>

            <button
                onClick={onGenerate}
                disabled={isLoading || selectedIngredients.length === 0}
                className="w-full mt-4 flex-shrink-0 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    'Find Recipes'
                )}
            </button>
        </div>
    );
};