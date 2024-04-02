import { ITabOption } from "../../hooks";

export const homeTabs = {
  ALL: 0,
  REGISTED: 1,
  AROUND: 2,
  SUGGESTED: 3,
} as const;

export type HomeTab = (typeof homeTabs)[keyof typeof homeTabs];

export const homeTabOptions: ITabOption[] = [
  {
    query: "all",
    value: homeTabs.ALL,
  },
  {
    query: "registed",
    value: homeTabs.REGISTED,
  },
  {
    query: "around",
    value: homeTabs.AROUND,
  },
  {
    query: "suggested",
    value: homeTabs.SUGGESTED,
  },
];
