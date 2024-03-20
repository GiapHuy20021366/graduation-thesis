import { isAllObjectId, isObjectId } from "./data-validate";

export interface IIncludeAndExclude<Include = string, Exclude = string> {
  include?: Include | Include[];
  exclude?: Exclude | Exclude[];
}

export const toIncludeAndExclude = (
  value: any
): IIncludeAndExclude<string, string> | undefined => {
  if (typeof value !== "object") return;
  const result: IIncludeAndExclude<string, string> = {};
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

export const toIncludeAndExcludeQueryOptions = (
  value?: IIncludeAndExclude
): object | null => {
  if (value == null) return null;
  const options: any = {};
  const { exclude, include } = value;
  if (exclude != null) {
    if (typeof exclude === "string") {
      options.$ne = exclude;
    } else if (Array.isArray(exclude)) {
      options.$nin = exclude;
    }
  }
  if (include) {
    if (typeof include === "string") {
      options.$eq = include;
    } else if (Array.isArray(include)) {
      options.$in = include;
    }
  }
  if (Object.keys(options).length > 0) {
    return options;
  } else {
    return null;
  }
};
