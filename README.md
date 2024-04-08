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


## Other versions

- codellm VSC extension
https://github.com/timkmecl/codegpt

## Python

https://python.langchain.com/docs/guides/development/local_llms/
