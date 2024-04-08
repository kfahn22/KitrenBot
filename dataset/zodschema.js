//https://js.langchain.com/docs/modules/chains/popular/structured_output

// https://api.js.langchain.com/functions/langchain_chains_openai_functions.createStructuredOutputRunnable.html

// Not sure if this is correct; only available with OpenAI

import * as dotenv from "dotenv";
dotenv.config();

import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { createStructuredOutputRunnable } from "langchain/chains/openai_functions";
import { TextLoader } from "langchain/document_loaders/fs/text";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

const zodSchema = z.object({
  user: z.string().describe("User name"),
  assistant: z.string().describe("AI agent"),
  question: z.string().describe("User question"),
  response: z.string().describe("AI response"),
});

const loader = new TextLoader("the_black_box.txt");
const docs = await loader.load();

const prompt = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      "Generate a hypothetical conversation between a user whio asks a question and an assistant that provides an answer. Provide five questions and five answers."
    ),
    HumanMessagePromptTemplate.fromTemplate("Additional context: {inputText}"),
  ],
  inputVariables: ["inputText"],
});

const model = new ChatOpenAI();

// Instantiate Model
// const llm = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
//   modelName: "gemini-pro",
//   maxOutputTokens: 2048,
//   safetySettings: [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//     },
//   ],
// });

const chain = createStructuredOutputRunnable(zodSchema, {
  prompt,
  llm,
  outputKey: "messages",
});

const response = await chain.call({
  inputText: docs,
});

console.log(JSON.stringify(response, null, 2));

/*
  {
    "person": {
      "name": "Sophia",
      "surname": "Martinez",
      "age": 32,
      "birthplace": "Mexico City, Mexico",
      "appearance": "Sophia has long curly brown hair and hazel eyes. She has a warm smile and a contagious laugh.",
      "shortBio": "Sophia is a passionate environmentalist who is dedicated to promoting sustainable living. She believes in the power of individual actions to create a positive impact on the planet.",
      "university": "Stanford University",
      "gender": "Female",
      "interests": [
        "Hiking",
        "Yoga",
        "Cooking",
        "Reading"
      ]
    }
  }
*/
