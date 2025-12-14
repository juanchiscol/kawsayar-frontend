import { GoogleGenAI } from "@google/genai";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SYSTEM_INSTRUCTION = `
Actúa como un asistente médico experto y empático especializado ÚNICAMENTE en la anemia. 

Tus responsabilidades son:
1. Responder preguntas sobre síntomas, causas, tipos (ferropénica, perniciosa, etc.), tratamientos dietéticos y consejos generales para vivir con anemia.
2. Sugerir alimentos ricos en hierro y combinaciones para mejorar la absorción.
3. Explicar términos médicos relacionados con la anemia de forma sencilla.

Restricciones estrictas:
- Si el usuario pregunta sobre cualquier tema NO relacionado con la anemia o la hematología básica relacionada (como deportes, política, programación, reparación de autos, etc.), rechaza amablemente la respuesta diciendo: "Lo siento, mi conocimiento se limita exclusivamente a la anemia y temas de salud relacionados. ¿Tienes alguna duda sobre la anemia que pueda resolver?"
- NUNCA proporciones diagnósticos médicos definitivos. Siempre incluye un descargo de responsabilidad aconsejando visitar a un médico para un diagnóstico y tratamiento profesional.
- Mantén un tono profesional, calmado y de apoyo.
`;

const MODEL_ID = "gemini-2.5-flash";

export type ChatRole = "user" | "bot";
export type ChatMessage = { role: ChatRole; text: string };

export async function askAnemiaAssistant(question: string): Promise<string> {
  const trimmed = question.trim();
  if (!trimmed) {
    throw new Error("Escribe una pregunta sobre anemia.");
  }

  const apiKey = (typeof process !== "undefined" && (process as any)?.env?.EXPO_PUBLIC_GEMINI_API_KEY) as
    | string
    | undefined;
  if (!apiKey) {
    throw new Error(
      "Configura EXPO_PUBLIC_GEMINI_API_KEY en tu entorno antes de arrancar Expo (o reinicia el bundler tras cambiarla)."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  const maxRetries = 2;
  const baseDelayMs = 2000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const chat = ai.chats.create({
        model: MODEL_ID,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const response = await chat.sendMessage({ message: trimmed });
      const responseText = response.text?.trim();
      if (!responseText) {
        throw new Error("No se obtuvo respuesta del modelo.");
      }
      return responseText;
    } catch (err) {
      const status = err instanceof Error && (err as any).status ? (err as any).status : null;
      if (status === 429 && attempt < maxRetries) {
        const waitMs = baseDelayMs * (attempt + 1);
        await sleep(waitMs);
        continue;
      }
      if (status === 429) {
        throw new Error("La API sigue limitada (429) después de reintentar. Intenta en 30 segundos.");
      }
      if (status === 401 || status === 403) {
        throw new Error("La API key no es válida o no tiene permisos.");
      }
      throw new Error("No se pudo obtener respuesta del servicio de IA.");
    }
  }

  throw new Error("No se pudo obtener respuesta del servicio de IA.");
}
