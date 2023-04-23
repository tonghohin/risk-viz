import jsonToGeoJson from "@/utils/jsonToGeoJson";
import Data from "@/interfaces/Data";

const MOCK_DATA: Data[] = [
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0.5, Year: "2030" },
    { "Asset Name": "Another asset", "Business Category": "Another business", Lat: 44, Long: 23, "Risk Factors": "Flood", "Risk Rating": 0.8, Year: "2040" }
];

describe("testing jsonToGeoJson function", () => {
    test("correct coversion to GEOJSON", () => {
        expect(jsonToGeoJson(MOCK_DATA)).toEqual({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [32, 90]
                    },
                    properties: {
                        assetName: "This is an asset",
                        businessCategory: "This is a business",
                        riskFactors: "Earthquake",
                        riskRating: 0.5,
                        year: "2030"
                    }
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [23, 44]
                    },
                    properties: {
                        assetName: "Another asset",
                        businessCategory: "Another business",
                        riskFactors: "Flood",
                        riskRating: 0.8,
                        year: "2040"
                    }
                }
            ]
        });
    });
});
