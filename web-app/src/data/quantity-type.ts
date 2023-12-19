export const QuantityType = {
    PRETTY_GOOD: "PRETTY_GOOD",
    TOTAL_GOOD: "TOTAL_GOOD",
    SEEM_GOOD: "SEEM_GOOD",
    USABLE: "USABLE",
    SEEM_USABLE: "SEEM_USABLE",
    UNKNOWN: "UNKNOWN"
}

export type QuantityType = typeof QuantityType[keyof typeof QuantityType];

export const toQuantityLevel = (type: QuantityType): number => {
    switch (type) {
        case QuantityType.SEEM_USABLE: return 1;
        case QuantityType.USABLE: return 2;
        case QuantityType.SEEM_GOOD: return 3;
        case QuantityType.TOTAL_GOOD: return 4;
        case QuantityType.PRETTY_GOOD: return 5;
    }
    return -1;
}

export const toQuantityType = (level: number): QuantityType => {
    switch (level) {
        case 1: return QuantityType.SEEM_USABLE;
        case 2: return QuantityType.USABLE;
        case 3: return QuantityType.SEEM_GOOD;
        case 4: return QuantityType.TOTAL_GOOD;
        case 5: return QuantityType.PRETTY_GOOD;
    }
    return QuantityType.UNKNOWN;
}