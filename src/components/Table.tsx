import Data from "../interfaces/Data";
import { useState } from "react";

function Table(props: { data: Data[]; handleSort: (e: React.BaseSyntheticEvent) => void }) {
    const [filterInput, setFilterInput] = useState("");

    const regExp = new RegExp(filterInput, "i");
    const filteredData = props.data.filter((obj) => JSON.stringify(obj["Risk Factors"]).match(regExp) !== null);

    function handleFilterInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFilterInput(e.target.value);
    }

    return (
        <div className="grow shrink basis-full max-w-[80vw] max-h-96 overflow-auto bg-white rounded resize opacity-90 shadow-md shadow-gray-700">
            <table className="text-sm min-h-[250px] h-auto w-full rounded">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="border-gray-400 border-b border-r p-0.5" onClick={props.handleSort}>
                            No.
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer" onClick={props.handleSort}>
                            <span className="flex items-center">
                                Asset Name
                                <svg className="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                            </span>
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer" onClick={props.handleSort}>
                            <span className="flex items-center">
                                Business Category
                                <svg className="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                            </span>
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer" onClick={props.handleSort}>
                            <span className="flex items-center">
                                Risk Rating
                                <svg className="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                            </span>
                        </th>
                        <th className="border-gray-400 border-b border-r hover:bg-gray-400 cursor-pointer">
                            Risk Factors (Filter: <input type="text" name="filter" className="font-medium" value={filterInput} onChange={handleFilterInputChange} />)
                        </th>
                        <th className="border-gray-400 border-b">Year</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="align-top">
                                Please select a year first
                            </td>
                        </tr>
                    ) : filteredData.length === 0 ? (
                        <tr className="align-top">
                            <td colSpan={6}>No matched data</td>
                        </tr>
                    ) : (
                        filteredData.map((obj, i) => (
                            <tr key={i} className="hover:bg-gray-200">
                                <td className="border-gray-300 border">{i + 1}</td>
                                <td className="border-gray-300 border">{obj["Asset Name"]}</td>
                                <td className="border-gray-300 border">{obj["Business Category"]}</td>
                                <td className="border-gray-300 border">{obj["Risk Rating"]}</td>
                                <td className="border-gray-300 border">{JSON.stringify(obj["Risk Factors"]).replace(/[{}"]/g, "")}</td>
                                <td className="border-gray-300 border">{obj["Year"]}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
