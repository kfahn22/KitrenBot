// https://github.com/ollama/ollama-js

//import ollama from "ollama";
import ollama from "ollama";

const response = await ollama.chat({
  model: "codellama",
  messages: [
    { role: "user", content: "How can I code a fractal tree in P5.js" },
  ],
});
console.log(response.message.content);
