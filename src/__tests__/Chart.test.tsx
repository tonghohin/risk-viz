import { render, screen, fireEvent } from "@testing-library/react";
import Chart from "@/components/Chart";
import Data from "@/interfaces/Data";

const MOCK_DATA: Data[] = [
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0.5, Year: "2030" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0.5, Year: "2040" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 1, Year: "2050" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0, Year: "2060" },
    { "Asset Name": "This is an asset", "Business Category": "This is a business", Lat: 90, Long: 32, "Risk Factors": "Earthquake", "Risk Rating": 0, Year: "2070" }
];

describe("testing Chart", () => {
    test("filter select is on the screen", () => {
        render(<Chart data={MOCK_DATA} selectedLocation={[100, 20]} />);
        const filterText = screen.getByText("Choose a Filter");
        // screen.debug(filterText);
        expect(filterText).toBeInTheDocument();
    });
});
