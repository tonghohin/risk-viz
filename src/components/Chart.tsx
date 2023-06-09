import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Data from "../interfaces/Data";
import { Position } from "geojson";
import aggregateData from "@/utils/aggregateData";
import { Dispatch, SetStateAction } from "react";
import { ASSET_NAMES, BUSINESS_CATEGORIES, labels } from "@/utils/data";

interface Props {
    data: Data[];
    selectedLocation: Position;
    promptResultForChart: string;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart(props: Props) {
    const chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                align: "start"
            },
            title: {
                display: true,
                text: "Risk Rating over time (Year)"
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const data = context.raw as { highestRisk: { risk: string; rating: number } };

                        return [context.dataset.label as string, `Risk Rating -  ${context.parsed.y.toFixed(2)}` as string, `Highest Risk - ${data.highestRisk.risk} (${data.highestRisk.rating})`];
                    }
                },
                padding: 3
            }
        }
    };
    const [filter, setFilter] = useState("");
    const [option, setOption] = useState("");
    const [dataForChart, setDataForChart] = useState<ChartData<"line", { highestRisk: { risk: string; rating: number } }[]>>({
        labels,
        datasets: [
            {
                label: "Choose a filter",
                data: [],
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)"
            }
        ]
    });

    function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setFilter(e.target.value);
        setOption("");
    }

    function handleOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setOption(e.target.value);
    }

    useEffect(() => {
        if (props.promptResultForChart !== "") {
            setFilter("Asset Name");
            setOption(props.promptResultForChart);

            const dataForChart = aggregateData(props.data, props.promptResultForChart, "Asset Name");

            setDataForChart((prevDataForChart) => {
                return {
                    ...prevDataForChart,
                    datasets: [
                        {
                            ...prevDataForChart.datasets[0],
                            label: `${filter} - ${option}`,
                            data: dataForChart
                        }
                    ]
                };
            });
        }
    }, [props.promptResultForChart]);

    useEffect(() => {
        (async () => {
            if (filter === "Asset Name" || filter === "Business Category") {
                const dataForChart = aggregateData(props.data, option, filter);

                setDataForChart((prevDataForChart) => {
                    return {
                        ...prevDataForChart,
                        datasets: [
                            {
                                ...prevDataForChart.datasets[0],
                                label: `${filter} - ${option}`,
                                data: dataForChart
                            }
                        ]
                    };
                });
            }

            if (filter === "Lat") {
                try {
                    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.selectedLocation[1]},${props.selectedLocation[0]}&key=${process.env.API_KEY}`);
                    const data = await res.json();
                    const address = data.results[0].formatted_address;

                    if (address === undefined) throw new Error("Address not found");

                    const dataForChart = aggregateData(props.data, option, filter, props.selectedLocation);

                    setDataForChart((prevDataForChart) => {
                        return {
                            ...prevDataForChart,
                            datasets: [
                                {
                                    ...prevDataForChart.datasets[0],
                                    label: `Location - ${address}`,
                                    data: dataForChart
                                }
                            ]
                        };
                    });
                } catch (error) {
                    const dataForChart = aggregateData(props.data, option, filter, props.selectedLocation);

                    setDataForChart((prevDataForChart) => {
                        return {
                            ...prevDataForChart,
                            datasets: [
                                {
                                    ...prevDataForChart.datasets[0],
                                    label: `Location - ${props.selectedLocation[0]}, ${props.selectedLocation[1]}`,
                                    data: dataForChart
                                }
                            ]
                        };
                    });
                }
            }
        })();
    }, [option, props.selectedLocation]);

    return (
        <div className="grow shrink basis-full flex flex-col justify-between max-w-[80vw] max-h-96 overflow-auto bg-sky-50 rounded resize p-2 opacity-90 shadow-md shadow-gray-700 text-sm">
            <nav className="p-2 flex flex-wrap items-center gap-2 w-full">
                <select className="appearance-none bg-sky-300 rounded w-40 p-1" onChange={handleFilterChange} value={filter}>
                    <option value="" disabled={true}>
                        Choose a Filter
                    </option>
                    <option value="Asset Name">Asset</option>
                    <option value="Business Category">Business Category</option>
                    <option value="Lat">Location</option>
                </select>

                {filter === "Asset Name" && (
                    <div className="flex items-center gap-2">
                        <select name="Asset Name Name" className="appearance-none bg-sky-300 rounded w-fit p-1" onChange={handleOptionChange} value={option}>
                            <option value="" disabled>
                                Choose an Asset Name
                            </option>
                            {ASSET_NAMES.map((assetName, i) => (
                                <option key={i} value={assetName}>
                                    {assetName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {filter === "Business Category" && (
                    <div className="flex items-center gap-2">
                        <select name="Business Category" className="appearance-none bg-sky-300 rounded w-fit p-1" onChange={handleOptionChange} value={option}>
                            <option value="" disabled>
                                Choose a Business Category
                            </option>
                            {BUSINESS_CATEGORIES.map((category, i) => (
                                <option key={i} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {filter === "Lat" && (
                    <div className="flex items-center gap-2">
                        <p>Choose from the map</p>
                        <p className="appearance-none bg-gray-300 rounded w-fit p-1 whitespace-nowrap">
                            {props.selectedLocation[0]}, {props.selectedLocation[1]}
                        </p>
                    </div>
                )}
            </nav>
            <div className="w-full min-h-[200px] relative flex-auto">
                <Line options={chartOptions} data={dataForChart} />
            </div>
        </div>
    );
}

export default Chart;
