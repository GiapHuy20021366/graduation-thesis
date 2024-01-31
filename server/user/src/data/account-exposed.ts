import { ILocation } from "./location";

export interface AccountExposed {
  id_: string;
  email: string;
  firstName: string;
  lastName: string;
  titles?: string[];
  avatar?: string;
  token: string;
  location?: ILocation;
}
