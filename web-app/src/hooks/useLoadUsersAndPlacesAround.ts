import { useState } from "react";
import {
  IUserExposedSimple,
  IPlaceExposed,
  PlaceType,
  ICoordinates,
  IUserSearchParams,
  OrderState,
  IPlaceSearchParams,
} from "../data";
import { useAuthContext } from "./useAuthContext";
import { IUseLoaderStates, useLoader } from "./useLoader";
import { userFetcher } from "../api";

interface ILoadCallbackFns {
  onSuccess?: (datas: (IUserExposedSimple | IPlaceExposed)[]) => void;
  onError?: (error: any) => void;
}

interface IUseLoadUsersAndPlacesAroundStates {
  users: IUserExposedSimple[];
  restaurants: IPlaceExposed[];
  eateries: IPlaceExposed[];
  groceries: IPlaceExposed[];
  markets: IPlaceExposed[];
  volunteers: IPlaceExposed[];
  add: (...datas: (IUserExposedSimple | IPlaceExposed)[]) => void;
  load: (
    types: PlaceType[],
    center: ICoordinates,
    maxDistance: number,
    limit: number,
    fn?: ILoadCallbackFns
  ) => void;
  loader: IUseLoaderStates;
}

interface IUseLoadUsersAndPlacesAroundProps {
  users?: IUserExposedSimple[];
  restaurants?: IPlaceExposed[];
  eateries?: IPlaceExposed[];
  groceries?: IPlaceExposed[];
  markets?: IPlaceExposed[];
  volunteers?: IPlaceExposed[];
}

export const useLoadUsersAndPlacesAround = (
  props?: IUseLoadUsersAndPlacesAroundProps
): IUseLoadUsersAndPlacesAroundStates => {
  const [users, setUsers] = useState<IUserExposedSimple[]>(props?.users ?? []);
  const [restaurants, setRestaurants] = useState<IPlaceExposed[]>(
    props?.restaurants ?? []
  );
  const [eateries, setEateries] = useState<IPlaceExposed[]>(
    props?.eateries ?? []
  );
  const [groceries, setGroceries] = useState<IPlaceExposed[]>(
    props?.groceries ?? []
  );
  const [markets, setMarkets] = useState<IPlaceExposed[]>(props?.markets ?? []);
  const [volunteers, setVolunteers] = useState<IPlaceExposed[]>(
    props?.volunteers ?? []
  );

  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const loader = useLoader();

  const add = (...datas: (IUserExposedSimple | IPlaceExposed)[]) => {
    const _users = [];
    const _restaurants = [];
    const _eateries = [];
    const _groceries = [];
    const _markets = [];
    const _volunteers = [];
    for (const d of datas) {
      if ("type" in Object.keys(d)) {
        const place = d as IPlaceExposed;
        switch (place.type) {
          case PlaceType.EATERY:
            if (eateries.findIndex((e) => e._id === place._id) === -1) {
              _eateries.push(place);
            }
            break;
          case PlaceType.RESTAURANT:
            if (restaurants.findIndex((e) => e._id === place._id) === -1) {
              _restaurants.push(place);
            }
            break;
          case PlaceType.SUPERMARKET:
            if (markets.findIndex((e) => e._id === place._id) === -1) {
              _markets.push(place);
            }
            break;
          case PlaceType.GROCERY:
            if (groceries.findIndex((e) => e._id === place._id) === -1) {
              _groceries.push(place);
            }
            break;
          case PlaceType.VOLUNTEER:
            if (volunteers.findIndex((e) => e._id === place._id) === -1) {
              _volunteers.push(place);
            }
            break;
        }
      } else {
        const user = d as IUserExposedSimple;
        if (users.findIndex((e) => e._id === user._id) === -1) {
          _users.push(user);
        }
        break;
      }
    }

    const newUsers = [...users, ..._users];
    const newRestaurants = [...restaurants, ..._restaurants];
    const newEateries = [...eateries, ..._eateries];
    const newGroceries = [...groceries, ..._groceries];
    const newMarkets = [...markets, ..._markets];
    const newVolunteers = [...volunteers, ..._volunteers];

    _users.length > 0 && setUsers(newUsers);
    _restaurants.length > 0 && setRestaurants(newRestaurants);
    _eateries.length > 0 && setEateries(newEateries);
    _groceries.length > 0 && setGroceries(newGroceries);
    _markets.length > 0 && setMarkets(newMarkets);
    _volunteers.length > 0 && setVolunteers(newVolunteers);

    return {
      users: newUsers,
      restaurants: newRestaurants,
      eateries: newEateries,
      groceries: newGroceries,
      markets: newMarkets,
      volunteers: newVolunteers,
    };
  };

  const doLoadUsers = (
    current: ICoordinates,
    maxDistance: number,
    limit: number
  ) => {
    if (account == null || auth == null) return Promise.reject();

    const params: IUserSearchParams = {
      distance: {
        max: maxDistance,
        current: current,
      },
      order: {
        distance: OrderState.INCREASE,
      },
      pagination: {
        skip: 0,
        limit: limit,
      },
    };

    return userFetcher.searchUser(params, auth).then((res) => {
      const data = res.data;
      if (data) {
        const datas = data.filter((d) => d._id !== account._id);
        return datas;
      }
      return Promise.reject();
    });
  };

  const doLoadPlaces = (
    type: PlaceType,
    current: ICoordinates,
    maxDistance: number,
    limit: number
  ) => {
    if (auth == null) return Promise.reject();

    const params: IPlaceSearchParams = {
      distance: {
        current: current,
        max: maxDistance,
      },
      pagination: {
        skip: 0,
        limit: limit,
      },
      types: [type],
      active: true,
    };

    return userFetcher.searchPlace(params, auth).then((res) => {
      const datas = res.data;
      if (datas) return datas;
      else return Promise.reject();
    });
  };

  const load = (
    types: PlaceType[],
    center: ICoordinates,
    maxDistance: number,
    limit: number,
    fn?: ILoadCallbackFns
  ) => {
    if (loader.isFetching) return;

    loader.setIsFetching(true);
    loader.setIsError(true);

    Promise.all(
      types.map((type) => {
        switch (type) {
          case PlaceType.PERSONAL:
            return doLoadUsers(center, maxDistance, limit);
          case PlaceType.EATERY:
            return doLoadPlaces(PlaceType.EATERY, center, maxDistance, limit);
          case PlaceType.RESTAURANT:
            return doLoadPlaces(
              PlaceType.RESTAURANT,
              center,
              maxDistance,
              limit
            );
          case PlaceType.SUPERMARKET:
            return doLoadPlaces(
              PlaceType.SUPERMARKET,
              center,
              maxDistance,
              limit
            );
          case PlaceType.GROCERY:
            return doLoadPlaces(PlaceType.GROCERY, center, maxDistance, limit);
          case PlaceType.VOLUNTEER:
            return doLoadPlaces(
              PlaceType.VOLUNTEER,
              center,
              maxDistance,
              limit
            );
        }
      })
    )
      .then((datas) => {
        const dd: (IUserExposedSimple | IPlaceExposed)[] = [];
        datas.forEach((d) => dd.push(...d));
        add(...dd);
        fn?.onSuccess && fn.onSuccess(dd);
      })
      .catch((err: any) => {
        loader.setIsError(true);
        fn?.onError && fn.onError(err);
      })
      .finally(() => {
        loader.setIsEnd(true);
      });
  };

  return {
    users,
    eateries,
    groceries,
    markets,
    restaurants,
    volunteers,
    add,
    loader,
    load,
  };
};
