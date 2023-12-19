export const DurationType = {
    DAY: "DAYS",
    HOUR: "HOUR",
    UNKNOWN: "UNKNOWN"
} as const;

export type DurationType = typeof DurationType[keyof typeof DurationType];