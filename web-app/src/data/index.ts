export { mapIcons } from "./map-icons";
export { type ResponseErrorLike } from "./response-error-like";
export { type ResponseLike } from "./response-like";
export {
    userErrorTarget,
    type UserErrorTarget,
    userErrorReason,
    type UserErrorReason
} from "./user-error";
export {
    foodErrorTarget,
    type FoodErrorTarget,
    foodErrorReason,
    type FoodErrorReason
} from "./food-error";
export {
    type IImageExposed
} from "./image-exposed";
export {
    type IAuthInfo
} from "./auth-info";
export {
    DurationType,
} from "./duration-type";
export {
    type ICoordinates
} from "./coordinates";
export {
    UnitType
} from "./unit-type";
export {
    QuantityType,
    toQuantityLevel,
    toQuantityType
} from "./quantity-type";
export {
    FoodCategory,
    randomCategories
} from "./food-category";
export {
    type IFoodUploadData,
    type IFoodUpLoadLocation
} from "./food-upload-data";
export {
    type IFoodSearchInfo,
    fakeOneFoodSearch
} from "./food-search-info";
export {
    type GeoCodeMapsAddress,
    type GeoCodeMapsData
} from "./geocode-maps-address";

export {
    convertDateToString,
    convertStringToDate,
    type TimeStamp,
    toNextLunch,
    toNextMidnight,
    toTime,
    toTimeInfo
} from "./date-util";