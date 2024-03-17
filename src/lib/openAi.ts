import { Configuration, OpenAIApi } from '@openai/sdk';

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export async function analyzeTextWithGPT3(text: string): Promise<string> {
  const prompt = `Bonjour GPT,\n\n${text}\n\nMerci pour ton aide.`;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 1024,
    temperature: 0.5,
  });

  return response.data.choices[0].text.trim();
}
