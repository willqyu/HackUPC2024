
import { useState } from "react";
import { Item } from '@/app/lib/definitions';
import ListItem from "./list_item";

export default function List (
    {items, counts}:{items: Item[], counts: number[]}
) {
    return (
        <div>
            <ul role="list" className="divide-y divide-gray-100 px-5">
            {
                items
                .sort(
                    (a : Item, b : Item) => a.name?.localeCompare(b.name)
                )
                .map(
                    (item : Item, index: number) => (
                        <ListItem key={item.id} item={item} count={counts[index]}/>
                    )
                )
            }
            </ul>
        </div>
        
    )
}