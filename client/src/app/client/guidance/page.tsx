"use client"
import { say } from "@/app/lib/voice";
import List from "@/app/ui/List/list";
import VoiceButton from "@/app/ui/Voice/VoiceButton";


export default function Guidance() {
    return (
        <div>
            <p>Hello World</p>
            <VoiceButton />
            <button onClick={() => say("I'm very sorry, but I could not find that part.")}>
                Say Something
            </button>
        </div>
    )
}