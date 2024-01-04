import axios from "axios";
import { GeoCodeMapsData, ICoordinates } from "../data";
import { GEOCODE_MAPS_API } from "../env";

export const geocodeMapFindAddess = async (coordinates: ICoordinates): Promise<GeoCodeMapsData | null> => {
    try {
        const res = await axios.get(
            "https://geocode.maps.co/reverse",
            {
                params: {
                    lat: coordinates.lat,
                    lon: coordinates.lng,
                    api_key: GEOCODE_MAPS_API
                },
                headers: {

                }
            },
        );
        const data = res.data;
        const address = data.address;
        return {
            placeId: data.place_id,
            address: {
                state: address.state,
                country: address.country,
                countryCode: address.country_code,
                ISO: address['ISO3166-2-lvl4']
            },
            displayName: data.display_name,
            lat: data.lat,
            lng: data.lon
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}