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

const machine = setup({
  actions: {
      start_listening: () => {
        SpeechRecognition.startListening();
      },
      stop_listening: () => {
        SpeechRecognition.stopListening();
      },
      start_thinking: () => {},
  },
}).createMachine({
/** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoCJgMYEtZ9kA7AOnwgBswBiASQDl6AVAbQAYBdRUAB2REALsRK8QAD0QA2AMxkA7BwCsCgEwBODUoCM05Wp0AaEAE9EOtWrIcOAFg4KN0jTrs6FegL5eTaDNh4hKJkAIawANYACqjIEACuuEK0AGIAgvQAMpw8SCACwqLiUggAtDo6ymQAHHbOGso6slqWCibmCDoNZF12atLS1coqHNKWPn7omDgERKRhkTFxickAwgDyALJRmQCiLLs54gX4IqTFiMrydqqWHFr9drJ9yu2IfRw1XbIcOtXVfycGgmIH80yCc3I4WisQSSVoqzSjFWu2y3GOglORTyJSGZDsN1kbjkyjqHH6b06Tnx+ieQ2qHAB1WkdhBYMCsxC0KWcOSAGUors0gBpI55E5nMQ4xBqBTSMiyORjIbuYmvMwyhRVTSuWq2cluSpsqYc4LzZAAMwtmB5K1SGTRuX4mMlFwQsmZZBZsgMdnU7hUxg17uU1S+Yw9FT01U8xoCMzN5Et1tQtvhfIAqqsUbssGLnYVztKENIFAoyFYurZFcpXBpZJSGT1dcoxpU3DHlHHwZz5qEIBA08kAEr7DPDxj5-Iu7GgEpqf5kVvVFoKZp9H3qjqefFyjhE2WthzM7umyFkXCkC34VAAWywpDoWHWjEO6PFM6Lc5lfQro1V6iGrY0iUsMOiKKocpjKGvRqKeCbnpeJDXneD4kHQjDrCwAAEz6vlOEqzpIiDlGo8hqLWcrVD8xIKHUoG-BBZZ1E0zQUYq8EQiEQgABb4CQET8VAtAZowWC7MOfIsEiebvgWWJfsRCB1Boiidjcqg+n6eiUoeFYPL8fQqdInG9uQvH8YJJDCekWQEZ+UrfspbherUnj2Hoa7OJSRLlh6vzKKG7GVHBIIkHEcDiOyCFEYRiklOUO4Udogw0XYpZbiRsr4rY1QUZYhh5SoJm+KCJoxfMlA0BihaOUpdjVJS0ifPcri1s0cqyP0wKldFXF9ossIrDVCl1SUHpkNoriDGojiOO4bTBgunz-AFwzMQCrK9eV-VJlaNpDUkI2usWgzyrNhhyrKC4Eg2S3NWpfyEqMhkcdt8a7WEA5DsdRElMM1iyIqgykvuTiOJSO5+s1B5aiyjIlZMH1mReV43vej6-fF7yqQCrQAlYRIaAx4FasxrhAxo7GmYmF6oGAoRCGAmSEEIWNjYgHp2BWZG-M8ah+mxJNMXRFNsVcNPnhZAlCezboOFUzIeNRcg3FTai6R4PO1mMGgro4PU+EAA */
  id: "orderDecision",    
  initial: "idle",
  states: {
    idle: {
        on: {
            INIT: "askProduct"
        }
    },

    askProduct: {
        on: {
          FAIL: "askProduct",
          COMPLETE: "confirmDone",
          CANCEL: "idle",
          SPEAK: "thinking"
        },
        entry:[{ type: 'start_listening' }],
        exit:[{ type: "stop_listening" }],
        
    },

    offerProduct: {
        on: {
            FAIL: "askProduct",
            SUCCEED: "addProduct"
        }
    },

    addProduct: {
        on: {
            RETURN: "askProduct"
        }
    },

    confirmDone: {
        on: {
            DONE: "createList",
            "NOT DONE": "askProduct"
        }
    },

    createList: {},
    thinking: {
      on: {
        UNDERSTAND: "offerProduct",
        FAIL: "askProduct"
      }
    }
  }
})

const base = SpeechRecognition.getRecognition()
export default function VoiceEngine () {
  
  const [state, send] = useMachine(machine);
  const [chat, chatSet] = useState<UserRequest|null>(null);
  
  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  function toggle() {
    if (state.matches("idle")) {

      say(
        "Hello! I'm Seidor, and I'm here to help you with your order. What parts would you like?",
        () => {send({type: "INIT"});}
      );
      base?.addEventListener("speechend", () => {
        async function checkProduct() {
          const input = transcript;
          console.log(input);  
          const extracted = await extractWant(
            input
          );
          console.log(extracted);
          send({type: 'UNDERSTAND'});
        };
        setTimeout(()=>{checkProduct()}, 1000);
        send({type: 'SPEAK'});
      }, {once: true})
    }
    if (state.matches("askProduct")) {
      send({type: 'CANCEL'});
    }
  }

  

  // useEffect(() => {
    
    
  //   console.log(interimTranscript);
  //   if (state.matches("askProduct") && !listening && interimTranscript.length > 0) {
  //     console.log(transcript);
  //     console.log(interimTranscript);
      
  //   }
  // })

  
  

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