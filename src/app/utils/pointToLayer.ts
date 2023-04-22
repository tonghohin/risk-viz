import { Feature, Point } from "geojson";
import { LatLng } from "leaflet";
import L from "leaflet";

export default function pointToLayer(feature: Feature<Point, any>, latlng: LatLng) {
    const GREEN_MARKER = L.icon({ iconUrl: "./icon-green.svg", iconSize: [40, 40], iconAnchor: [10, 25], popupAnchor: [0, 0] });
    const YELLOW_MARKER = L.icon({ iconUrl: "./icon-yellow.svg", iconSize: [40, 40], iconAnchor: [10, 25], popupAnchor: [0, 0] });
    const ORANGE_MARKER = L.icon({ iconUrl: "./icon-orange.svg", iconSize: [40, 40], iconAnchor: [10, 25], popupAnchor: [0, 0] });
    const RED_MARKER = L.icon({ iconUrl: "./icon-red.svg", iconSize: [40, 40], iconAnchor: [10, 25], popupAnchor: [0, 0] });

    if (feature.properties.riskRating <= 0.25) {
        return L.marker(latlng, { icon: GREEN_MARKER });
    } else if (feature.properties.riskRating >= 0.26 && feature.properties.riskRating <= 0.5) {
        return L.marker(latlng, { icon: YELLOW_MARKER });
    } else if (feature.properties.riskRating >= 0.51 && feature.properties.riskRating <= 0.75) {
        return L.marker(latlng, { icon: ORANGE_MARKER });
    } else {
        return L.marker(latlng, { icon: RED_MARKER });
    }
}
