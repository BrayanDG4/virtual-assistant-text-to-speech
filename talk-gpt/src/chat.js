import { Configuration, OpenAIApi } from "openai";

// Configurar la clave de la API
const configuration = new Configuration({
  apiKey: "",
});

// Inicializar OpenAIApi con la configuración
const openai = new OpenAIApi(configuration);

export const requestGpt = async (prompt) => {
  try {
    // Realizar la solicitud al modelo GPT-3
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0,
    });

    // Extraer texto de la respuesta
    const text = response.data.choices[0].text;

    return text;
  } catch (error) {
    console.error("Error al realizar la solicitud a OpenAI:", error);
    throw error;
  }
};
