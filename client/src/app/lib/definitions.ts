export type Item = {
    id: number,
    name: string,
    ean: number | null
}

export type UserRequest = {
    name: string,
    count: number
}