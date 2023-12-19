export const FoodCategory = {
    VEGETABLES: "VEGETABLES",
    FRUITS: "FRUITS",
    GAINS_AND_CEREALS: "GAINS_AND_CEREALS",
    ANIMAL_PRODUCT: "ANIMAL_PRODUCT",
    PROCESSED_FOODS: "PROCESSED_FOODS",
    SALADS: "SALADS",
    BEVERAGES: "BEVERAGES",
    SEAFOOD: "SEAFOOD"
}

export type FoodCategory = typeof FoodCategory[keyof typeof FoodCategory];