"use client"
import { say } from "@/app/lib/voice";
import List from "@/app/ui/List/list";
// import VoiceEngineBeta from "@/app/ui/Voice/VoiceEngineBeta";
import VoiceEngine from "@/app/ui/Voice/VoiceEngine";


export default function Guidance() {
    return (
        <div>
            <VoiceEngine />
        </div>
    )
}