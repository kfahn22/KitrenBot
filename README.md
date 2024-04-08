# KitrenBot

This is a WIP.

My experience so far is just with Ollama and Gemini. Ollama is very slow, but generally works as intented. RAG is not deterministic, though, and Ollama will return with very different responses.

I have had more issues with Gemini working properly. I will give Gemini exactly what it needs to answer a question in context and it will say it is not relevant. I think

OpenAI should work well, but you have to have a subscription so not so good for a tutorial series.

I think adding long-term-memory using Upstash/Redis would help the bot to always return with the correct response and it remember what previous history. There is a free tier.

Chatbot using [LangChain.js](https://js.langchain.com/docs/get_started/introduction)

## Tutorials

- [LangChain JS Tutorial by Leon Van Zyl](https://www.youtube.com/playlist?list=PL4HikwTaYE0EG379sViZZ6QsFMjJ5Lfwj)
- [Sentence Embeddings with transformers.js and UMAP](https://thecodingtrain.com/tracks/livestreams/livestreams/sentence-embeddings/clustering-sentence-embeddings)

## Articles

- [A Complete Guide to LangChain in JavaScript](https://medium.com/@letscodefuture/a-complete-guide-to-langchain-in-javascript-e54baff70dd8)

## Install Dependencies

You will want to install `langchain` and `@langchain/community`. Installation of other packages will depend upon your needs.

`npm install langchain`
`npm install @langchain/community`  
`npm install @langchain/langgraph`

- Store environmental variables / chat in terminal
  `npm install readline`
  `npm install dotenv`

- Providers

`npm install @huggingface/inference`
`npm install @langchain/openai`
`npm install @langchain/google-genai`  
`npm install ollama`  
`npm install @google/generative-ai`

- Documennts

- [ChatGPT files](https://js.langchain.com/docs/integrations/document_loaders/file_loaders/chatgpt)

  `npm install @opensearch-project/opensearch`

- Webscraper
  `npm install cheerio`

- Store chat history
  `npm install @upstash/redis`

- Audio
  `npm install elevenlabs`

### Vector Store

- [MongoDB Atlas](https://js.langchain.com/docs/integrations/vectorstores/mongodb_atlas)
- [OpenSearch](https://opensearch.org)

## Documentation

- [Replicate](https://js.langchain.com/docs/integrations/llms/replicate)

- [Ollama](https://github.com/ollama/ollama)
- [Plug-ins](https://github.com/ollama/ollama#extensions--plugins)
- [API](https://github.com/ollama/ollama/blob/main/docs/api.md)

## Other versions

- codellm VSC extension
  https://github.com/timkmecl/codegpt

## Python

https://python.langchain.com/docs/guides/development/local_llms/

## Loading Docs

Python fix?
[loading docs](https://stackoverflow.com/questions/76600384/unable-to-read-text-data-file-using-textloader-from-langchain-document-loaders-l)

`text_loader_kwargs={'autodetect_encoding': True}
loader = DirectoryLoader("./new_articles/", glob="./*.txt", loader_cls=TextLoader, loader_kwargs=text_loader_kwargs)`

[document transformers](https://js.langchain.com/docs/integrations/document_transformers/html-to-text

## Embeddings

I haven't read this b/c you need a subscription, might be useful:
[Offline embedding with LangChain](https://medium.com/@gmarcilhacy/offline-embedding-with-langchain-4323d9376cdc)

## Integration Packages

To avoid conflicts, [docs](https://js.langchain.com/docs/get_started/installation#installing-integration-packages) recommended;

`"overrides": {`  
 `"@langchain/core": "0.1.5"`  
`}`
