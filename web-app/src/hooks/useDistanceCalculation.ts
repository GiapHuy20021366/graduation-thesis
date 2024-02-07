import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ILocation, toDistance } from "../data";

interface IDistanceCalculationProps {
  homeLocation?: ILocation;
  currentLocation?: ILocation;
  targetLocation?: ILocation;
}

interface IDistanceCalculationStates {
  homeLocation?: ILocation;
  currentLocation?: ILocation;
  targetLocation?: ILocation;

  setHomeLocation: Dispatch<SetStateAction<ILocation | undefined>>;
  setCurrentLocation: Dispatch<SetStateAction<ILocation | undefined>>;
  setTargetLocation: Dispatch<SetStateAction<ILocation | undefined>>;

  homeToTartgetDistance?: number; // km
  currentToTargetDistance?: number; // km
}

const toLocalDistance = (
  location1?: ILocation,
  location2?: ILocation
): number | undefined => {
  if (location1?.coordinates == null || location2?.coordinates == null) {
    return;
  }

  return toDistance(location1.coordinates, location2.coordinates);
};

export function useDistanceCalculation(
  props?: IDistanceCalculationProps
): IDistanceCalculationStates {
  const [homeLocation, setHomeLocation] = useState<ILocation | undefined>(
    props?.homeLocation
  );
  const [currentLocation, setCurrentLocation] = useState<ILocation | undefined>(
    props?.currentLocation
  );
  const [targetLocation, setTargetLocation] = useState<ILocation | undefined>(
    props?.targetLocation
  );

  const homeToTartgetDistance = toLocalDistance(homeLocation, targetLocation);
  const currentToTargetDistance = toLocalDistance(
    currentLocation,
    targetLocation
  );

  useEffect(() => {
    if (currentLocation != null) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (currentLocation == null) {
            setCurrentLocation({
              name: "",
              coordinates: pos,
            });
          }
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    }
  }, [currentLocation]);

  return {
    setHomeLocation,
    setCurrentLocation,
    setTargetLocation,
    homeLocation,
    currentLocation,
    targetLocation,
    homeToTartgetDistance,
    currentToTargetDistance,
  };
}
