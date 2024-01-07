export const FoodCategory = {
    VEGETABLES: "VEGETABLES",
    FRUITS: "FRUITS",
    GAINS_AND_CEREALS: "GAINS_AND_CEREALS",
    ANIMAL_PRODUCT: "ANIMAL_PRODUCT",
    PROCESSED_FOODS: "PROCESSED_FOODS",
    SALADS: "SALADS",
    BEVERAGES: "BEVERAGES",
    SEAFOOD: "SEAFOOD",
    EMPTY: ""
}

export type FoodCategory = typeof FoodCategory[keyof typeof FoodCategory];

export const randomCategories = (size: number): FoodCategory[] => {
    const result: FoodCategory[] = [];
    const categories = Object.values(FoodCategory);
    for (let i = 0; i < size; ++i) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const category = categories[randomIndex];
        if (!result.includes(category)) {
            result.push(category);
        }
    }
    return result;
}