import { Item } from '@/app/lib/definitions';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'  

export async function GET(request: any) {
    const raw = await fetch("http://localhost:3000/api", {method: 'GET', headers: {
        Accept: 'application/json',
      }, });
    const data = await raw.json();
    
    const pdf = await createBOM(data);
    return new Response(pdf, { headers: { 'content-type': 'application/pdf' } });
};

export const config = {
    api: { bodyParser: false, },
};

async function createBOM(items: Item[]) {
    const pdfDoc = await PDFDocument.create();
    const buffer = await pdfDoc.save();
    
    console.log(items);
    return buffer
}