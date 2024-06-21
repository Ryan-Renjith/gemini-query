require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


async function run(prompt) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
  

const args = process.argv.slice(2);
let prompt;

if (args.length === 0) {
    console.log('Please provide the prompt');
} else {
    prompt = args.join(' ');
    run(prompt);
}
