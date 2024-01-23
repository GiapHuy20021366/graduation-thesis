import FoodSeachHistory from "../db/model/food-search-history";
import {
  IFoodSearchParams,
  IHistorySearchParams,
  IPagination,
  InternalError,
} from "../data";

export const getQueryHistoryByUserId = async (
  userId: string,
  pagination?: IPagination
): Promise<string[]> => {
  if (pagination == null) {
    pagination = {
      skip: 0,
      limit: 24,
    };
  }
  const result = await FoodSeachHistory.find({
    userId: userId,
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();

  if (result == null) {
    throw new InternalError();
  }
  return result.map((history) => history.params.query);
};

interface ISearchOnQueryRecord {
  userId: string;
  query: string;
}

export const searchHistory = async (
  params: IHistorySearchParams
): Promise<ISearchOnQueryRecord[]> => {
  const { users, query, pagination } = params;
  const skip = pagination?.skip ?? 0;
  const limit = pagination?.limit ?? 24;

  const options: any = query
    ? {
        $text: {
          $search: query,
        },
      }
    : {};
  const meta: any = query
    ? {
        score: {
          $meta: "textScore",
        },
      }
    : {};

  const sort: any = query
    ? {
        score: { $meta: "textScore" },
      }
    : {};

  if (users != null && users.length > 0) {
    options["userId"] = {
      $in: users,
    };
  }
  const result = await FoodSeachHistory.find(options, meta)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();

  if (result == null) {
    throw new InternalError();
  }

  return result.map((history) => ({
    userId: history.userId,
    query: history.params.query,
  }));
};

export const saveSearchHistory = (
  userId: string,
  params: IFoodSearchParams
): void => {
  const record = new FoodSeachHistory({
    userId: userId,
    params: {
      ...params,
      query: params.query ?? "",
    },
  });
  record.save();
};
