import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Data from "../interfaces/Data";
import { Position } from "geojson";
import aggregateData from "@/utils/aggregateData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ASSET_NAMES = [
    "Acevedo-Kennedy",
    "Alvarez Inc",
    "Anderson Group",
    "Banks-Carlson",
    "Bender, Warren and Sanchez",
    "Campos and Sons",
    "Clarke, Lutz and Farrell",
    "Cook-Burns",
    "Davis, Allen and Rivera",
    "Duke Ltd",
    "Flynn-Anderson",
    "Foster-Flores",
    "Fox, Daniel and Coleman",
    "Good-Lewis",
    "Grant-Coffey",
    "Gray-Evans",
    "Gross PLC",
    "Guzman Ltd",
    "Hall, Meadows and Anderson",
    "Harrison, Meza and Rios",
    "Higgins, Brown and Vaughn",
    "Hooper, Evans and Merritt",
    "Horne and Sons",
    "Jimenez-Gallegos",
    "Johnson and Sons",
    "Jones Ltd",
    "Kelley, Barnes and Hutchinson",
    "Kemp-Anderson",
    "Landry, Molina and Green",
    "Marks, Garrett and Cummings",
    "Martin-Jenkins",
    "Mcknight, Beasley and Stewart",
    "Mcpherson, Simmons and Simpson",
    "Mejia, Roberts and Gay",
    "Miller-Norris",
    "Norton-Spencer",
    "Obrien-Oneill",
    "Park and Sons",
    "Patel, Norris and Jackson",
    "Patel-Brooks",
    "Perez-Robertson",
    "Pittman PLC",
    "Reid PLC",
    "Reid-Sherman",
    "Rivera Inc",
    "Roberts, Burke and Williams",
    "Robertson-Petersen",
    "Rodriguez, Roberts and Fuller",
    "Skinner-Rojas",
    "Smith-Woods",
    "Stanton-Joyce",
    "Stewart PLC",
    "Strickland-Daniels",
    "Sullivan-Curtis",
    "Taylor, Mitchell and Ward",
    "Thomas-Chavez",
    "Thompson, Davis and Brown",
    "Torres-Sanchez",
    "Vega-Huffman",
    "Wagner, Curry and Pearson",
    "Walker, Hogan and Mendez",
    "Waller Ltd",
    "Ware PLC",
    "Washington, Rogers and Morrison",
    "Watson, Evans and Smith",
    "Wiley Ltd",
    "Wilkerson-Miranda",
    "Williams Group",
    "Willis-Newman",
    "Zuniga Inc"
];
const BUSINESS_CATEGORIES = ["Energy", "Finance", "Healthcare", "Manufacturing", "Retail", "Technology"];
const labels = ["2030", "2040", "2050", "2060", "2070"];

const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "top"
        },
        title: {
            display: true,
            text: "Risk Rating over time (Year)"
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    return `${context.dataset.label} - Risk Rating: ${context.parsed.y.toFixed(2)}`;
                }
            }
        }
    }
};

function Chart(props: { data: Data[]; selectedLocation: Position }) {
    const [filter, setFilter] = useState("");
    const [option, setOption] = useState("");
    const [dataForChart, setDataForChart] = useState<ChartData<"line">>({
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
        (async () => {
            if (filter === "Asset Name" || filter === "Business Category") {
                setDataForChart((prevDataForChart) => {
                    return {
                        ...prevDataForChart,
                        datasets: [
                            {
                                ...prevDataForChart.datasets[0],
                                label: `${filter} - ${option}`,
                                data: aggregateData(props.data, option, filter)
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

                    setDataForChart((prevDataForChart) => {
                        return {
                            ...prevDataForChart,
                            datasets: [
                                {
                                    ...prevDataForChart.datasets[0],
                                    label: `${filter}  - ${address}`,
                                    data: aggregateData(props.data, option, filter, props.selectedLocation)
                                }
                            ]
                        };
                    });
                } catch (error) {
                    setDataForChart((prevDataForChart) => {
                        return {
                            ...prevDataForChart,
                            datasets: [
                                {
                                    ...prevDataForChart.datasets[0],
                                    label: `${filter}  -  ${props.selectedLocation[0]}, ${props.selectedLocation[1]}`,
                                    data: aggregateData(props.data, option, filter, props.selectedLocation)
                                }
                            ]
                        };
                    });
                }
            }
        })();
    }, [option, props.selectedLocation]);

    return (
        <div className="grow shrink basis-full flex flex-col justify-between max-w-[80vw] h-96 overflow-auto bg-sky-50 rounded resize p-2 opacity-90 shadow-md shadow-gray-700 text-sm">
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
                        <p className="appearance-none bg-sky-300 rounded w-fit p-1 whitespace-nowrap">
                            {props.selectedLocation[0]}, {props.selectedLocation[1]}
                        </p>
                    </div>
                )}
            </nav>
            <div className="w-full min-h-[250px] relative flex-auto">
                <Line options={chartOptions} data={dataForChart} />
            </div>
        </div>
    );
}

export default Chart;
