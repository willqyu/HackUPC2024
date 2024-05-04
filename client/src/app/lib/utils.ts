import { Item } from "./definitions";

export async function fetchCSV() {
    const raw = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQ401fB90yZTeqEfFx8eNaDFp7F1y6ZCaj5k0fR6ulpDg4zf9eqEym3iMcxwMuCauKS5CSTFPHtxLVK/pub?output=csv')
    .then((response) => response.text());
    const parsed = parse_CSV_to_items(raw);
    return parsed;
}

export function parse_CSV_to_items(str: string) : Array<Item> {
    const strs = str.replaceAll('"', "").split("\r\n");
    
    const map = strs.slice(1).map(
        row => {
            let split = row.split(",");
            return ({
                id: Number(split[0]),
                name: split[1],
                ean: split[2] != "NULL" ? Number(split[2]) : null
            }) as Item
        }
    )
    return map
}

