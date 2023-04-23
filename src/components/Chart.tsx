import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Data from "../interfaces/Data";
import { Position } from "geojson";

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

function Chart(props: { data: Data[]; seletedLocation: Position }) {
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
            if (filter === "Asset") {
                const aggregatedDataMemo = props.data.reduce(
                    (result, obj) => {
                        if (obj["Asset Name"] === option) {
                            result[obj["Year"]].rating += obj["Risk Rating"];
                            result[obj["Year"]].count++;
                        }

                        return result;
                    },
                    { 2030: { rating: 0, count: 0 }, 2040: { rating: 0, count: 0 }, 2050: { rating: 0, count: 0 }, 2060: { rating: 0, count: 0 }, 2070: { rating: 0, count: 0 } }
                );

                const aggregatedData: number[] = [];
                for (const memo of Object.values(aggregatedDataMemo)) {
                    aggregatedData.push(memo.rating / memo.count);
                }

                setDataForChart((prevDataForChart) => {
                    return {
                        ...prevDataForChart,
                        datasets: [
                            {
                                ...prevDataForChart.datasets[0],
                                label: `${filter}  - ${option}`,
                                data: aggregatedData
                            }
                        ]
                    };
                });
            }
            if (filter === "Business Category") {
                const aggregatedDataMemo = props.data.reduce(
                    (result, obj) => {
                        if (obj["Business Category"] === option) {
                            result[obj["Year"]].rating += obj["Risk Rating"];
                            result[obj["Year"]].count++;
                        }

                        return result;
                    },
                    { 2030: { rating: 0, count: 0 }, 2040: { rating: 0, count: 0 }, 2050: { rating: 0, count: 0 }, 2060: { rating: 0, count: 0 }, 2070: { rating: 0, count: 0 } }
                );

                const aggregatedData: number[] = [];
                for (const memo of Object.values(aggregatedDataMemo)) {
                    aggregatedData.push(memo.rating / memo.count);
                }

                setDataForChart((prevDataForChart) => {
                    return {
                        ...prevDataForChart,
                        datasets: [
                            {
                                ...prevDataForChart.datasets[0],
                                label: `${filter}  - ${option}`,
                                data: aggregatedData
                            }
                        ]
                    };
                });
            }
            if (filter === "Location") {
                const res = await fetch(`https://api.positionstack.com/v1/reverse?access_key=${process.env.API_KEY}&query=${props.seletedLocation[1]},${props.seletedLocation[0]}&limit=1`);
                const data = await res.json();
                const address = data.data[0].label;

                const aggregatedDataMemo = props.data.reduce(
                    (result, obj) => {
                        if (obj.Lat === props.seletedLocation[1] && obj.Long === props.seletedLocation[0]) {
                            result[obj["Year"]].rating += obj["Risk Rating"];
                            result[obj["Year"]].count++;
                        }

                        return result;
                    },
                    { 2030: { rating: 0, count: 0 }, 2040: { rating: 0, count: 0 }, 2050: { rating: 0, count: 0 }, 2060: { rating: 0, count: 0 }, 2070: { rating: 0, count: 0 } }
                );

                const aggregatedData: number[] = [];
                for (const memo of Object.values(aggregatedDataMemo)) {
                    aggregatedData.push(memo.rating / memo.count);
                }

                setDataForChart((prevDataForChart) => {
                    return {
                        ...prevDataForChart,
                        datasets: [
                            {
                                ...prevDataForChart.datasets[0],
                                label: `${filter}  - ${address || `${props.seletedLocation[0]}, ${props.seletedLocation[1]}`}`,
                                data: aggregatedData
                            }
                        ]
                    };
                });
            }
        })();
    }, [option, props.seletedLocation]);

    return (
        <div className="grow shrink basis-full flex flex-col justify-between max-w-[80vw] h-96 overflow-auto bg-sky-50 rounded resize p-2 opacity-90 shadow-md shadow-gray-700 text-sm">
            <nav className="p-2 flex flex-wrap items-center gap-2 w-full">
                <select className="appearance-none bg-sky-300 rounded w-40 p-1" onChange={handleFilterChange} value={filter}>
                    <option value="" disabled={true}>
                        Choose a Filter
                    </option>
                    <option value="Asset">Asset</option>
                    <option value="Business Category">Business Category</option>
                    <option value="Location">Location</option>
                </select>

                {filter === "Asset" && (
                    <div className="flex items-center gap-2">
                        <select name="Asset Name" className="appearance-none bg-sky-300 rounded w-fit p-1" onChange={handleOptionChange} value={option}>
                            <option value="" disabled>
                                Choose an Asset
                            </option>
                            {ASSET_NAMES.map((asset, i) => (
                                <option key={i} value={asset}>
                                    {asset}
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

                {filter === "Location" && (
                    <div className="flex items-center gap-2">
                        <p>Choose from the map</p>
                        <p className="appearance-none bg-sky-300 rounded w-fit p-1 whitespace-nowrap">
                            {props.seletedLocation[0]}, {props.seletedLocation[1]}
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
