export const SystemSide = {
  USER: "USER",
  PLACE: "PLACE",
} as const;

export type SystemSide = (typeof SystemSide)[keyof typeof SystemSide];
