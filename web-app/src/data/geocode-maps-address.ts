export interface GeoCodeMapsAddress {
    state: string;
    ISO: string;
    country: string;
    countryCode: string;
}

export interface GeoCodeMapsData {
    placeId: number;
    displayName: string;
    lat: number;
    lng: number;
    address: GeoCodeMapsAddress;
}