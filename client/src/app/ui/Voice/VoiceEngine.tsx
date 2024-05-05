"use client";

import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useMachine } from '@xstate/react';
import { embed, extractCount, extractWant, sayAI } from '@/app/lib/open_encoding';
import { fetchCSV } from '@/app/lib/utils';
import { useEffect, useState } from 'react';
import { setup } from 'xstate';
import { Item, UserRequest } from "@/app/lib/definitions";

import fuzzysearch from "fuzzysearch-ts";
import List from "../List/list";

const machine = setup({
  actions: {
      start_listening: () => {
        SpeechRecognition.startListening({continuous: true});
      },
      stop_listening: () => {
        SpeechRecognition.stopListening();
      },
      start_thinking: () => {},
  },
}).createMachine({
/** @xstate-layout N4IgpgJg5mDOIC5QHsBOEyoCJgMYEtZ9kA7AOnwgBswBiASQDl6AVAbQAYBdRUAB2REALsRK8QAD0QA2AMxkA7BwCsCgEwBODUoCM05Wp0AaEAE9EOtWrIcOAFg4KN0jTrs6FegL5eTaDNh4hKJkAIawANYACqjIEACuuEK0AGIAgvQAMpw8SCACwqLiUggAtDo6ymQAHHbOGso6slqWCibmCDoNZF12atLS1coqHNKWPn7omDgERKRhkTFxickAwgDyALJRmQCiLLs54gX4IqTFiMrydqqWHFr9drJ9yu2IfRw1XbIcOtXVfycGgmIH80yCc3I4WisQSSVoqzSjFWu2y3GOglORTyJSGZDsN1kbjkyjqHH6b06Tnx+ieQ2qHAB1WkdhBYMCsxC0KWcOSAGUors0gBpI55E5nMQ4xBqBTSMiyORjIbuYmvMwyhRVTSuWq2cluSpsqYc4LzZAAMwtmB5K1ofIAqqsUbssGL+JjJRcENIFAoyFYurZFcpXBpZJSGT1dcoxpU3NUtcaAjMzVCIBBbfCAEr7B3Zxju-Ke7GgEpqf5kWPVFoKZp9WTKdUdTz4uUcImy2MOZnJ8Gc+a4UgW-CoAC2WFIdCw60Yh3R4pL52lCDUfQDo1V6kNtmklOGOkUqjlY2UAI0fT7pshZCHJBH48nJDojHWLAABDO50WJaXJIhyjUeQ1FDOVqh+YkFDqfdfiPP06iaZoQMVK9UxvIQAAt8BICJsKgWgHUYLBdmzPkWCRN0Fw9QplzLd5XADOM6gBUNDTaDVVy1AMHnsJ5encWRUIhEJMOw3CSHw9Ish-JcpTohAHA0RQw2kWwmxcQZKVkWR-SBP5LFDH4NDUISB3IIRUFMegsAIoiSLIiiZJouT-wQWN5D+MY1A7LU1w7Sk+mqNt41UFwmyJUy0zICyrJsqS0VyaisVo1yKyqX1VJrXcz2cLTBmjHTZGqCtHFU30fF8EASDiOBxHZNC-1-FKSnKVsQO0QYILsX1mwA2V8VscDXH0EDRjrSKb0oGgMWc707GqSlVJsFpDI62R+mBSr6uE+ZuVhFYZuSlySiKshtGG4rHEcdx2I6EqagZSphnggFWS2k0GvmUScLww6vRXHt8TPMZwzkdbfUpbylKeK59BZaQgNjZQJpCS1rVQLMhD+v8ShcT4oLxhHBnsYzIa4nU-gcWxDHcZH3pTHb00zfakmx5rLnJBVFUGUkfI0RxKVbOx207LUWUZaQUcHYdRwnKc2eO+ivlaAErCJDQYMPLV4NcbTjKuKXyFwVAwFCIQwEyQgscXWaVyKuwAyA35njXOtSY4g84Kg3WkIN+n+yimLrIV716zOjtXC6RoiQURMAu8r5w1+f5AS0CqvCAA */
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

    thinking: {
      on: {
        UNDERSTAND: "offerProduct",
        FAIL: "tryID"
      }
    },

    offerProduct: {
        on: {
          SUCCEED: "addProduct"
        },
        entry:[{ type: 'start_listening' }],
        exit:[{ type: "stop_listening" }],
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

    tryID: {
      on: {
        UNDERSTAND: "offerProduct",
        FAIL: "tryID"
      }
    }
  }
})

