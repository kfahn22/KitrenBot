// https://js.langchain.com/docs/expression_language/get_started

import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableLambda,
  RunnableMap,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const vectorStore = await HNSWLib.fromDocuments(
  [
    new Document({
      pageContent:
        "Welcome to the Coding Train with Daniel Shiffman! A community dedicated to learning creative coding with beginner-friendly tutorials and projects on YouTube and more.",
    }),
    new Document({
      pageContent:
        "Streamline your learning experience and take a ride along a Track on The Coding Train. Tracks are collections of video tutorials that follow a sequenced curriculum.",
    }),
    new Document({
      pageContent:
        "Watch Dan take on Coding Challenges in p5.js and Processing. The challenge topics include algorithmic art, machine learning, simulation, generative poetry, and more.",
    }),
  ],
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "embedding-001", // 768 dimensions
    //taskType: TaskType.RETRIEVAL_DOCUMENT,
    //title: "Document title",
  })
);
const retriever = vectorStore.asRetriever(1);

// const prompt = ChatPromptTemplate.fromMessages([
//   [
//     "ai",
//     `Answer the question based on only the following context:

// {context}`,
//   ],
//   ["human", "{question}"],
// ]);

// Create prompt
const prompt = ChatPromptTemplate.fromTemplate(
  `You are an artificial intellegence based on the character Kitren in the book "The Black Box."  You should respond in the same lexicon that Kitren uses. Do not respond to other characters in the book.  Use proper English spelling: 
  {context}
  Question: {input}`
);

// Instantiate Model
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
const outputParser = new StringOutputParser();

const setupAndRetrieval = RunnableMap.from({
  context: new RunnableLambda({
    func: (input) =>
      retriever.invoke(input).then((response) => response[0].pageContent),
  }).withConfig({ runName: "contextRetriever" }),
  question: new RunnablePassthrough(),
});
const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);

const response = await chain.invoke({
  input: "Where should I start?",
});
console.log(response);
