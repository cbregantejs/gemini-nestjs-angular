# A Chatbot using Angular, NestJS and the Gemini API

This project has been implemented entirely using the `TypeScript` language.


## Features

This project currently supports:

- Multi-turn conversations (Chatbot application)
- Text Generation
- Image Processing

### Get an API Key from Google AI Studio

Go to the [Google AI Studio](https://aistudio.google.com/app/) website and generate an API Key.

Next, create an `.env` file under the `/server` directory with the API key value you generated(You'll find a `.env.example` file as an example there):

```txt
API_KEY=<Your API Key goes here>
```

### Preview the Application
This project is based on Nx tooling. If you don't have Nx installed, you can do so by using:

```bash
npm add --global nx@latest
```

Open other command line window and run following commands:

```bash
npm install
npx nx serve client 
npx nx serve server
```

