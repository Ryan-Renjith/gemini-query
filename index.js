#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');
const dotenv = require('dotenv');

dotenv.config(); // Load variables from .env into process.env
const envPath = path.join(__dirname, '.env');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { argv } = require('process');

async function getApiKey() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log('GEMINI_API_KEY not found');
            const newApiKey = readline.question('Enter your GEMINI_API_KEY: ');
            // Update .env file
            fs.writeFileSync(envPath, `GEMINI_API_KEY=${newApiKey}\n`);
            console.log('gprompt updated with GEMINI_API_KEY.');
            return newApiKey;
        }
        return apiKey;
    } catch (err) {
        console.error('Error reading .env file:', err);
        return null;
    }
}

async function run(prompt, model) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

async function main() {
    const apiKey = await getApiKey();

    if (!apiKey) {
        console.error('API key not found or could not be retrieved.');
        return;
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const args = process.argv.slice(2);
    let prompt;

    if (args.length === 0) {
        console.log('Please provide the prompt');
    } else {
        if(args[0] === 'deleteKey') {
            delete process.env.GEMINI_API_KEY;
            fs.writeFileSync(envPath, `GEMINI_API_KEY=`);
            console.log('API key deleted');
            return;
        }

        prompt = args.join(' ');
        run(prompt, model);
    }
}

main();
