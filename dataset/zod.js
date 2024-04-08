import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import { StructuredOutputParser } from "langchain/output_parsers";

import { z } from "zod";

import * as dotenv from "dotenv";
dotenv.config();

const chatModel = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "mistral",
});

// Create Prompt Template
// const prompt = ChatPromptTemplate.fromTemplate(
//   "You are a comedian.  Tell a joke based on the following word {input}"
// );

const prompt = ChatPromptTemplate.fromMessages(
  ["system", "Generate a joke based on a word provided by the user"],
  ["human", "{input}"]
);

async function callStringOutputParser() {
  // Create parser
  const parser = new StringOutputParser();

  // Create chain
  const chain = prompt.pipe(chatModel).pipe(parser);

  // Call chain
  return await chain.invoke({
    input: "dog",
  });
}
async function callListOutPutParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Provide 5 synonyms, separated by commas, for the following word {word}
`);
  const outputParser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(chatModel).pipe(outputParser);

  return await chain.invoke({
    word: "happy",
  });
}

// Structured Output Parser
async function callStructuredParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting Instructions: {format_instructions}
    Phrase: {phrase}
`);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: "the name of the person",
    age: "the age of the person",
  });

  const chain = prompt.pipe(chatModel).pipe(outputParser);

  return await chain.invoke({
    phrase: "Max is 30 years old.",
    format_instructions: outputParser.getFormatInstructions(),
  });
}

async function callZodOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting Instructions: {format_instructions}
    Phrase: {phrase}
    `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      role: z.string().describe("name of role"),
      content: z.array(z.string()).describe("ingredients"),
    })
  );

  const chain = prompt.pipe(chatModel).pipe(outputParser);

  return await chain.invoke({
    phrase:
      "The ingredients for a Spaghetti Bolonese recipes are tomatoes, minced beef, garlic, wine and herbs",
    format_instructions: outputParser.getFormatInstructions(),
  });
}
//const response = await callStringOutputParser();
//const response = await callListOutPutParser();
//const response = await callStructuredParser();
const response = await callZodOutputParser();
console.log(response);
