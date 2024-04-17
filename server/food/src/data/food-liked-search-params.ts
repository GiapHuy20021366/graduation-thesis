import { isNumber } from "./data-validate";
import { IIncludeAndExclude, toIncludeAndExclude } from "./food-search-params";

export interface IFoodLikedSearchParams {
  user?: IIncludeAndExclude;
  food?: IIncludeAndExclude;
  time?: {
    from?: number;
    to?: number;
  };
}

export const toFoodLikedSearchParams = (value: any) => {
  if (typeof value !== "object") return;
  const result: IFoodLikedSearchParams = {};
  result.user = toIncludeAndExclude(value.user);
  result.food = toIncludeAndExclude(value.food);

  const time = value.time;
  if (typeof time === "object") {
    const timeOpt: any = {};
    if (isNumber(time.from)) {
      timeOpt.from = time.from;
    }
    if (isNumber(time.to)) {
      timeOpt.to = time.to;
    }
    if (Object.keys(timeOpt).length > 0) {
      result.time = timeOpt;
    }
  }
  return result;
};
