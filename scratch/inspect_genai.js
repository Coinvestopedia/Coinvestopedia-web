import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'test' });
console.log('Keys of GoogleGenAI instance:', Object.keys(ai));
if (ai.models) console.log('Keys of ai.models:', Object.keys(ai.models));
console.log('Is getGenerativeModel a function?', typeof ai.getGenerativeModel === 'function');
