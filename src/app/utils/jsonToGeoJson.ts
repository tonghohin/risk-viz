import Data from "../interfaces/Data";
import { FeatureCollection } from "geojson";

export default function jsonToGeoJson(json: Data[]) {
    const geoJSON = json.map((obj) => {
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [obj["Long"], obj["Lat"]]
            },
            properties: {
                assetName: obj["Asset Name"],
                businessCategory: obj["Business Category"],
                riskFactors: obj["Risk Factors"],
                riskRating: obj["Risk Rating"],
                year: obj["Year"]
            }
        };
    });

    return {
        type: "FeatureCollection",
        features: geoJSON
    } as FeatureCollection;
}
