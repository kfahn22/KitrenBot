// https://js.langchain.com/docs/expression_language/cookbook/retrieval

import * as dotenv from "dotenv";
dotenv.config();
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Instantiate Model

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama2",
  // model: "codellama",
  // model: "gemma",
});

const vectorStore = await HNSWLib.fromTexts(
  [
    "Creating a recursive fractal tree in P5.js involves a bit of trigonometry and recursion. Here's a verbal walkthrough:Setup P5.js: Start by setting up a basic P5.js sketch with a canvas.Define the Branch: Decide on the parameters of your tree branches, such as length, angle, and recursion depth.Write the Recursive Function: Create a function that draws a branch. This function will take parameters like starting point, length, angle, and recursion depth. Inside this function:Draw a line from the starting point to a new point calculated based on the length and angle.If the recursion depth is greater than zero. Call the same function recursively for two branches, one on each side of the current branch.Reduce the length and possibly adjust the angle for each recursive call to create smaller branchesBase Case: Define a base case for the recursion to prevent infinite recursion. For example, when the recursion depth reaches zero, the function should stop calling itself.Call the Recursive Function: Finally, call the recursive function from the draw() function or wherever you want to start drawing the tree.",
  ],
  [{ id: 1 }],

  // Instantiate Embeddings function
  // new OllamaEmbeddings();
  new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
  })
);

const retriever = vectorStore.asRetriever();

const prompt =
  PromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context}

Question: {question}`);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke(
  "How can I code a recursive fractal tree in P5.js?"
);

console.log(result);
