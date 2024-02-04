import { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  GeoCodeMapsData,
  ICoordinates,
  ILocation,
  RequestStatus,
} from "../data";
import { geocodeMapFindAddess } from "../api";

interface IFetchLocationProps {
  defaultLocation?: ILocation;
}

export interface IFetchCallbackFn {
  onBeforeFetch?: () => any;
  onReject?: () => any;
  onError?: () => any;
  onSuccess?: (location: ILocation) => any;
}

export interface IFetchLocationStates {
  refreshStatus: () => void;
  location?: ILocation;
  fetch: (
    coordinates: ICoordinates,
    callbacks?: IFetchCallbackFn,
    force?: boolean
  ) => Promise<ILocation | undefined>;
  fetchIfNotAbsent: (
    coordinates: ICoordinates,
    callbacks?: IFetchCallbackFn,
    force?: boolean
  ) => Promise<ILocation | undefined>;
  setLocation: Dispatch<SetStateAction<ILocation | undefined>>;
  status: RequestStatus;
}

export function useFetchLocation({
  defaultLocation,
}: IFetchLocationProps): IFetchLocationStates {
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.INITIAL);
  const [location, setLocation] = useState<ILocation | undefined>(
    defaultLocation
  );
  const lastFetchTime = useRef<number>(0);

  const fetch = (
    coordinates: ICoordinates,
    callbacks?: IFetchCallbackFn,
    force?: boolean
  ): Promise<ILocation | undefined> => {
    const { onBeforeFetch, onError, onReject, onSuccess } = callbacks ?? {};
    if (Date.now() - lastFetchTime.current < 1000 && !force) {
      onReject && onReject();
      return Promise.resolve(undefined);
    }

    if (location != null) {
      const coor = location.coordinates;
      if (
        coor.lat === coordinates.lat &&
        coor.lng === coordinates.lng &&
        !force
      ) {
        onReject && onReject();
        return Promise.resolve(undefined);
      }
    }

    if (status === RequestStatus.INCHING) {
      onReject && onReject();
      return Promise.resolve(undefined);
    }

    setStatus(RequestStatus.INITIAL);

    // Before
    onBeforeFetch && onBeforeFetch();

    setStatus(RequestStatus.INCHING);

    return geocodeMapFindAddess(coordinates)
      .then((data: GeoCodeMapsData | null) => {
        if (data != null) {
          const address = data.displayName;
          const newLocation = {
            name: address,
            coordinates: coordinates,
          };
          setLocation(newLocation);

          lastFetchTime.current = Date.now();
          setStatus(RequestStatus.SUCCESS);
          onSuccess && onSuccess(newLocation);
          return Promise.resolve(newLocation);
        } else {
          setStatus(RequestStatus.ERROR);
          onError && onError();
          return Promise.resolve(undefined);
        }
      })
      .catch(() => {
        setStatus(RequestStatus.ERROR);
        onError && onError();
        return Promise.resolve(undefined);
      });
  };

  const fetchIfNotAbsent = (
    coordinates: ICoordinates,
    callbacks?: IFetchCallbackFn,
    force?: boolean
  ): Promise<ILocation | undefined> => {
    if (location != null) {
      return fetch(coordinates, callbacks, force);
    }
    return Promise.resolve(undefined);
  };

  const refreshStatus = () => {
    setStatus(RequestStatus.INITIAL);
  };

  return {
    status,
    refreshStatus,
    fetch,
    location,
    setLocation,
    fetchIfNotAbsent,
  };
}
