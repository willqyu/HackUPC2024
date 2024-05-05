import { NextResponse } from "next/server";
import { Item } from "../lib/definitions";


let items = new Array<Item>();
// To handle a GET request to /api
export async function GET(request: any) {
  // Do whatever you want
  console.log(request);
  return NextResponse.json(items , { status: 200 });
}

// To handle a POST request to /api
export async function POST(request: any) {
  // Do whatever you want
  const body = await request.json();
  console.log(body);
  items.push(body as Item);
  return NextResponse.json({ message: "Added" }, { status: 200 });
}

export async function DELETE(request: any) {
  items = new Array<Item>();
  return NextResponse.json({ message: "Removed" }, { status: 200 });
}