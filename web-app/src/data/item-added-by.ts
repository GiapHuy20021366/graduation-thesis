export const ItemAddedBy = {
  ALL: "ALL",
  PERSONAL: "PERSONAL",
  VOLUNTEER: "VOLUNTEER",
  PLACE: "PLACE",
} as const;

export type ItemAddedBy = (typeof ItemAddedBy)[keyof typeof ItemAddedBy];
