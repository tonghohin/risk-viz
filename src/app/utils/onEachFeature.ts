import { Feature, Point } from "geojson";
import { Layer } from "leaflet";

export default function onEachFeature(feature: Feature<Point, any>, layer: Layer) {
    layer.addEventListener("click", () => {
        console.log("hohoho", feature.geometry.coordinates);
    });
    layer.bindTooltip(
        `<p>Asset Name: <b>${feature.properties.assetName}</b></p>
    <p>Business Category: <b>${feature.properties.businessCategory}</b></p>
    <p>Year: <b>${feature.properties.year}</b></p>`,
        { direction: "right", offset: [20, 0] }
    );
}
