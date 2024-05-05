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

export async function extractWant(str: string, complete: CallableFunction) {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": `
        Tell me in one word what product this customer wants, and in one number how many they want.
        Give it in the format "item, number". If there is no indication of number, default to 1.
        `},
      {"role": "user", "content": str}
    ],
    model: "gpt-3.5-turbo-0125",
  });

  let answer_str = completion.choices[0].message.content;
  let sep = answer_str?.split(",");
  if (sep?.length == 2) {
    const req = {
      name: sep[0],
      count: Number(sep[1])
    } as UserRequest
    complete(req);
    return req;
  }
  else {
    return null
  }
}

export async function extractCount(str: string, complete: CallableFunction) {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": `
        The customer is selecting one out of many items. Give me one number corresponding to the index of the nth item selected.
        However, if the customer sounds like they don't want anything, return 0.
        `},
      {"role": "user", "content": str}
    ],
    model: "gpt-3.5-turbo-0125",
  });
  let answer_str = completion.choices[0].message.content;
  return Number(answer_str)
}

export async function variate(str: string) {
  const completion = await openai.chat.completions.create({
    messages: [
      {"role": "system", "content": `
        Rewrite this sentence so that it retains exactly the same meaning but sounds more natural.
        `},
      {"role": "user", "content": str}
    ],
    model: "gpt-3.5-turbo-0125",
  });
  return completion.choices[0].message.content
}

export async function sayAI(str: string, complete: CallableFunction) {
  const variation = await variate(str);
  str = variation ? variation : str;
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: str,
  })
  const blob = new Blob([await mp3.arrayBuffer()], { type: "audio/mpeg" });
  const objectUrl = URL.createObjectURL(blob);

  // Testing for now
  const audio = new Audio(objectUrl);
  audio.play();
  audio.onended = () => complete();
}