import {
  Actived,
  Paginationed,
  PlaceType,
  isAllNotEmptyString,
  isAllObjectId,
  isCoordinates,
  isNotEmptyString,
  isNumber,
  isObjectId,
} from ".";
import { ICoordinates } from "./coordinates";
import {
  isArrayPlaceTypes,
  isOrderState,
  isPagination,
  isPlaceType,
} from "./data-validate";
import { OrderState } from "./order-state";
import { Queried } from "./schemad";

export interface IFoodSearchPrice {
  min?: number;
  max?: number;
}

export interface IFoodSeachOrder {
  relative?: OrderState;
  distance?: OrderState;
  time?: OrderState;
  price?: OrderState;
  quantity?: OrderState;
}

export interface IFoodSearchDistance {
  max: number;
  current: ICoordinates;
}

export interface IIncludeAndExclude {
  include?: string | string[];
  exclude?: string | string[];
}

export interface IFoodSearchUser extends IIncludeAndExclude {}

export interface IFoodSearchPlace extends IIncludeAndExclude {}

export interface IFoodPostResolveBy extends IIncludeAndExclude {}

export interface IFoodSearchPopulate {
  user?: boolean;
  place?: boolean;
}

export interface IFoodSearchDuration {
  from?: number;
  to?: number;
}

export interface IFoodSearchTime {
  from?: number;
  to?: number;
}

export interface IFoodSearchQuantity {
  min?: number;
  max?: number;
}

export interface IFoodSearchParams
  extends Paginationed,
    Queried,
    Partial<Actived> {
  user?: IFoodSearchUser;
  place?: IFoodSearchPlace;
  distance?: IFoodSearchDistance;
  category?: string | string[];
  price?: IFoodSearchPrice;
  addedBy?: PlaceType | PlaceType[];
  order?: IFoodSeachOrder;
  populate?: IFoodSearchPopulate;
  resolved?: boolean;
  resolveBy?: IFoodPostResolveBy;
  time?: IFoodSearchTime;
  duration?: IFoodSearchDuration;
  quantity?: IFoodSearchQuantity;
}

export const toFoodSearchParams = (value: any): IFoodSearchParams => {
  if (typeof value !== "object") return {};
  const result: IFoodSearchParams = {};

  result.user = toIncludeAndExclude(value.user);
  result.place = toIncludeAndExclude(value.place);
  result.resolveBy = toIncludeAndExclude(value.resolveBy);

  const resolved = value.resolved;
  if (resolved == null || typeof resolved === "boolean") {
    result.resolved = resolved;
  }

  const query = value.query;
  if (typeof query === "string" && query.trim().length > 0) {
    result.query = query;
  }

  const distance = value.distance;
  if (typeof distance === "object") {
    if (isNumber(distance.max) && isCoordinates(distance.current)) {
      result.distance = distance;
    }
  }

  const category = value.category;
  if (isNotEmptyString(category)) {
    result.category = category;
  } else if (isAllNotEmptyString(category)) {
    if (category.length === 1) {
      result.category = category[0];
    } else if (category.length > 1) {
      result.category = category;
    }
  }

  const time = value.time;
  if (time != null && typeof time === "object") {
    result.time = {};
    const { from, to } = time;
    if (isNumber(from)) {
      result.time.from = from;
    }
    if (isNumber(to)) {
      result.time.to = to;
    }
  }

  const duration = value.duration;
  if (duration != null && typeof duration === "object") {
    result.duration = {};
    const { from, to } = duration;
    if (isNumber(from)) {
      result.duration.from = from;
    }
    if (isNumber(to)) {
      result.duration.to = to;
    }
  }

  const price = value.price;
  if (typeof price === "object") {
    result.price = {};
    const min = price.min;
    const max = price.max;
    if (isNumber(min)) {
      result.price.min = min;
    }
    if (isNumber(max)) {
      result.price.max = max;
    }
  }

  const quantity = value.quantity;
  if (quantity != null && typeof quantity === "object") {
    result.quantity = {};
    const { min, max } = quantity;
    if (isNumber(min)) {
      result.quantity.min = min;
      result.quantity.max = max;
    }
  }

  const addedBy = value.addedBy;
  if (isPlaceType(addedBy)) {
    result.addedBy = addedBy;
  } else if (isArrayPlaceTypes(addedBy)) {
    if (addedBy.length === 1) {
      result.addedBy = addedBy[0];
    } else if (addedBy.length > 1) {
      result.addedBy = addedBy;
    }
  }

  const active = value.active;
  if (active == null || typeof active === "boolean") {
    result.active = active;
  }

  const pagination = value.pagination;
  if (isPagination(pagination)) {
    result.pagination = pagination;
  }

  const order = value.order;
  if (typeof order === "object") {
    result.order = {};
    const relative = order.relative;
    if (isOrderState(relative) && relative !== OrderState.NONE) {
      result.order.relative = relative;
    }
    const distance = order.distance;
    if (isOrderState(distance) && distance !== OrderState.NONE) {
      result.order.distance = distance;
    }
    const price = order.price;
    if (isOrderState(price) && price !== OrderState.NONE) {
      result.order.price = price;
    }
    const time = order.time;
    if (isOrderState(time) && time !== OrderState.NONE) {
      result.order.time = time;
    }
    const quantity = order.quantity;
    if (isOrderState(quantity) && quantity !== OrderState.NONE) {
      result.order.quantity = quantity;
    }
  }

  const populate = value.populate;
  if (typeof populate === "object") {
    result.populate = {};
    const user = populate.user;
    if (user == null || typeof user === "boolean") {
      result.populate.user = user;
    }
    const place = populate.place;
    if (place == null || typeof place === "boolean") {
      result.populate.place = place;
    }
  }

  return result;
};

export const toIncludeAndExclude = (
  value: any
): IIncludeAndExclude | undefined => {
  if (typeof value !== "object") return;
  const result: IIncludeAndExclude = {};
  const include = value.include;
  if (isObjectId(include)) {
    result.include = include;
  } else if (isAllObjectId(include)) {
    if (include.length === 1) {
      result.include = include[0];
    } else if (include.length > 1) {
      result.include = include;
    }
  }
  const exclude = value.exclude;
  if (isObjectId(exclude)) {
    result.exclude = exclude;
  } else if (isAllObjectId(exclude)) {
    if (exclude.length === 1) {
      result.exclude = exclude[0];
    } else if (exclude.length > 1) {
      result.exclude = exclude;
    }
  }
  return result;
};
