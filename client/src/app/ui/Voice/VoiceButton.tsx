"use client";

import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useMachine } from '@xstate/react';
import { orderMachine } from "@/app/lib/voice_states/order"


export default function VoiceButton () {
  
  const [state, send] = useMachine(orderMachine);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  return (
    // Button for starting and stopping voice recording
    <div>
      <button
        onMouseDown={SpeechRecognition.startListening}    // Start recording when mouse is pressed
        onMouseUp={SpeechRecognition.stopListening}        // Stop recording when mouse is released
        onTouchStart={SpeechRecognition.startListening}    // Start recording when touch begins on a touch device
        onTouchEnd={SpeechRecognition.stopListening}        // Stop recording when touch ends on a touch device
        className="h-20 w-20 rounded-full border-2 border-black bg-transparent transform hover:scale-110 transition duration-300"
      >
        {/* Microphone icon component */}
        <FontAwesomeIcon icon={faMicrophone} className='text-3xl' />
      </button>
      
      <p>{transcript}</p>
    </div>
  );
};