const base = SpeechRecognition.getRecognition()
const recognitionList = new window.webkitSpeechGrammarList();


export default function VoiceEngine () {
  
  const [state, send] = useMachine(machine);
  const [chat, chatSet] = useState<UserRequest|null>(null);
  const [items, itemSet] = useState<Item[]|null>(null);
  const [choices, choiceSet] = useState<Item[]|null>(null);
  const [index, indexSet] = useState<number>(0)

  useEffect(()=>{
    const get = async function() {
      const items = await fetchCSV();
      itemSet(items);
      let grammar = items.map((item) => {return item.name.split(" ")[0]}).join(" | ");
      grammar = "#JSGF V1.0; grammar items; public <item> = " + grammar + " ;";
      recognitionList.addFromString(grammar, 1);
      if (base) {
        base.grammars = recognitionList;
      }
      console.log(grammar);
    }
    get();
  }, []) 
  
  function toggle() {
    if (state.matches("idle")) {
      sayAI(
        "Hello! I'm Seidor, and I'm here to help you with your order. What would you like to order?",
        () => {send({type: "INIT"});}
      );
    }
    if (state.matches("askProduct")) {
      extractWant(transcript, (req: UserRequest) => {chatSet(req)})
      send({type: 'SPEAK'});
    }
    if (state.matches("offerProduct")) {
      extractCount(transcript, (res: number) => {indexSet(res)})
      send({type: 'SUCCEED'});
    }
  }

  // Thinking ...

  useEffect(() => {
    console.log(chat, items);
    if (state.matches("thinking") && chat != null && items != null) {
      const filtered = items.filter(
        item => fuzzysearch(
            chat.name.toLocaleLowerCase(), 
            item.name.toLocaleLowerCase()
        )
      )
      choiceSet(
        filtered
      )
    }
    // console.log(choices);
  }, [chat]);
  
  // Offering (Understood)

  useEffect(() => {
    console.log(choices);
    if (state.matches("thinking")) {
      if (choices && choices.length > 0) {
        sayAI("I was able to find the following products.", ()=>{
          send({type: "UNDERSTAND"});
        })
      } else {
        sayAI("I'm sorry, I couldn't find what you were looking for. Can you give me the ID?",
          () => {
            send({type: "FAIL"})
          }
        )
      }
    }
  }, [choices])

  useEffect(() => {
    if (state.matches("offerProduct")){

    }
  }, [choices])

  // // TryID
  // useEffect(() => {
  //   if (state.matches("tryID"))
  // })

  const {
    transcript,
    interimTranscript,
    listening,
  } = useSpeechRecognition();
  
  // useEffect(() => {
  //   console.log(transcript);
  // }, [transcript]);

  return (
    // Button for starting and stopping voice recording
    <div className='relative flex flex-col items-center pt-20'>
      <button
        onClick={toggle}
        className={`
          h-20 w-20 rounded-full border-2
          ${listening ? "animate-pulse animate-bounce border-red-500" : "border-black"} 
          bg-transparent transform hover:scale-110 transition duration-300"
        `}
      >
        {/* Microphone icon component */}
        <FontAwesomeIcon icon={faMicrophone} className={`text-3xl  ${listening ? " text-red-500" : "text-black"}`} />
      </button>
      
      <button className='mt-5 hover:scale-110' onClick={()=>window.location.reload()}>
        Start again
      </button>
      
      <p className='text-center'>{transcript}</p>

      <div className={`${state.matches("offerProduct") ? "block" : "hidden"}`}>
        <List
          items={choices ? choices : []}
          counts={choices?.map(()=>{return chat ? chat.count : 1})!}
        />
      </div>
      
    </div>
    
  );
};
