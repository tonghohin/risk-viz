"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import Data from "../interfaces/Data";
import jsonToGeoJson from "../utils/jsonToGeoJson";
import pointToLayer from "../utils/pointToLayer";
import Table from "./Table";
import Chart from "./Chart";
import { Position } from "geojson";

function Map(props: { data: Data[] }) {
    const geoJson = jsonToGeoJson(props.data);

    const [year, setYear] = useState("");
    const [isTableShown, setIsTableShown] = useState(false);
    const [isChartShown, setIsChartShown] = useState(false);
    const [dataToBeShown, setDataToBeShown] = useState<Data[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Position>([0, 0]);

    function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setYear(e.target.value);
        setDataToBeShown(props.data.filter((obj) => obj["Year"] === e.target.value));
    }

    function handleShowTableButtonClick() {
        setIsTableShown((prevIsTableShown) => !prevIsTableShown);
    }

    function handleShowChartButtonClick() {
        setIsChartShown((prevIsChartShown) => !prevIsChartShown);
        setSelectedLocation([0, 0]);
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
        <main className="h-screen w-screen">
            <nav className="overflow-auto max-h-[calc(100vh-24px)] flex flex-col fixed max-w-[calc(100vw-70px)] z-[2000] top-[12px] left-[60px]">
                <div className="flex flex-wrap gap-2 mb-2">
                    <select className="appearance-none bg-white rounded w-28 p-1 shadow-md shadow-gray-700" onChange={handleYearChange} value={year}>
                        <option value="" disabled={true}>
                            Select a year
                        </option>
                        <option value="2030">2030</option>
                        <option value="2040">2040</option>
                        <option value="2050">2050</option>
                        <option value="2060">2060</option>
                        <option value="2070">2070</option>
                    </select>
                    <div className="flex gap-2">
                        <button className="bg-white hover:bg-gray-100 p-1 w-24 rounded-lg shadow-md shadow-gray-700 whitespace-nowrap" onClick={handleShowTableButtonClick}>
                            {isTableShown ? "Hide Table" : "Show Table"}
                        </button>
                        <button className="bg-white hover:bg-gray-100 p-1 w-24 rounded-lg shadow-md shadow-gray-700 whitespace-nowrap" onClick={handleShowChartButtonClick}>
                            {isChartShown ? "Hide Chart" : "Show Chart"}
                        </button>
                    </div>
                </div>
                <section className="grid grid-row-2 gap-2 max-w-[80vw] sm:flex-row sm:flex overflow-auto">
                    {isTableShown && <Table data={dataToBeShown} handleSort={handleSort} />}
                    {isChartShown && <Chart data={props.data} selectedLocation={selectedLocation} />}
                </section>
            </nav>

            <MapContainer center={[43.65107, -79.347015]} zoom={3} className="h-screen w-screen">
                <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maxZoom={20} subdomains={["mt0", "mt1", "mt2", "mt3"]} />
                <GeoJSON
                    key={year}
                    data={geoJson}
                    filter={(feature) => feature.properties.year === year}
                    pointToLayer={pointToLayer}
                    onEachFeature={(feature, layer) => {
                        layer.addEventListener("click", () => {
                            if (feature.geometry.type === "Point") {
                                setSelectedLocation(feature.geometry.coordinates);
                            }
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
