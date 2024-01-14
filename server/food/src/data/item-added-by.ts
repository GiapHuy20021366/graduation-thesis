export const ItemAddedBy = {
    ALL: "ALL",
    PERSONAL: "PERSONAL",
    VOLUNTEER: "VOLUNTEER"
} as const;

export type ItemAddedBy = typeof ItemAddedBy[keyof typeof ItemAddedBy];