// "use client";

// import 'regenerator-runtime/runtime'
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
// import { useMachine } from '@xstate/react';
// import { embed, extractWant, sayAI } from '@/app/lib/open_encoding';
// import { fetchCSV } from '@/app/lib/utils';
// import { useEffect, useState } from 'react';
// import { setup } from 'xstate';
// import { Item, UserRequest } from "@/app/lib/definitions";

// import fuzzysearch from "fuzzysearch-ts";
// import List from "../List/list";

// const machine = setup({
//   actions: {
//       start_listening: () => {
//         SpeechRecognition.startListening({continuous: true});
//       },
//       stop_listening: () => {
//         SpeechRecognition.stopListening();
//       },
//       start_thinking: () => {},
//   },
// }).createMachine({
// /** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoCJgMYEtZ9kA7AOnwgBswBiASQDl6AVAbQAYBdRUAB2REALsRK8QAD0QA2AMxkA7BwCsC2QCYAHNI7TpAFlnLlAGhABPRAEZ9+suv1XNHLTrmGAvh7NoM2PISiZFAArpT4JFC0AIoAqgCiAEoAmpw8SCACwqLiUghWSmR6xbLSAJx6pdKaZpYI6kZkZc7ummocCuoNXj7omDgERKTBYRARUQCCADJJ7NziWfgipLmIALRlVmTKpVbqxfqask6ytYha6mSaZY6yZbIKmm3SytI9IL79AUPkAIawAGtxrQAAoTRJzdL8QRLHIZPLqCpkDgcTRWG5WFEqMplM71MoKeyyXQ2IxlDgaHbvT7+QZBVBgASoESRWiJeIsWKJRhpBYw5ZieHWAzI1HoxxY5TNGoWRBGTRkQ66RHHMrqZT6ZTUvq0wLDEjIFlRdmc7m8jKLAWrep2TSqKwOlwKTpoqx40p2BTSZ3PF2YhRa94GjDwDI0gZ6wXQ7IrIUINY2ZRXDhlV5kuRtTV4tbqQn6FGaWwqFwvAqabV+CM-CjUMB8mNRySIQ54nTInFWKV3L0acoVr504ahcKReuw2OgPKHUVY6op0v3aR4hqe4lyDSd8qF-u66v-IGji38uGT843IoKQ5HO6lZqyfTL++KNeyDevZr6dQ7qv0xloI1jlacZaHYBbipiKJSrisoIEYhINCShhShS6qyN+3xBAaAFHg21obISzipnIUoZpepgwaU8jKAUzq5nsyhPOWXgeEAA */
//   id: "orderDecision",    
//   initial: "idle",
//   states: {
//     idle: {
//       on: {
//         INIT: "guiding"
//       }
//     },

//     guiding: {
//       on: {
//         QUERY: "asking",
//         ALERT: "noting"
//       }
//     },

//     asking: {
//       on: {
//         PART: "reporting"
//       }
//     },

//     reporting: {
//       on: {
//         RETURN: "guiding"
//       }
//     },

//     noting: {
//       on: {
//         RETURN: "guiding"
//       }
//     }
//   }
// })

// const base = SpeechRecognition.getRecognition()
// const recognitionList = new window.webkitSpeechGrammarList();


// export default function VoiceEngine () {
  
//   const [state, send] = useMachine(machine);
//   const [chat, chatSet] = useState<UserRequest|null>(null);
//   const [items, itemSet] = useState<Item[]|null>(null);
//   const [choices, choiceSet] = useState<Item[]|null>(null);

//   useEffect(()=>{
//     const get = async function() {
//       const items = await fetchCSV();
//       itemSet(items);
//       let grammar = items.map((item) => {return item.name.split(" ")[0]}).join(" | ");
//       grammar = "#JSGF V1.0; grammar items; public <item> = " + grammar + " ;";
//       recognitionList.addFromString(grammar, 1);
//       if (base) {
//         base.grammars = recognitionList;
//       }
//       console.log(grammar);
//     }
//     get();
//   }, []) 
  
//   function toggle() {
//     if (state.matches("idle")) {
//       sayAI(
//         "Hello! I'm Seidor, and I'm here to guide you with your procurement.",
//         () => {send({type: "INIT"});}
//       );
//     }
//     if (state.matches("askProduct")) {
//       extractWant(transcript, (req: UserRequest) => {chatSet(req)})
//       send({type: 'SPEAK'});
//     }
//   }

//   // Thinking ...

//   useEffect(() => {
//     console.log(chat, items);
//     if (state.matches("thinking") && chat != null && items != null) {
//       const filtered = items.filter(
//         item => fuzzysearch(
//             chat.name.toLocaleLowerCase(), 
//             item.name.toLocaleLowerCase()
//         )
//       )
//       choiceSet(
//         filtered
//       )
//     }
//     // console.log(choices);
//   }, [chat]);
  
//   // Offering (Understood)

//   useEffect(() => {
//     console.log(choices);
//     if (state.matches("thinking")) {
//       if (choices && choices.length > 0) {
//         send({type: "UNDERSTAND"});
//         sayAI("I was able to find the following products.", ()=>{})
//       } else {
//         sayAI("I'm sorry, I couldn't find what you were looking for. Can you give me the ID?",
//           () => {
//             send({type: "FAIL"})
//           }
//         )
//       }
//     }
//   }, [choices])

//   useEffect(() => {
//     if (state.matches("offerProduct")){

//     }
//   }, [choices])

//   // // TryID
//   // useEffect(() => {
//   //   if (state.matches("tryID"))
//   // })

//   const {
//     transcript,
//     interimTranscript,
//     listening,
//   } = useSpeechRecognition();
  
//   // useEffect(() => {
//   //   console.log(transcript);
//   // }, [transcript]);

//   return (
//     // Button for starting and stopping voice recording
//     <div className='relative flex flex-col items-center'>
//       <button
//         onClick={toggle}
//         className={`
//           h-20 w-20 rounded-full border-2
//           ${state.matches("askProduct") ? "border-red-500" : "border-black"} 
//           bg-transparent transform hover:scale-110 transition duration-300"
//         `}
//       >
//         {/* Microphone icon component */}
//         <FontAwesomeIcon icon={faMicrophone} className={`text-3xl ${state.matches("askProduct") ? "text-red-500" : "text-black"}`} />
//       </button>
//       <button 
//         className={`${!state.matches("idle") ? "hidden" : "block"}`}
//         // onClick={}
//         // onClick={() => extractWant("15 carprodyl")}
//       >
//         Make an order
//       </button>
      
//       <p className='text-center'>{transcript}</p>
//       <p className='text-center'>{String(listening)}</p>
//       <button onClick={()=>window.location.reload()}>
//         Start again
//       </button>
//       <div className={`${state.matches("offerProduct") ? "block" : "hidden"}`}>
//         <List
//           items={choices ? choices : []}
//           counts={choices?.map(()=>{return chat ? chat.count : 1})!}
//         />
//       </div>
      
//     </div>
    
//   );
// };
