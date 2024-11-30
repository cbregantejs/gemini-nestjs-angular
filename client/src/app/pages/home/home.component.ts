import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MarkdownModule } from 'ngx-markdown';

import { GeminiService } from '../../gemini.service';
import { ClientChatContent } from '../../client-chat-content';
import { LineBreakPipe } from '../../line-break.pipe';
import { finalize } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type ImageFile = { preview: string; file: File };


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    LineBreakPipe,
    MarkdownModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  customForm: FormGroup;
  message = '';
  contents: ClientChatContent[] = [];
  startTexts: {type: string, text: string}[] = [
    {
      type: 'text',
      text: `Bienvenido a tu aplicación Gemini + NestJs + Angular ❤️ <br>
        Escribe algo para comenzar.`
    },
    {
      type: 'chat',
      text: `Bienvenido a tu aplicación Gemini + NestJs + Angular ❤️ <br>
        Escribe algo para comenzar.`
    },
    {
      type: 'vision',
      text: `Bienvenido a tu aplicación Gemini + NestJs + Angular ❤️ <br>
        Escribe un texto y adjunta una imagen para comenzar.`
    }
  ];
  messageStart: string = this.startTexts[0].text;
  options: {value: string, viewValue: string}[] = [
    {value: 'text', viewValue: 'Texto'},
    {value: 'chat', viewValue: 'Poeta'},
    {value: 'vision', viewValue: 'Imagenes'},
  ];
  imageFile: ImageFile | undefined;
  inputImage: any;

  constructor(private geminiService: GeminiService, private fb: FormBuilder) {
    this.customForm = this.fb.group({
      option: [this.options[0].value, Validators.required],
    });
  }

  changeMethod(): void {
    this.contents = [];
    this.messageStart = this.startTexts.find(startText => startText.type === this.customForm.value.option)?.text || '';
  }

  generateText(message: string): void {
    const method = this.customForm.value.option;
    if( method === 'vision' && !this.imageFile) {
      return;
    }
    const chatContent: ClientChatContent = {
      agent: 'user',
      message,
      imagePreview: method === 'vision' ? this.imageFile?.preview : undefined,
    };

    const file = this.imageFile ? this.imageFile.file : undefined;

    this.contents.push(chatContent);
    this.contents.push({
      agent: 'chatbot',
      message: '...',
      loading: true,
    });

    this.message = '';
    this.imageFile = undefined;
    
    
    this.geminiService.generate(chatContent, method, file)
      .pipe(
        finalize(() => {
          const loadingMessageIndex = this.contents.findIndex(
            (content) => content.loading
          );
          if (loadingMessageIndex !== -1) {
            this.contents.splice(loadingMessageIndex, 1);
          }
        })
      )
      .subscribe((content) => {
        this.contents.push(content);
      });
  }

  selectImage(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const preview = e.target?.result as string;
        this.imageFile = {file, preview};
      };

      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.imageFile = undefined;
    this.inputImage.value='';
  }

}
