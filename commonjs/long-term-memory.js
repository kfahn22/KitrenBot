const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");

const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const config = require("../../config");
const prompts = require("../prompt");
import { ConversationChain } from "langchain/chains";
import { RunnableSequence } from "@langchain/core/runnables";

// Memory
import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";

const config = require("../../config");
const prompts = require("../prompt");

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
];
const model = new ChatGoogleGenerativeAI({
  apiKey: config.geminiApiToken,
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
  safetySettings,
});

async function go() {
  const prompt = ChatPromptTemplate.fromTemplate(
    `${prompts.systemPrompt}. In addition, you might use the vocabulary, language, and style of the following context:
  {context}
  Now answer this: {input}`
  );

  const upstashMessageHistory = new UpstashRedisChatMessageHistory({
    sessionId: "session2",
    config: {
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REST_TOKEN,
    },
  });
  const memory = new BufferMemory({
    memoryKey: "history",
    chatHistory: upstashMessageHistory,
  });

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
    input:
      "Hi MattGPT! Please introduce yourself for the audience here at the Bell House, Brooklyn. Tell us what you are here to do.",
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
}
// let input3 = {
//   input: "Can you change the color to red?",
// };

// const resp3 = await chain.invoke(input3);
// console.log(resp3.content);
