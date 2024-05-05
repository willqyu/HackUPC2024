"use client"

import { Item } from "@/app/lib/definitions";
import List from "../List/list";
import { useState } from "react";
import fuzzysearch from "fuzzysearch-ts";

export default function SearchBar(
    {items} : {items: Item[]}
) {
    const [searchItems, setItems] = useState(items);

    function handleSearch(value : string) {
        setItems(
            items.filter(
                item => fuzzysearch(
                    value.toLocaleLowerCase(), 
                    item.name.toLocaleLowerCase()
                )
            )
        )
    }

    return (
        <div>
            <div className="flex justify-center">
            <input
                type="text"
                className="m-5 w-2/3 p-2 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 pl-3 !outline-none"
                placeholder="Search Here..."    
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
            />
            </div>
            <List items={searchItems} counts={searchItems.map((item, index)=>1)} />
        </div>
        
    )
}