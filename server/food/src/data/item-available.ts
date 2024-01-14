export const ItemAvailable = {
    ALL: "ALL",
    AVAILABLE_ONLY: "AVAILABLE_ONLY",
    JUST_GONE: "JUST_GONE"
} as const;

export type ItemAvailable = typeof ItemAvailable[keyof typeof ItemAvailable];