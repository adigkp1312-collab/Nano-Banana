import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerationParams, SourceImage, ThumbnailParams } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAspectRatio = (aspectRatioValue: string): string => {
    const match = aspectRatioValue.match(/\(([^)]+)\)/);
    // Return the matched ratio, or a default if for some reason it doesn't match.
    return match ? match[1] : '16:9';
};

const buildGenerationPrompt = (params: GenerationParams): string => {
  const upscaleKeywords = params.upscale ? 'ultra realistic, 4k, high detail, sharp focus, professional photography, ' : '';
  
  const aspectRatio = getAspectRatio(params.aspectRatio);

  // By making the aspect ratio a direct, forceful instruction at the start of the prompt,
  // we significantly increase the likelihood that the model will follow it.
  return `Aspect Ratio: ${aspectRatio}. A ${params.style} style image of ${upscaleKeywords}${params.primaryCharacter} ${params.location}. The camera shot is a ${params.cameraAngle}.`;
};

export const generateImage = async (params: GenerationParams): Promise<string> => {
  const prompt = buildGenerationPrompt(params);
  const parts: any[] = [];

  if (params.styleReferenceImage) {
    parts.push({ text: "Use the following image for artistic style reference." });
    parts.push({
      inlineData: {
        data: params.styleReferenceImage.data,
        mimeType: params.styleReferenceImage.mimeType,
      },
    });
  }

  if (params.characterReferenceImage) {
    parts.push({ text: "Use the following image for character reference." });
    parts.push({
      inlineData: {
        data: params.characterReferenceImage.data,
        mimeType: params.characterReferenceImage.mimeType,
      },
    });
  }
  
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check your prompt and API key.");
  }
};

export const editImage = async (sourceImage: SourceImage, editPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: sourceImage.data,
              mimeType: sourceImage.mimeType,
            },
          },
          {
            text: editPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in response after editing.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image. The model may not have been able to apply the change.");
  }
};

export const generateThumbnail = async (params: ThumbnailParams): Promise<string> => {
    const promptParts: string[] = [
        "Create a compelling, eye-catching YouTube thumbnail with a 16:9 aspect ratio.",
        `The style should be '${params.style}'.`,
        `It must feature the following text prominently, with high contrast and readability: "${params.title}"`,
    ];

    if (!params.referenceImage) {
        promptParts.push("Generate an interesting and relevant background for the title.");
    } else {
        promptParts.push("Use the provided image as the background or main subject, integrating the text and style seamlessly onto it.");
    }

    const prompt = promptParts.join(' ');
    const parts: any[] = [];
  
    if (params.referenceImage) {
      parts.push({
        inlineData: {
          data: params.referenceImage.data,
          mimeType: params.referenceImage.mimeType,
        },
      });
    }
    parts.push({ text: prompt });
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: parts,
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
  
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
      throw new Error("No image data found in thumbnail response.");
  
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      throw new Error("Failed to generate thumbnail. Please check your prompt and API key.");
    }
  };