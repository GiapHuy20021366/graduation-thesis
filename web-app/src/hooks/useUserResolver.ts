import { useAuthContext } from ".";
import { userFetcher } from "../api";
import { IUserInfo } from "../data";
import { useAppCacheContext } from "./useAppCacheContext";

interface IUserResolverState {
  get: (userId: string, fn?: (user: IUserInfo) => void) => void;
  getAll: (userIds: string[], fn?: (users: IUserInfo[]) => void) => void;
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

  const get = (userId: string, fn?: (user: IUserInfo) => void): void => {
    const usersDict = getOrCreate<Record<string, IUserInfo>>(USER_CACHE, {});

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
    fn?: (users: IUserInfo[]) => void
  ): void => {
    const usersDict = getOrCreate<Record<string, IUserInfo>>(USER_CACHE, {});
    const existseds: IUserInfo[] = [];
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
            return userFetcher.getUserInfo(id, auth);
          })
        ).then((responses) => {
          const users: IUserInfo[] = [];
          responses.forEach((res) => {
            const user = res.data;
            if (user) {
              users.push(user);
            }
          });

          //   Save and callback
          users.forEach((user) => (usersDict[user.id_] = user));
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
  return { get, getAll };
};
