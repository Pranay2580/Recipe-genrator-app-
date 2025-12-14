
export interface NutritionalInfo {
    calories?: string;
    protein?: string;
    carbs?: string;
    fats?: string;
}

export interface Recipe {
    recipeName: string;
    description: string;
    requiredIngredients: string[];
    cookingSteps: string[];
    estimatedTime: string;
    difficultyLevel: string;
    servingSize: string;
    optionalVariations: string[];
    nutritionalInfo?: NutritionalInfo;
    shoppingList: string[];
    imageUrl?: string;
    drinkPairing?: string;
}