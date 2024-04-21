import { ICoordinates } from "./coordinates";
import { toDistance } from "./location-util";
import {
  IPlaceExposed,
  IPlaceExposedWithRatingAndFollow,
} from "./place-exposed";

export interface IPlaceExposedCooked extends IPlaceExposedWithRatingAndFollow {
  currentDistance?: number;
  homeDistance?: number;
}

interface ICookedMateria {
  currentCoordinates?: ICoordinates;
  homeCoordinates?: ICoordinates;
}

export const toPlaceExposedCooked = (
  place: IPlaceExposed,
  materia?: ICookedMateria
): IPlaceExposedCooked => {
  const result: IPlaceExposedCooked = { ...place };
  if (materia?.currentCoordinates) {
    result.currentDistance = toDistance(
      place.location.coordinates,
      materia?.currentCoordinates
    );
  }
  if (materia?.homeCoordinates) {
    result.homeDistance = toDistance(
      place.location.coordinates,
      materia?.homeCoordinates
    );
  }

  return result;
};
