export const foodErrorTarget = {
    // define later
} as const;

export type FoodErrorTarget = typeof foodErrorTarget[keyof typeof foodErrorTarget];

export const foodErrorReason = {
    // define later
} as const;

export type FoodErrorReason =
    (typeof foodErrorReason)[keyof typeof foodErrorReason];
