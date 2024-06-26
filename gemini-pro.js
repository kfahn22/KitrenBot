// https://js.langchain.com/docs/expression_language/get_started
//
import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { TextLoader } from "langchain/document_loaders/fs/text";

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
  modelName: "",
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
  `You are an artificial intellegence based on the character Kitren in the book "The Black Box."  You should respond in the same lexicon that Kitren uses. Do not respond to other characters in the book.  Use proper English spelling: 
  {context}
  Question: {input}`
);

// Create Chain
const chain = await createStuffDocumentsChain({
  llm: model,
  prompt,
});

// Can manually load a document
// const documentA = new Document({
//   pageContent: "",
// });

const loader = new TextLoader("the_black_box.txt");
const docs = await loader.load();

// Use Cheerio to scrape content from webpage and create documents
// const loader = new CheerioWebBaseLoader("https://natureofcode.com/vectors/");
// const docs = await loader.load();

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

const response = await retrievalChain.invoke({
  input: "Hello, how are you?",
});

console.log(response);
