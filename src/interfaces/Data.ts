export default interface Data {
    "Asset Name": string;
    "Business Category": string;
    Lat: number;
    Long: number;
    "Risk Factors": Risk | string;
    "Risk Rating": number;
    Year: "2030" | "2040" | "2050" | "2060" | "2070";
}

type Risk = {
    [key: string]: number;
};
