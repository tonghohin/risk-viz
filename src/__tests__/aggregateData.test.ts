import aggregateData from "@/utils/aggregateData";
import Data from "@/interfaces/Data";

const MOCK_DATA: Data[] = [
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0.5, Year: "2030" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0.5, Year: "2040" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 1, Year: "2050" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0, Year: "2060" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0, Year: "2070" }
];

describe("testing aggregateData function", () => {
    test("correct aggregation", () => {
        expect(aggregateData(MOCK_DATA, "This is an asset", "Asset Name")).toEqual([0.5, 0.5, 1, 0, 0]);
    });
});
