import { ITabOption } from "../../../hooks";

export const PlaceViewerTab = {
  DESCRIPTION: 0,
  SUBCRIBED: 1,
  FOOD: 2,
} as const;

export type PlaceViewerTab =
  (typeof PlaceViewerTab)[keyof typeof PlaceViewerTab];

export const placeViewerTabs: ITabOption[] = [
  {
    query: "desciption",
    value: PlaceViewerTab.DESCRIPTION,
  },
  {
    query: "subcribed",
    value: PlaceViewerTab.SUBCRIBED,
  },
  {
    query: "food",
    value: PlaceViewerTab.FOOD,
  },
];
