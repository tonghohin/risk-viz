import Data from "../app/interfaces/Data";
import { useState } from "react";

function Table(props: { data: Data[]; handleSort: (e: React.BaseSyntheticEvent) => void }) {
    const [filterInput, setFilterInput] = useState("");

    const regExp = new RegExp(filterInput, "i");

    function handleFilterInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFilterInput(e.target.value);
    }

    return (
        <div className="flex-1 w-[50vw] h-96 overflow-auto bg-white rounded resize opacity-90 shadow-md shadow-gray-700">
            <table className="text-sm h-96 w-full rounded">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer p-0.5" onClick={props.handleSort}>
                            No.
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer" onClick={props.handleSort}>
                            Asset Name
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer" onClick={props.handleSort}>
                            Business Category
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer" onClick={props.handleSort}>
                            Risk Rating
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer">
                            Risk Factors (Filter: <input type="text" name="filter" value={filterInput} onChange={handleFilterInputChange} />)
                        </th>
                        <th className="border-gray-400 border-b">Year</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data
                        .filter((obj) => obj["Risk Factors"].match(regExp) !== null)
                        .map((obj, i) => (
                            <tr key={i} className="hover:bg-gray-200">
                                <td className="border-gray-300 border">{i + 1}</td>
                                <td className="border-gray-300 border">{obj["Asset Name"]}</td>
                                <td className="border-gray-300 border">{obj["Business Category"]}</td>
                                <td className="border-gray-300 border">{obj["Risk Rating"]}</td>
                                <td className="border-gray-300 border">{obj["Risk Factors"]}</td>
                                <td className="border-gray-300 border">{obj["Year"]}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
