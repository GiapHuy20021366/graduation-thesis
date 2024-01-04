export const DurationType = {
    ONE_DAY: "ONE_DAY",
    TWO_DAYS: "TWO_DAYS",
    THREE_DAYS: "THREE_DAYS",
    UNTIL_MIDNIGHT: "UTIL_MIDNIGHT",
    CUSTOM: "CUSTOM",
    UNKNOWN: "UNKNOWN",
    UNTIL_LUNCH: "UTIL_LUNCH"
} as const;

export type DurationType = typeof DurationType[keyof typeof DurationType];