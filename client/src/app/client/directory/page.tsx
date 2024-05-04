import { fetchCSV } from "@/app/lib/utils";
import List from "@/app/ui/List/list";
import SearchBar from "@/app/ui/Search/searchbar";

export default async function Directory() {
    const items = await fetchCSV();
    return (
        <div>
            <SearchBar items={items}/>
        </div>
    )
}