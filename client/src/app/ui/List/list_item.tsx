import { Item } from "@/app/lib/definitions";
import { json } from "stream/consumers";

function padID(id: number) {
    let a = ("000000" + id.toString()).slice(-6);
    return a
}

export default function ListItem({
    item,
    count
} : {
    item: Item,
    count: number
}) {
    return (
        <li className="flex justify-between gap-x-6 py-5">
            <div className="min-w-0 flex-auto gap-x-4 ">
                <p className="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{padID(item.id)}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{item.ean ? item.ean : "EAN Not Found"}</p>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">{count}</p>
                <button onClick={
                    (e) => fetch("/api", {method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(item),})
                }>
                    +
                </button>
            </div>
        </li>
    )
}