import Data from "../interfaces/Data";
import { Position } from "geojson";

export default function aggregateData(data: Data[], option: string, filter: keyof Data, selectedLocation?: Position) {
    const aggregatedDataMemo = { 2030: { rating: 0, count: 0, highestRisk: { risk: "", rating: 0 } }, 2040: { rating: 0, count: 0, highestRisk: { risk: "", rating: 0 } }, 2050: { rating: 0, count: 0, highestRisk: { risk: "", rating: 0 } }, 2060: { rating: 0, count: 0, highestRisk: { risk: "", rating: 0 } }, 2070: { rating: 0, count: 0, highestRisk: { risk: "", rating: 0 } } };

    if (selectedLocation) {
        data.forEach((obj) => {
            if (obj.Lat === selectedLocation[1] && obj.Long === selectedLocation[0]) {
                aggregatedDataMemo[obj["Year"]].rating += obj["Risk Rating"];
                aggregatedDataMemo[obj["Year"]].count++;

                const highestRiskFactor = getHighestRiskFactor(obj);

                if (highestRiskFactor.rating > aggregatedDataMemo[obj["Year"]].highestRisk.rating) {
                    aggregatedDataMemo[obj["Year"]].highestRisk.rating = highestRiskFactor.rating;
                    aggregatedDataMemo[obj["Year"]].highestRisk.risk = highestRiskFactor.risk;
                }
            }
        });
    } else {
        data.forEach((obj) => {
            if (obj[filter] === option) {
                aggregatedDataMemo[obj["Year"]].rating += obj["Risk Rating"];
                aggregatedDataMemo[obj["Year"]].count++;

                const highestRiskFactor = getHighestRiskFactor(obj);

                if (highestRiskFactor.rating > aggregatedDataMemo[obj["Year"]].highestRisk.rating) {
                    aggregatedDataMemo[obj["Year"]].highestRisk.rating = highestRiskFactor.rating;
                    aggregatedDataMemo[obj["Year"]].highestRisk.risk = highestRiskFactor.risk;
                }
            }
        });
    }

    const aggregatedData = [];
    for (const memo of Object.values(aggregatedDataMemo)) {
        aggregatedData.push({ x: 1, y: memo.rating / memo.count, highestRisk: memo.highestRisk });
    }

    return aggregatedData;
}

function getHighestRiskFactor(data: Data) {
    let highestRiskFactor = { risk: "", rating: 0 };

    for (const [key, value] of Object.entries(data["Risk Factors"])) {
        if (value > highestRiskFactor.rating) {
            highestRiskFactor.risk = key;
            highestRiskFactor.rating = value;
        }
    }

    return highestRiskFactor;
}
