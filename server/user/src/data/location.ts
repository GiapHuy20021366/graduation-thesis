import { ICoordinates } from "./coordinates";

export interface ILocation {
  name: string;
  coordinates: ICoordinates;
  two_array?: number[];
}
