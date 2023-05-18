import Fuse from "fuse.js";

export default function fuzzySearch(data: string[], search: string) {
    const fuse = new Fuse(data, { includeScore: true });
    const result = fuse.search(search);

    if (result.length > 0) {
        if (result[0].score !== undefined && result[0].score <= 0.2) {
            return result[0];
        }
    }
}
