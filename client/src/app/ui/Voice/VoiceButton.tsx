"use client";
import Router from "next/router";
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useMachine } from '@xstate/react';
import { encode } from '@/app/lib/encoding';
import { say } from '@/app/lib/voice';
import { embed, extractWant } from '@/app/lib/open_encoding';
import { fetchCSV } from '@/app/lib/utils';
import { useEffect, useState } from 'react';
import { setup } from 'xstate';
import { UserRequest } from "@/app/lib/definitions";

// const machine = setup({
//   actions: {
//       start_listening: () => {
//         SpeechRecognition.startListening();
//       },
//       stop_listening: () => {
//         SpeechRecognition.stopListening();
//       },
//       start_thinking: () => {},
//   },
// }).createMachine({
// /** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoCJgMYEtZ9kA7AOnwgBswBiASQDl6AVAbQAYBdRUAB2REALsRK8QAD0QA2AMxkA7BwCsCgEwBODUoCM05Wp0AaEAE9EOtWrIcOAFg4KN0jTrs6FegL5eTaDNh4hKJkAIawANYACqjIEACuuEK0AKqMWACiAEoAyiwAgumcPEggAsKi4lIIHhpk0gAcCsq20iqyys4KJuYIag3WOrIcOsp2LbIKDdIKPn7omDgERKRhkTFxickAYvn0ADLF4uX4IqRViAC0OqNkDXbOGspDWpbdZhZPZDoadmrSjRaLWkljmIH8iyCK3I4WisQSSVoAGEAPIAWSi+wyLAyR1KJzOYlK1UmNiGHFklIUdlkQ3UPUQsn0ZFkzmkdgBUx0tjUYIhgWWIVhGwRySRhSRGUO3GOglOlWJiAayjIdnGtI5HQeHH+DJqTlV+hpyoaHAaOmmdj5CwFwVWyAAZg7MCKtrRdgc8fw5YSLghZObFKo2mo7EpzTc9ZS7Kqxi0mqpZH8w9aAks7eRHc7UK7ETkUkjJRksF6yj6FaASSDvsNbBx9FYptS9YY6hxfloWhp-homrzfOCbenoWEIBBc8kstiUllGKWCRXJIg1LY7jNahTnj93r1RjoyP8KW8HrJDA1ZKnIYLVrhSA78KgALZYUh0RgolgAAiwKMYuJl+LlucioINcrKKBSyrKMoLimvSHwIGq+4cmoCjSKG55JuyswDvyw4hLeJD3k+L4kHQP5-vOQFEpWy5qCqaFqKearKMMShMnqSGGqhTgtGhowXmCJBxHA4h4VCi4LsBtGgRaCgQQG0Ewb2jhqHqlyoaqtjnsqaG9k8TKXraI6UDQsoVNJS6IQ0eptDYrydKyaGni4Rn4aswrwls5nypZJINGQ2iuI0K5KNSHgtqadymqMfHUuaVq4UOEn2k6LpeUkPm+iBHTyCong6kpyjmpMkUcNFIyau2DQNM4yhuSlMJjhOWWLiSMGKM0yoAm4zT1nYep7gebSntoCgdBojgNde5CEcRz6vq1fmMvITKeJNypORosice43GMXYmEcol8xpo1ZC4KgYChEIYD7IQQhLTRVlrZ1tX-KMchaOMu3IehB1HeyPg+EAA */
//   id: "orderDecision",    
//   initial: "idle",
//   states: {
//       idle: {
//           on: {
//               INIT: "askProduct"
//           }
//       },

//       askProduct: {
//           on: {
//             UNDERSTAND: "offerProduct",
//             FAIL: "askProduct",
//             COMPLETE: "confirmDone",
//             CANCEL: "idle"
//           },
//           entry:[{ type: 'start_listening' }],
//           exit:[{ type: "stop_listening" }],
          
//       },

//       offerProduct: {
//           on: {
//               FAIL: "askProduct",
//               SUCCEED: "addProduct"
//           }
//       },

//       addProduct: {
//           on: {
//               RETURN: "askProduct"
//           }
//       },

//       confirmDone: {
//           on: {
//               DONE: "createList",
//               "NOT DONE": "askProduct"
//           }
//       },

//       createList: {}
//   }
// })
let current_state = "idle";
export default function VoiceEngine () {
  
  // const [state, send] = useMachine(machine);
  // const [chat, chatSet] = useState<UserRequest|null>(null);

  function toggle() {
    if (state.matches("idle")) {

      say(
        "Hello! I'm Seidor, and I'm here to help you with your order. What parts would you like?",
        () => {send({type: "INIT"});}
      );
    }
    if (state.matches("askProduct")) {
      send({type: 'CANCEL'});
    }
  }


  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

    // do some processing
    useEffect(() => {
      console.log("effect");
      async function getWants() {
        console.log(transcript);
        const extracted = await extractWant(transcript);
        console.log(state.value);
        console.log(extracted);
        chatSet(extracted);
      }
      if (state.matches("askProduct") && !listening) {
        getWants();
        send({type: 'UNDERSTAND'});
      }
      
    }, [state]);
  

  return (
    // Button for starting and stopping voice recording
    <div className='relative flex flex-col items-center'>
      <button
        onClick={toggle}
        className={`
          h-20 w-20 rounded-full border-2
          ${state.matches("askProduct") ? "border-red-500" : "border-black"} 
          bg-transparent transform hover:scale-110 transition duration-300"
        `}
      >
        {/* Microphone icon component */}
        <FontAwesomeIcon icon={faMicrophone} className={`text-3xl ${state.matches("askProduct") ? "text-red-500" : "text-black"}`} />
      </button>
      <button 
        className={`${!state.matches("idle") ? "hidden" : "block"}`}
        // onClick={}
        // onClick={() => extractWant("15 carprodyl")}
      >
        Make an order
      </button>
      
      <p className='text-center'>{transcript}</p>
      <p className='text-center'>{String(listening)}</p>
      <button onClick={()=>window.location.reload()}>
        Start again
      </button>
    </div>
  );
};


{/* <button onClick={() => encode(
        {
          queries:["the quick brown fox"],
          responses:["the large brown bear"]
        }
      )}>
        Test
      </button> */}