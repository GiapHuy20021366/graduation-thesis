import { ImageRourceType } from "./image-source-type";

export interface IImage {
    md5: string;
    refs: number;
    publicId: string;
    width: number;
    height: number;
    format: string;
    resourceType: ImageRourceType;
    createdAt: string;
    type: string;
    url: string;
    secureUrl: string;
    exposedName: string;
    bytes: number;
}