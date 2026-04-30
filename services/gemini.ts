import { GoogleGenAI } from "@google/genai";

// Fix: obtain API key exclusively from process.env.API_KEY and initialize inside the function
export const getGeminiResponse = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  try {
    // Fix: Using correct GenerateContentParameters and ensuring thinkingBudget is set with Gemini 3
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction:
          "You are a professional Petroleum Software Expert Assistant. You provide detailed technical advice on software like Petrel, Eclipse, Landmark, Paradigm, and other oil and gas industry tools. Be concise, technical, and accurate. Use markdown for formatting.",
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    // Fix: Accessing .text property directly (not a method) as per guidelines
    return (
      response.text ||
      "I'm sorry, I couldn't process that technical request. Please try again."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the knowledge engine.";
  }
};
