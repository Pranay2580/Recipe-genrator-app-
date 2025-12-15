
export const INGREDIENTS = {
    'Vegetables': ['Potato', 'Tomato', 'Onion', 'Carrot', 'Bell Pepper', 'Spinach', 'Broccoli', 'Cauliflower', 'Garlic', 'Ginger', 'Green Chilli'],
    'Fruits': ['Lemon', 'Apple', 'Banana', 'Mango'],
    'Proteins': ['Chicken', 'Beef', 'Pork', 'Fish', 'Eggs', 'Tofu', 'Lentils', 'Chickpeas'],
    'Dairy': ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Paneer'],
    'Pantry': ['Rice', 'Pasta', 'Flour', 'Sugar', 'Salt', 'Black Pepper', 'Olive Oil', 'Vegetable Oil', 'Soy Sauce', 'Vinegar'],
    'Spices': ['Turmeric', 'Cumin', 'Coriander', 'Red Chilli Powder', 'Garam Masala', 'Oregano', 'Thyme', 'Rosemary']
};

export const CUISINES = ['Any', 'Indian', 'Chinese', 'Italian', 'Bengali', 'Thai', 'Continental', 'Mexican', 'Japanese'];
export const DIETS = ['Any', 'Veg', 'Non-veg', 'Vegan', 'High Protein', 'Low-Calorie'];
export const COOKING_TIMES = ['Any', 'Under 10 mins', 'Under 20 mins', 'Under 30 mins', 'Long recipes'];
export const LANGUAGES = ['English', 'Bengali', 'Hindi', 'Telugu', 'Tamil'];
export const IMAGE_SIZES = ['1K', '2K', '4K'];

export const SYSTEM_PROMPT = `Yo! You are Smart Recipe AI, a cool and advanced cooking assistant.
Your job is to generate recipes based on user-selected ingredients.

When a user selects ingredients, generate 3–5 recipe suggestions.

Each recipe must include:
✔ Recipe Name (recipeName) - Make it sound delicious!
✔ Short Description (description) - A tasty summary.
✔ Required Ingredients (requiredIngredients)
✔ Cooking Steps (cookingSteps)
✔ Estimated Time (estimatedTime)
✔ Difficulty Level (difficultyLevel)
✔ Serving Size (servingSize)
✔ Optional variations (optionalVariations)
✔ Nutritional Information (nutritionalInfo: calories, protein, carbs, fats)
✔ A shopping list of items NOT provided by the user (shoppingList)
✔ A Drink Pairing suggestion (drinkPairing) - Recommend a beverage that compliments this dish perfectly.

If ingredients are missing for a proper dish, use the 'recommendations' field to suggest what extra items to buy or a simpler dish that works without missing items.

Keep all explanations simple, clear, and super friendly. Feel free to start with "Yo!" or use casual language where appropriate, but keep the cooking instructions precise and safe.
Reply in the language specified in the user prompt. Default to English if not specified.
You must not generate harmful or unsafe cooking instructions.
You must respond in the specified JSON format.`;
