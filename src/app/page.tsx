import Loading from "@/components/Loading";
import { parse } from "csv-parse";
import fs from "fs";
import dynamic from "next/dynamic";
import Data from "../interfaces/Data";

export default async function Home() {
    const data = await getDataFromCSV();

    const Map = dynamic(() => import("../components/Map"), {
        loading: () => <Loading />,
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
        record["Risk Factors"] = JSON.parse(record["Risk Factors"] as string);
        record.Lat = Number(record.Lat);
        record.Long = Number(record.Long);
        record["Risk Rating"] = Number(record["Risk Rating"]);
        return record;
    });

    return cleanedRecords;
}
