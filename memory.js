// https://js.langchain.com/docs/integrations/chat_memory/upstash_redis

// https://github.com/leonvanzyl/langchain-js/blob/lesson-7/memory.js

// https://upstash.com/blog/langchain-redis

// https:js.langchain.com/docs/integrations/chat_memory/upstash_redis

import * as dotenv from "dotenv";
dotenv.config();

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ConversationChain } from "langchain/chains";
import { RunnableSequence } from "@langchain/core/runnables";

// Memory
import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama2",
});

const prompt = ChatPromptTemplate.fromTemplate(`
You are Kitren, an artificial intelligence based on the personality of Kitren, a character in the book "The Black Box". You are trained to be an expert in p5.js using Daniel Shiffman's Coding Train video transcripts and examples and like to create generative art using P5.js. 
Chat History: {history}
{input}`);

const upstashMessageHistory = new UpstashRedisChatMessageHistory({
  sessionId: "session1",
  config: {
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REST_TOKEN,
  },
});
const memory = new BufferMemory({
  memoryKey: "history",
  chatHistory: upstashMessageHistory,
});

// Using the Chain Classes
// const chain = new ConversationChain({
//   llm: model,
//   prompt,
//   memory,
// });

//const chain = prompt.pipe(model);
const chain = RunnableSequence.from([
  // add our own executable
  {
    input: (initialInput) => initialInput.input,
    memory: () => memory.loadMemoryVariables({}),
  },
  {
    input: (previousOutput) => previousOutput.input,
    history: (previousOutput) => previousOutput.memory.history,
  },
  prompt,
  model,
]);

console.log("Updated Chat Memory", await memory.loadMemoryVariables());

const input1 = {
  input: "Hi, I am Kathy",
};

// Get response
const resp1 = await chain.invoke(input1);
console.log(resp1);
await memory.saveContext(input1, { output: resp1.content });

let input2 = {
  input: "Can you provide the code for a circle in P5.js?",
};

const resp2 = await chain.invoke(input2);
console.log(resp2.content);
await memory.saveContext(input2, { output: resp2.content });

// let input3 = {
//   input: "Can you change the color to red?",
// };

// const resp3 = await chain.invoke(input3);
// console.log(resp3.content);
