import fs from "fs";
import path from "path";
import OpenAI from "openai";

export async function say(str: string, complete: CallableFunction) {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json', 
      'content-type': 'application/json',
      "authorization": "Bearer " + process.env.NEXT_PUBLIC_EDEN_API_KEY_PROD
    },
    body: JSON.stringify({
      response_as_dict: true,
      attributes_as_list: false,
      show_original_response: false,
      rate: 0,
      pitch: 0,
      volume: 0,
      sampling_rate: 0,
      providers: 'openai',
      language: 'en',
      text: str,
      option: 'FEMALE'
    })
  };
  
  const raw = await fetch('https://api.edenai.run/v2/audio/text_to_speech', options)
    .then(response => response.json())
    .then(response => {
      // console.log(response.openai.audio);
      
      const audio = new Audio("data:audio/mp3;base64," + response.openai.audio);
      audio.load()
      audio.play()
      audio.onended = () => complete();
    }
    )
    .catch(err => console.error(err));
}