import { ITabOption } from "../../../hooks";

export const UserViewerTab = {
  DESCRIPTION: 0,
  FOOD: 1,
  PLACE: 2,
  SUBCRIBED: 3,
} as const;

export type UserViewerTab = (typeof UserViewerTab)[keyof typeof UserViewerTab];

export const userViewerTabs: ITabOption[] = [
  {
    query: "desciption",
    value: UserViewerTab.DESCRIPTION,
  },
  {
    query: "food",
    value: UserViewerTab.FOOD,
  },
  {
    query: "place",
    value: UserViewerTab.PLACE,
  },
  {
    query: "subcribed",
    value: UserViewerTab.SUBCRIBED,
  },
];
