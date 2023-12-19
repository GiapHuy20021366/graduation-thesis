export const UnitType = {
    KILOGAM: "KILOGAM",
    GAM: "GAM",
    METER: "METER",
    CENTIMETER: "CENTIMETER",
    POUND: "POUND",
    OUNCE: "OUNCE",
    PIECE: "PIECE",
    UNKNOWN: "UNKNOWN"
}

export type UnitType = typeof UnitType[keyof typeof UnitType];