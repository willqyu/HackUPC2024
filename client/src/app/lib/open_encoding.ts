import OpenAI from "openai";
import { UserRequest } from "./definitions";

const openai = new OpenAI(
  {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true 
  }
);

function cosineSimilarity(vectorA: number[], vectorB: number[]) {
    const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
    const magA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));
    
    return (magA && magB) ? dotProduct / (magA * magB) : 0;
  }

export async function embed(str: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: str,
    encoding_format: "float",
  });
  return (embedding.data[0].embedding);
}

export async function similarStrings(str1: string, str2: string) {

  const [a, b] = await Promise.all([
    embed(str1),
    embed(str2)
  ]);
  cosineSimilarity(a, b);
}

export async function patternMatch(str: string) {

}

export async function extractWant(str: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": `
        Tell me in one word what product this customer wants, and in one number how many they want.
        Give it in the format "item,number"
        `},
      {"role": "user", "content": str}
    ],
    model: "gpt-3.5-turbo-0125",
  });

  let answer_str = completion.choices[0].message.content;
  let sep = answer_str?.split(",");
  if (sep?.length == 2) {
    return {
      name: sep[0],
      count: Number(sep[1])
    } as UserRequest
  }
  else {
    return null
  }
}