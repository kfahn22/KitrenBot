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
    Generate a hypothetical conversation with five (5) questions and five (5) answers between a user and an assistant using the following context.
    Formatting Instructions: {format_instructions}
    Context: {context}
    `);

  const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
      role: z.string().describe("name of role"),
      content: z.array(z.string()).describe("question"),
      role: z.string().describe("name of role"),
      content: z.array(z.string()).describe("answer"),
    })
  );

  const chain = prompt.pipe(chatModel).pipe(outputParser);

  return await chain.invoke({
    context:
      "i received an email from a viewer named gilad  levy who had a math question for me pertaining  to the game of dungeons and dragons challenge  your imagination to come alive which is why  i've got all these ridiculous dice out big fan of  crazy dice i've got like the d4 so d for dice and  then four for four sides d12 d20 classic i mean  just for overkill i've also got my d60 and d120  which is completely unnecessary and of course  the staple of the dice world a candy jar's worth  of d6s anyone who visits me in the office can  just um grab a couple of these as a treat and  so gilad's question was not actually about the  numbers or the geometry or anything on this  ",
    format_instructions: outputParser.getFormatInstructions(),
  });
}
//const response = await callStringOutputParser();
//const response = await callListOutPutParser();
//const response = await callStructuredParser();
const response = await callZodOutputParser();
console.log(response);
