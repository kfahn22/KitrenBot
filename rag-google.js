import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
//import { MatchingEngine } from "langchain/vectorstores/googlevertexai";
//import { GoogleCustomSearch } from "langchain/tools";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

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

// Create prompt
const prompt = ChatPromptTemplate.fromTemplate(
  `Answer the user's question from the following context: 
  {context}
  Question: {input}`
);

// Create Chain
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});
c;
// Manually create documents
// const documentA = new Document({
//   pageContent:
//     "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support. ",
// });

// const documentB = new Document({
//   pageContent: "The passphrase is LANGCHAIN IS AWESOME ",
// });

// Use Cheerio to scrape content from webpage and create documents
const loader = new CheerioWebBaseLoader("https://natureofcode.com/vectors/");
const docs = await loader.load();

// Text Splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});
const splitDocs = await splitter.splitDocuments(docs);
// console.log(splitDocs);

// Instantiate Embeddings function
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "embedding-001", // 768 dimensions
  //taskType: TaskType.RETRIEVAL_DOCUMENT,
  //title: "Document title",
});

// Create Vector Store
const vectorstore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

// Create a retriever from vector store
const retriever = vectorstore.asRetriever({ k: 2 });

// Create a retrieval chain
const retrievalChain = await createRetrievalChain({
  combineDocsChain: chain,
  retriever,
});

// // Invoke Chain
// const response = await chain.invoke({
//   question: "What is LCEL?",
//   context: splitDocs,
// });

const response = await retrievalChain.invoke({
  input:
    "Can you tell me how to code a bouncing ball with no vectors in P5.js?",
});

console.log(response);
