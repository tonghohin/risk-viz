"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import Data from "../interfaces/Data";
import jsonToGeoJson from "../utils/jsonToGeoJson";
import pointToLayer from "../utils/pointToLayer";
import onEachFeature from "../utils/onEachFeature";
import Table from "./Table";
import Chart from "./Chart";
import { Point } from "leaflet";

function Map(props: { data: Data[] }) {
    const geoJson = jsonToGeoJson(props.data);

    const [year, setYear] = useState("");
    const [isTableShown, setIsTableShown] = useState(false);
    const [isChartShown, setIsChartShown] = useState(true);
    const [dataToBeShown, setDataToBeShown] = useState<Data[]>([]);
    const [seletedLocation, setSelectedLocation] = useState<any>({ type: "Point", coordinates: [0, 0] });

    function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setYear(e.target.value);
        setDataToBeShown(props.data.filter((obj) => obj["Year"] === e.target.value));
    }

    function handleShowTableButtonClick() {
        setIsTableShown((prevIsTableShown) => !prevIsTableShown);
    }

    function handleShowChartButtonClick() {
        setIsChartShown((prevIsChartShown) => !prevIsChartShown);
    }

    function handleSort(e: React.BaseSyntheticEvent) {
        if (e.target.innerText === "Asset Name") {
            setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => a["Asset Name"].localeCompare(b["Asset Name"]))]);
        } else if (e.target.innerText === "Business Category") {
            setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => a["Business Category"].localeCompare(b["Business Category"]))]);
        } else if (e.target.innerText === "Risk Rating") {
            setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => a["Risk Rating"] - b["Risk Rating"])]);
        }
    }

    return (
        <main className="h-screen w-screen flex flex-col">
            <nav className="bg-slate-400 p-2 flex items-center gap-5 border-slate-200 rounded-lg m-1">
                <label htmlFor="year">Select a year</label>
                <select name="year" className="appearance-none bg-slate-300 rounded w-40 p-0.5" onChange={handleYearChange} value={year}>
                    <option value="" disabled hidden>
                        -
                    </option>
                    <option value="2030">2030</option>
                    <option value="2040">2040</option>
                    <option value="2050">2050</option>
                    <option value="2060">2060</option>
                    <option value="2070">2070</option>
                </select>
                <button className="bg-slate-200 hover:bg-slate-300 p-0.5 px-2 rounded" onClick={handleShowTableButtonClick}>
                    {isTableShown ? "Hide Table" : "Show Table"}
                </button>
                <button className="bg-slate-200 hover:bg-slate-300 p-0.5 px-2 rounded" onClick={handleShowChartButtonClick}>
                    {isChartShown ? "Hide Chart" : "Show Chart"}
                </button>
            </nav>

            <section className="flex">
                {isTableShown && <Table data={dataToBeShown} handleSort={handleSort} />}
                {isChartShown && <Chart data={props.data} seletedLocation={seletedLocation} />}
            </section>

            <MapContainer center={[43.65107, -79.347015]} zoom={3} className="h-screen w-full">
                <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maxZoom={20} subdomains={["mt0", "mt1", "mt2", "mt3"]} />
                <GeoJSON
                    key={year}
                    data={geoJson}
                    filter={(feature) => feature.properties.year === year}
                    pointToLayer={pointToLayer}
                    onEachFeature={(feature, layer) => {
                        layer.addEventListener("click", () => {
                            console.log("hohoho", feature.geometry);
                            setSelectedLocation(feature.geometry);
                        });
                        layer.bindTooltip(
                            `<p>Asset Name: <b>${feature.properties.assetName}</b></p>
    <p>Business Category: <b>${feature.properties.businessCategory}</b></p>
    <p>Year: <b>${feature.properties.year}</b></p>`,
                            { direction: "right", offset: [20, 0] }
                        );
                    }}
                />
            </MapContainer>
        </main>
    );
}

export default Map;
