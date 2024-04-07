// https://js.langchain.com/docs/expression_language/cookbook/prompt_llm_parser

import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const promptTemplate = PromptTemplate.fromTemplate(
  "Tell me a joke about {topic}"
);
const chain = promptTemplate.pipe(model);

const result = await chain.invoke({ topic: "coding" });

console.log(result);
