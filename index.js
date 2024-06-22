#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');

const apiKeyPath = path.resolve(__dirname, 'api_key.txt');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { argv } = require('process');

async function getApiKey() {
    try {
        if (!fs.existsSync(apiKeyPath)) {
            console.log('GEMINI_API_KEY not found');
            console.log('To receive API key visit: https://ai.google.dev/gemini-api/docs/api-key');
            const newApiKey = readline.question('Enter your GEMINI_API_KEY: ');
            // Create .txt file
            fs.writeFileSync(apiKeyPath, newApiKey);
            console.log('gmniprompt updated with GEMINI_API_KEY.');
            return newApiKey;
        }
        else {
            try {
                const data = fs.readFileSync(apiKeyPath, 'utf8');
                const lines = data.split('\n');
                return lines[0].trim();
            } catch (err) {
                console.error('Error reading file:', err.message);
                return null;
            }
        }
    } catch (err) {
        console.error('Error reading .txt file:', err);
        return null;
    }
}

async function run(prompt, model) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

  const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Api key deleted succesfully');
        } else {
            console.log('Api file does not exist');
        }
    } catch (err) {
        console.error('Error deleting api key:', err.message);
    }
};

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
        if(args[0] === '-dk') {
            deleteFile(apiKeyPath);
            return;
        }

        prompt = args.join(' ');
        run(prompt, model);
    }
}

main();
