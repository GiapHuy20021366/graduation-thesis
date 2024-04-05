import { ICoordinates } from "./coordinates";

export interface ILocation {
  name: string;
  coordinates: ICoordinates;
}

export const isDiffLocation = (
  pos1: ICoordinates,
  pos2?: ICoordinates
): boolean => {
  if (pos2 == null) return true;
  return pos1.lat !== pos2.lat || pos1.lng !== pos2.lng;
};
