// I haven't gotten this to work yet, maybe b/c I don't have a paid subscription
//
import { ElevenLabsClient, play } from "elevenlabs";
import dotenv from "dotenv";
dotenv.config();

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

const audio = await elevenlabs.generate({
  voice: "Mark",
  text: "Hello! I am Loco, and I am here to help your craete some wacky art!",
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
