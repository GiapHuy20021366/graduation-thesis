import { matchRoutes, useLocation } from "react-router-dom";

export const applicationPages = {
  HOME: "/home",
  USER: "/user",
  USER_VIEWER: "/user/:id",
  USER_AROUND: "/user/around",
  PLACE: "/place",
  PLACE_SEARCH: "/place/search",
  PLACE_VIEWER: "/place/:id",
  PLACE_UPDATE: "/place/update",
  FOOD: "/food",
  FOOD_SEARCH: "/food/search",
  FOOD_VIEWER: "/food/:id",
  FOOD_SHARING: "/food/sharing",
  FOOD_AROUND: "/food/around",
  SET_LOCATION: "/location",
  SETTING: "/setting",
  UNKNOWN: "/unknown",
  CONVERSATION: "/conversation",
} as const;

export type ApplicationPage =
  (typeof applicationPages)[keyof typeof applicationPages];

const routes = Object.entries(applicationPages).map(([, val]) => ({
  path: val,
}));

export interface IUsePageResolverState {
  is: (page: ApplicationPage) => boolean;
  page: ApplicationPage;
}

export const usePageResolver = (): IUsePageResolverState => {
  const location = useLocation();
  const matches = matchRoutes(routes, location);
  const matched = matches?.pop();
  return {
    is: (page) => matched?.route.path === page,
    page: matched?.route.path ?? applicationPages.UNKNOWN,
  };
};
