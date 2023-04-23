"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import Data from "../app/interfaces/Data";
import jsonToGeoJson from "../app/utils/jsonToGeoJson";
import pointToLayer from "../app/utils/pointToLayer";
import Table from "./Table";
import Chart from "./Chart";

function Map(props: { data: Data[] }) {
    const geoJson = jsonToGeoJson(props.data);

    const [year, setYear] = useState("");
    const [isTableShown, setIsTableShown] = useState(false);
    const [isChartShown, setIsChartShown] = useState(false);
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
        <main className="h-screen w-screen">
            <nav className="flex items-center gap-5 fixed w-full z-[2000] top-[12px] left-[60px]">
                <select className="appearance-none bg-white rounded w-40 p-0.5 shadow-md shadow-gray-700" onChange={handleYearChange} value={year}>
                    <option value="" disabled={true}>
                        Select a year
                    </option>
                    <option value="2030">2030</option>
                    <option value="2040">2040</option>
                    <option value="2050">2050</option>
                    <option value="2060">2060</option>
                    <option value="2070">2070</option>
                </select>
                <button className="bg-white hover:bg-gray-100 p-0.5 px-2 rounded-lg shadow-md shadow-gray-700" onClick={handleShowTableButtonClick}>
                    {isTableShown ? "Hide Table" : "Show Table"}
                </button>
                <button className="bg-white hover:bg-gray-100 p-0.5 px-2 rounded-lg shadow-md shadow-gray-700" onClick={handleShowChartButtonClick}>
                    {isChartShown ? "Hide Chart" : "Show Chart"}
                </button>

                <section className="flex absolute gap-5" style={{ zIndex: 100000, top: "40px", left: "0px", maxWidth: "90vw", maxHeight: "50vh" }}>
                    {isTableShown && <Table data={dataToBeShown} handleSort={handleSort} />}
                    {isChartShown && <Chart data={props.data} seletedLocation={seletedLocation} />}
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
