// https://medium.com/@letscodefuture/a-complete-guide-to-langchain-in-javascript-e54baff70dd8

import * as dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Instantiate Embeddings function
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "embedding-001", // 768 dimensions
  //taskType: TaskType.RETRIEVAL_DOCUMENT,
  //title: "Document title",
});

const loader = new TextLoader("mixed-metaphor.txt");
const docs = await loader.load();

// Text Splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});
const splitDocs = await splitter.splitDocuments(docs);

//const res = await embeddings.embedQuery("Who created the world wide web?");
const res = await embeddings.embedQuery(docs);
console.log(res);
