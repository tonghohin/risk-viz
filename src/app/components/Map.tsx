"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import Data from "../interfaces/Data";
import jsonToGeoJson from "../utils/jsonToGeoJson";
import pointToLayer from "../utils/pointToLayer";
import onEachFeature from "../utils/onEachFeature";
import Table from "./Table";

function Map(props: { data: Data[] }) {
    const geoJson = jsonToGeoJson(props.data);

    const [decade, setDecade] = useState("2030");
    const [isTableShown, setIsTableShown] = useState(true);
    const [dataToBeShown, setDataToBeShown] = useState<Data[]>([]);

    function handleDecadeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setDecade(e.target.value);
        setDataToBeShown(props.data.filter((obj) => obj["Year"] === e.target.value));
    }

    function handleShowTableButtonClick() {
        setIsTableShown((prevIsTableShown) => !prevIsTableShown);
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
            <nav className="bg-slate-400 p-2 flex items-center gap-1 border-slate-200 rounded-lg m-1">
                <label htmlFor="decade">Select a decade</label>
                <select name="decade" className="appearance-none bg-slate-300 rounded w-40 p-0.5" onChange={handleDecadeChange} value={decade}>
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
            </nav>

            {isTableShown && <Table data={dataToBeShown} handleSort={handleSort} />}

            <MapContainer center={[43.65107, -79.347015]} zoom={3} className="h-screen w-full">
                <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" maxZoom={20} subdomains={["mt0", "mt1", "mt2", "mt3"]} />
                <GeoJSON key={decade} data={geoJson} filter={(feature) => feature.properties.year === decade} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
            </MapContainer>
        </main>
    );
}

export default Map;
