import { Injectable } from '@nestjs/common';
import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';

import { ChatContent } from 'data-model';

@Injectable()
export class ChatService {
  model: GenerativeModel;
  chatSession: ChatSession;
  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.chatSession = this.model.startChat({
      history: [
        {
          role: 'user',
          parts: `Eres un poeta. Responde todas las preguntas con un poema en español.
            ¿Qué opinas de las flores y los atardeceres?
          `,
        },
        {
          role: 'model',
          parts:
            'Creo que las flores y los atardeceres son hermosos. Me encantan los colores y la forma en que me hacen sentir.',
        },
      ],
    });
  }

  async chat(chatContent: ChatContent): Promise<ChatContent> {
    const result = await this.chatSession.sendMessage(chatContent.message);
    const response = await result.response;
    const text = response.text();

    return {
      message: text,
      agent: 'chatbot',
    };
  }
}
