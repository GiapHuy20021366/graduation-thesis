import { ILocation } from "./user-info";

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