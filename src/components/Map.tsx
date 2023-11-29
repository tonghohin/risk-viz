"use client";

import { Position } from "geojson";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import Data from "../interfaces/Data";
import jsonToGeoJson from "../utils/jsonToGeoJson";
import pointToLayer from "../utils/pointToLayer";
import Chart from "./Chart";
import Table from "./Table";

function Map(props: { data: Data[] }) {
    const geoJson = jsonToGeoJson(props.data);

    const [year, setYear] = useState("");
    const [isTableShown, setIsTableShown] = useState(false);
    const [isChartShown, setIsChartShown] = useState(false);
    const [dataToBeShown, setDataToBeShown] = useState<Data[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Position>([0, 0]);
    const [prompt, setPrompt] = useState("");
    const [promptResultForChart, setPromptResultForChart] = useState("");
    const [promptErrorMessage, setPromptErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setDataToBeShown(props.data.filter((obj) => obj["Year"] === year));
    }, [year]);

    function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setYear(e.target.value);
    }

    function handleShowTableButtonClick() {
        setIsTableShown((prevIsTableShown) => !prevIsTableShown);
    }

    function handleShowChartButtonClick() {
        setIsChartShown((prevIsChartShown) => !prevIsChartShown);
        setSelectedLocation([0, 0]);
    }

    function handleSort(toggleSort: { "Asset Name": boolean; "Business Category": boolean; "Risk Rating": boolean }, columnToSort: "Asset Name" | "Business Category" | "Risk Rating") {
        if (columnToSort === "Asset Name") {
            toggleSort["Asset Name"] ? setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => a["Asset Name"].localeCompare(b["Asset Name"]))]) : setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => b["Asset Name"].localeCompare(a["Asset Name"]))]);
        } else if (columnToSort === "Business Category") {
            toggleSort["Business Category"] ? setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => a["Business Category"].localeCompare(b["Business Category"]))]) : setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => b["Business Category"].localeCompare(a["Business Category"]))]);
        } else if (columnToSort === "Risk Rating") {
            toggleSort["Risk Rating"] ? setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => a["Risk Rating"] - b["Risk Rating"])]) : setDataToBeShown((prevDataToBeShown) => [...prevDataToBeShown.sort((a, b) => b["Risk Rating"] - a["Risk Rating"])]);
        }
    }

    // function handlePromptChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    //     setPromptErrorMessage("");
    //     setPrompt(e.target.value);
    // }

    // async function handlePromptSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault();
    //     setPrompt("");
    //     setPromptErrorMessage("");

    //     try {
    //         const result = await processPrompt(prompt);
    //         const entities = result?.Entities;

    //         if (entities?.length === 0 || entities === undefined) {
    //             throw Error("Unable to process prompt");
    //         } else {
    //             for (const entity of entities) {
    //                 if (entity.Text) {
    //                     const searchAssets = fuzzySearch(ASSET_NAMES, entity.Text);
    //                     const searchYear = fuzzySearch(labels, entity.Text);

    //                     if (searchAssets) {
    //                         setPromptResultForChart(searchAssets.item);
    //                         setIsChartShown(true);
    //                     } else if (searchYear) {
    //                         setYear(searchYear.item);
    //                     } else {
    //                         throw Error("Unable to process prompt");
    //                     }
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error((error as Error).message);
    //         setPromptErrorMessage("Sorry, please try another prompt.");
    //     }
    // }

    return (
        <main className="h-screen w-screen">
            <nav className="overflow-auto max-h-[calc(100vh-24px)] gap-2 flex flex-col fixed max-w-[calc(100vw-70px)] z-[2000] top-[12px] left-[60px]">
                <div className="flex flex-wrap gap-2">
                    {isLoading ? (
                        <Image src="/loading.svg" alt="loading" width={12} height={12} />
                    ) : (
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
                    )}
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
                    {isChartShown && <Chart data={props.data} selectedLocation={selectedLocation} promptResultForChart={promptResultForChart} />}
                </section>

                {/* <form className="bg-slate-300 p-1 rounded opacity-90 flex flex-col gap-2" onSubmit={handlePromptSubmit}>
                    <label htmlFor="prompt">Try the new prompting feature! (Only available for Year and Assets right now)</label>
                    <textarea id="prompt" placeholder="e.g. Show me the data for year 2040" value={prompt} onChange={handlePromptChange} className="bg-gray-200 p-1 w-full z-[2000] bottom-[12px] left-[60px] rounded resize-none" />
                    <p className="text-red-600">{promptErrorMessage}</p>
                    <button className="bg-white hover:bg-gray-100 p-1 w-24 rounded-lg whitespace-nowrap">Submit</button>
                </form> */}
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
                    eventHandlers={{
                        loading: () => console.log("loading")
                    }}
                />
            </MapContainer>
        </main>
    );
}

export default Map;
