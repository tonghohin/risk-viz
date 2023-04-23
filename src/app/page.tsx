import fs from "fs";
import { parse } from "csv-parse";
import dynamic from "next/dynamic";
import Data from "./interfaces/Data";

export default async function Home() {
    const data = await getDataFromCSV();

    const Map = dynamic(() => import("../components/Map"), {
        loading: () => (
            <>
                <p>A map is loading...</p>
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="currentColor">
                        <path fillRule="evenodd" d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14Zm0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z" clipRule="evenodd" opacity=".2" />
                        <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7H2Z" />
                    </g>
                </svg>
            </>
        ),
        ssr: false
    });

    return <Map data={data} />;
}

async function getDataFromCSV() {
    const fileContents = await fs.promises.readFile("./public/sampleData.csv");
    const records: Data[] = await new Promise((resolve, reject) => {
        parse(fileContents, { columns: true }, (err, records) => {
            if (err) {
                reject(err);
            } else {
                resolve(records);
            }
        });
    });

    const cleanedRecords = records.map((record) => {
        record["Risk Factors"] = record["Risk Factors"].replace(/[{}"]/g, "");
        record.Lat = Number(record.Lat);
        record.Long = Number(record.Long);
        record["Risk Rating"] = Number(record["Risk Rating"]);
        return record;
    });

    return cleanedRecords;
}
