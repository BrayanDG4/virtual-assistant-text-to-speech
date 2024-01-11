import { useState, useEffect } from "react";
import { MagicMotion } from "react-magic-motion";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import micro from "./assets/micro.svg";
import { requestGpt } from "./chat.js";

import BeatLoader from "react-spinners/BeatLoader";

function App() {
  const { text, startListening, isListening, hasRecognitionSupport } =
    useSpeechRecognition();

  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // const getResponseGpt = async (prompt = text) => {
  //   const response = await requestGpt(prompt);
  //   return response;
  // };

  const prompt = `Act as a virtual assistant and appropriately answer the following request in English: "${text}"`;

  const handleButtonClick = async () => {
    try {
      setIsLoading(false);
      const responseGpt = await requestGpt(prompt);

      const response = await fetch("http://127.0.0.1:8000/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phrase: responseGpt }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioSrc = URL.createObjectURL(blob);
        setAudioUrl(audioSrc);
        setIsLoading(true);
        playAudio(audioSrc);
        console.log(responseGpt);
      } else {
        console.error("Error al obtener el archivo de audio");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const playAudio = (url) => {
    const audio = new Audio(url);
    audio.play().catch((error) => {
      console.error("Error al reproducir el audio:", error);
    });
  };

  return (
    <MagicMotion>
      <div className="w-full h-[100vh] flex justify-center items-center bg-gray-100">
        {hasRecognitionSupport ? (
          <>
            <button onClick={startListening} className="w-[30%] bg-cover">
              <img className="w-full h-auto" src={micro} />
            </button>

            {isListening ? <div className="text-xl">Escuchando...</div> : null}

            <div className="mx-2">
              <h3 className="text-xl">{text}</h3>
            </div>

            <button
              className="bg-white p-2 border-solid border-2 border-gray-100 shadow-sm bg-opacity-40 rounded-md hover:bg-gray-300 transition-all duration-300"
              onClick={handleButtonClick}
            >
              {isLoading ? "Obtener Respuesta" : <BeatLoader color="#ffffff" />}
            </button>

            {audioUrl && (
              <audio controls>
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            )}
          </>
        ) : (
          <h1 className="text-5xl font-bold text-gray-600">
            Oops! Tu navegador no soporta reconocimiento por voz.
          </h1>
        )}
      </div>
    </MagicMotion>
  );
}

export default App;
