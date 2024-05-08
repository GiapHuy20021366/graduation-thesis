import { useEffect, useState } from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";

export interface ITabOption {
  query?: string;
  value: number;
  url?: string;
}

type TabResolver = (location: Location) => number | string;

export interface ITabNavigateOptions {
  tabOptions?: ITabOption[];
  resolver?: TabResolver;
}

export const defaultResolver = (
  location: Location,
  searchquery?: string
): number | string => {
  if (searchquery == null) {
    searchquery = "tab";
  }
  const params = toParams(location.search);
  const tabQuery = params[searchquery];
  if (tabQuery) return tabQuery;
  return 0;
};

export interface ITabNavigateStates {
  tab: number | null;
  setTab: (tab: number) => void;
}

export const toSearchUrl = (
  path: string,
  params: { [key: string]: string }
): string => {
  let result = path;
  let join = "?";
  Object.entries(params).forEach(([key, val]) => {
    result += `${join}${key}=${val}`;
    join = "&";
  });
  return result;
};

export const toParams = (search: string): { [key: string]: string } => {
  const result: { [key: string]: string } = {};
  const queryParams = new URLSearchParams(search);
  queryParams.forEach((val, key) => (result[key] = val));
  return result;
};

export const toTabValue = (
  location: Location<any>,
  tabOptions?: ITabOption[],
  resolver?: TabResolver
): number => {
  tabOptions ??= [];
  resolver ??= defaultResolver;

  const resolveValue = resolver(location);
  if (typeof resolveValue === "string") {
    const tabIndex = tabOptions.findIndex(
      (option) => option.query === resolveValue
    );
    if (tabIndex !== -1) {
      const tabValue = tabOptions[tabIndex].value;
      return tabValue;
    }
  } else {
    return resolveValue;
  }
  return 0;
};

export function useTabNavigate(
  options?: ITabNavigateOptions
): ITabNavigateStates {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState<number>(
    toTabValue(location, options?.tabOptions, options?.resolver)
  );

  useEffect(() => {
    const tab = toTabValue(location, options?.tabOptions, options?.resolver);
    if (tab !== tabValue) {
      setTabValue(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const setTab = (tabValue: number) => {
    const tabOptions = options?.tabOptions ?? [];
    const tabIndex = tabOptions.findIndex(
      (option) => option.value === tabValue
    );
    if (tabIndex !== -1) {
      const tabQuery = tabOptions[tabIndex].query;
      //  url direct
      if (tabQuery == null) {
        const tabUrl = tabOptions[tabIndex].url;
        if (tabUrl) {
          navigate(tabUrl);
        }
      } else {
        const pathname = location.pathname;
        const queryParams = toParams(location.search);
        const url = toSearchUrl(pathname, { ...queryParams, tab: tabQuery });
        navigate(url, { replace: true });
      }
    }
  };

  return {
    tab: tabValue,
    setTab: setTab,
  };
}
