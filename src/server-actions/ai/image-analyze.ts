import OpenAI from 'openai';

const openai = new OpenAI();

interface ImageAnalyzeProps {
  filePath: string;
}

export async function imageAnalyze({
  filePath,
}: ImageAnalyzeProps): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Examine the image provided meticulously and carry out a detailed analysis. Identify the main visual elements such as subjects, objects, dominant colours and textures. Note the composition and framing of the image, the play of light and shadow, and any remarkable artistic or technical elements. Also describe the general mood or theme that the image seems to convey and any message or idea that the artist may be trying to communicate. Finally, consider the cultural or historical context if applicable. Suggest a file name that encapsulates the essence and main intent of the image for ease of archiving and retrieval at a later date. Return only a proposed filename in French',
          },
          {
            type: 'image_url',
            image_url: {
              url: `${filePath}`,
              detail: 'low',
            },
          },
        ],
      },
    ],
  });
  if (response.choices.length > 0 && response.choices[0].message?.content) {
    return response.choices[0].message.content;
  } else {
    throw new Error('No valid filename suggestion received from OpenAI.');
  }
}
