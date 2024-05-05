

export function generateMap(x: number, y: number) {
    const grid = [];
    for (let i = 0; i < y; i++) {
        const row = [];
        for (let j = 0; j < x; j++) {
        row.push(null); // You can initialize the grid with any default value
        }
        grid.push(row);
    }
    return grid;
}