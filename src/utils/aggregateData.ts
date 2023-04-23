import Data from "../interfaces/Data";
import { Position } from "geojson";

export default function aggregateData(data: Data[], option: string, filter: keyof Data, selectedLocation?: Position) {
    const aggregatedDataMemo = { 2030: { rating: 0, count: 0 }, 2040: { rating: 0, count: 0 }, 2050: { rating: 0, count: 0 }, 2060: { rating: 0, count: 0 }, 2070: { rating: 0, count: 0 } };

    if (selectedLocation) {
        data.forEach((obj) => {
            if (obj.Lat === selectedLocation[1] && obj.Long === selectedLocation[0]) {
                aggregatedDataMemo[obj["Year"]].rating += obj["Risk Rating"];
                aggregatedDataMemo[obj["Year"]].count++;
            }
        });
    } else {
        data.forEach((obj) => {
            if (obj[filter] === option) {
                aggregatedDataMemo[obj["Year"]].rating += obj["Risk Rating"];
                aggregatedDataMemo[obj["Year"]].count++;
            }
        });
    }

    const aggregatedData: number[] = [];
    for (const memo of Object.values(aggregatedDataMemo)) {
        aggregatedData.push(memo.rating / memo.count);
    }

    return aggregatedData;
}
