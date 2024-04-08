// https://js.langchain.com/docs/modules/agents/agent_types/plan_and_execute

// https://api.js.langchain.com/classes/langchain_experimental_plan_and_execute.PlanAndExecuteAgentExecutor.html

// Feature is experimental and got an error RE parsing JSON response
// TODO:  Look into this
// https://js.langchain.com/docs/integrations/toolkits/json

// OpenAI Agent is more fulled developed and I think would work
// https://js.langchain.com/docs/integrations/toolkits/openapi

import * as dotenv from "dotenv";
dotenv.config();

import { ollama } from "ollama";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { Calculator } from "@langchain/community/tools/calculator";

// Create and Assign Tools
const tools = [new Calculator(), new SerpAPI(process.env.SERP_API_KEY)];
// const searchTool = new TavilySearchResults(process.env.TAVILY_API_KEY);
// const tools = [new Calculator(), searchTool];

// Instantiate model
// const model = new ChatOllama({
//   baseUrl: "http://localhost:11434", // Default value
//   model: "llama2",
//   // model: "codellama",
//   // model: "gemma",
// });



const model = await ollama.chat({
  model: "codellama",
  // messages: [
  //   { role: "user", content: "How can I code a fractal tree in P5.js" },
  // ],
});

// Executor
const executor = await PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm: model,
  tools,
});

const result = await executor.invoke({
  input: `Who is current president of the United States? What is their current age raised to the second power?`,
});

console.log({ result });

//OutputParserException [Error]: Unable to parse JSON response from chat agent.
// Question: What is the current president of the United States?
// Thought: I should use the search engine to find the information.
// Action: Search
// $JSON_BLOB = {
//   "action": "search",
//   "action_input": "Who is the current president of the United States?"
// }
