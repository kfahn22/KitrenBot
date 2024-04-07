// I haven't gotten this to work yet, maybe b/c I don't have a paid subscription
//
import { ElevenLabsClient, play } from "elevenlabs";
import dotenv from "dotenv";
dotenv.config();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

// I get an error that Mark is not a valid name choice but I have it listed in my console, so I don't know what the problem is
const audio = await elevenlabs.generate({
  voice: "Mark",
  text: "Hello! I am ArtBot, and I like to code generative art!",
  model_id: "eleven_multilingual_v2",
});

await play(audio);

// const elevenlabs = new ElevenLabsClient({
//   apiKey: "YOUR_API_KEY", // Defaults to process.env.ELEVENLABS_API_KEY
// });
// const voices = await elevenlabs.voices.getAll();

// const audioStream = await elevenlabs.generate({
//   stream: true,
//   voice: "Bella",
//   text: "This is a... streaming voice",
//   model_id: "eleven_multilingual_v2",
// });

stream(audioStream);
