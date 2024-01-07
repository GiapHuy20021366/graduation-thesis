import { ICoordinates } from "./coordinates";

export const toDistance = (pos1: ICoordinates, pos2?: ICoordinates): number => {
    if (pos2 == null) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    pos2 = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                },
                (error: GeolocationPositionError) => {
                    console.log(error);
                }
            );
        }
    }

    if (pos2 == null) return 0;

    const { lat: lat1, lng: lon1 } = pos1;
    const { lat: lat2, lng: lon2 } = pos2!;
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const roundedDistance = Math.round(distance * 1000) / 1000;

    return roundedDistance;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}