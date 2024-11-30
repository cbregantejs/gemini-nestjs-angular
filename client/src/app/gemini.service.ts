import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientChatContent } from './client-chat-content';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  constructor(private httpClient: HttpClient) { }

  generate(chatContent: ClientChatContent, method: string, file?: File): Observable<ClientChatContent> {
    console.log(method)
    if (method === 'chat') {
      return this.chat(chatContent);
    }
    if (method === 'vision') {
      if (file) {
        return this.vision(chatContent, file);
      }
      throw new Error('File is required for vision method');
    }
    return this.text(chatContent);
  }

  chat(chatContent: ClientChatContent): Observable<ClientChatContent> {
    return this.httpClient.post<ClientChatContent>('http://localhost:3000/api/chat', chatContent);
  }

  text(chatContent: ClientChatContent): Observable<ClientChatContent> {
    return this.httpClient.post<ClientChatContent>('http://localhost:3000/api/text', chatContent);
  }
  
  vision(chatContent: ClientChatContent, file: File): Observable<ClientChatContent> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('message', chatContent.message);
    return this.httpClient.post<ClientChatContent>('http://localhost:3000/api/vision', formData);
  }
}
