// https://js.langchain.com/docs/expression_language/cookbook/prompt_llm_parser
// https://js.langchain.com/docs/integrations/llms/openai
// npm install @langchain/openai

const dotenv = require("dotenv");
dotenv.config();
//const config = require("../../../../config");

const { ChatOllama } = require("@langchain/community/chat_models/ollama");
//const { OpenAI } = require("@langchain/openai");
//const { Document } = require("@langchain/core/documents");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const { ConversationChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const {
  CheerioWebBaseLoader,
} = require("langchain/document_loaders/web/cheerio");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");
const {
  HuggingFaceInferenceEmbeddings,
} = require("@langchain/community/embeddings/hf");
// import { BufferMemory } from "langchain/memory";
const { MemoryVectorStore } = require("langchain/vectorstores/memory");

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama2",
});

// I am not sure whether "gpt-4-turbo-preview" is available through LangChain, although I
// I would presume it depends no subscription

// const model = new OpenAI({
//   modelName: "gpt-4-turbo-preview", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
//   temperature: 0.9,
//   config.openAIApiToken
// });

const prompt = ChatPromptTemplate.fromTemplate(`
  Answer the user's question.
  Context: {context}
  Question: {input}
`);

//const chain = prompt.pipe(model);
const retrieveDocs = async () => {
  //const chain = prompt.pipe(model);
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  // const documentA = new Document({
  //   pageContent:
  //     "LangGraph is a library for building stateful, multi-actor applications with LLMs, built on top of (and intended to be used with) LangChain.js. ",
  // });

  // Load data from Nature of Code
  const loader = new CheerioWebBaseLoader("https://natureofcode.com/fractals/");
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const splitDocs = await splitter.splitDocuments(docs);
  // TODO:  check out vector store providers
  const embeddings = new HuggingFaceInferenceEmbeddings(
    process.env.HUGGINGFACE_API_KEY
  );
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  // Retrieve Data

  const retriever = vectorStore.asRetriever({
    k: 2,
  });
  const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever,
  });
  const response = await retrievalChain.invoke({
    input: "Can you help me code a recursive fractal tree in P5.js?",
    // optional
    //context: docs,
  });
  console.log(response);
};

retrieveDocs();
