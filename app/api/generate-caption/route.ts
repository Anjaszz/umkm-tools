import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageData, mimeType } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let contents;
    
    if (imageData) {
      contents = [
        {
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: imageData,
          },
        },
        { text: prompt }
      ];
    } else {
      contents = [
        { text: prompt }
      ];
    }

    console.log("Generating caption with contents:", JSON.stringify(contents).substring(0, 200));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return NextResponse.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error("Error generating caption detailed:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate caption", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
