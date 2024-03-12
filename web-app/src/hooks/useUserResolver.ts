import { useAuthContext } from ".";
import { userFetcher } from "../api";
import { IUserExposedSimple } from "../data";
import { useAppCacheContext } from "./useAppCacheContext";

interface IUserResolverState {
  get: (userId: string, fn?: (user: IUserExposedSimple) => void) => void;
  getAll: (
    userIds: string[],
    fn?: (users: IUserExposedSimple[]) => void
  ) => void;
  getAsynch: (userId: string) => IUserExposedSimple | undefined;
  getAllAsynch: (userIds: string[]) => IUserExposedSimple[];
  getDict: () => Record<string, IUserExposedSimple>;
}

const USER_CACHE = "USERS";

/**
 * A hook for get user information
 * Use app cache to save user and fetch if not existed
 */
export const useUserResolver = (): IUserResolverState => {
  const appCache = useAppCacheContext();
  const { getOrCreate } = appCache;
  const authContext = useAuthContext();
  const auth = authContext.auth;

  const get = (
    userId: string,
    fn?: (user: IUserExposedSimple) => void
  ): void => {
    const usersDict = getOrCreate<Record<string, IUserExposedSimple>>(
      USER_CACHE,
      {}
    );

    const cacheUser = usersDict[userId];
    if (cacheUser == null) {
      // Fetch user
      // Save cache
    } else {
      if (fn) {
        fn(cacheUser);
      }
    }
  };

  const getAll = (
    userIds: string[],
    fn?: (users: IUserExposedSimple[]) => void
  ): void => {
    const usersDict = getOrCreate<Record<string, IUserExposedSimple>>(
      USER_CACHE,
      {}
    );
    const existseds: IUserExposedSimple[] = [];
    const notExisteds: string[] = [];
    userIds.forEach((userId) => {
      const userCache = usersDict[userId];
      if (userCache != null) {
        existseds.push(userCache);
      } else {
        notExisteds.push(userId);
      }
    });
    if (0 < notExisteds.length) {
      // Fetch users
      if (auth != null) {
        Promise.all(
          notExisteds.map((id) => {
            return userFetcher.getSimpleUser(id, auth);
          })
        ).then((responses) => {
          const users: IUserExposedSimple[] = [];
          responses.forEach((res) => {
            const user = res.data;
            if (user) {
              users.push(user);
            }
          });

          //   Save and callback
          users.forEach((user) => (usersDict[user._id] = user));
          if (fn) {
            fn([...existseds, ...users]);
          }
        });
      } else {
        if (fn) {
          fn(existseds);
        }
      }
    } else {
      if (fn) {
        fn(existseds);
      }
    }
  };

  const getAsynch = (userId: string): IUserExposedSimple | undefined => {
    const usersDict = getOrCreate<Record<string, IUserExposedSimple>>(
      USER_CACHE,
      {}
    );
    return usersDict[userId];
  };

  const getAllAsynch = (userIds: string[]): IUserExposedSimple[] => {
    const usersDict = getOrCreate<Record<string, IUserExposedSimple>>(
      USER_CACHE,
      {}
    );
    const result: IUserExposedSimple[] = [];
    userIds.forEach((userId) => {
      const user = usersDict[userId];
      if (user != null) result.push(user);
    });
    return result;
  };

  const getDict = (): Record<string, IUserExposedSimple> => {
    return getOrCreate<Record<string, IUserExposedSimple>>(USER_CACHE, {});
  };

  return { get, getAll, getAllAsynch, getAsynch, getDict };
};
