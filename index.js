const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const OpenAI = require("openai")

client = new OpenAI(
  base_url="https://aiforcause.deepnight.tech/openai/",
  apiKey= "<BLAH__BLAH__BLAH>"
)

// // Initialize GPT instance
// const gpt = new GPT({
//   apiKey: 'YOUR_OPENAI_API_KEY',
//   model: 'text-davinci-003', // You can choose the appropriate model
// });

// Promisify fs.readdir
const readdir = promisify(fs.readdir);
// Promisify fs.readFile
const readFile = promisify(fs.readFile);
// Promisify fs.writeFile
const writeFile = promisify(fs.writeFile);

// Function to recursively read directories
async function readDirRecursive(dir) {
  let files = [];

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await readDirRecursive(fullPath);
      files = files.concat(subFiles);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to generate markdown from text using GPT
async function generateMarkdown(text) {
  // Use GPT to generate markdown
  // const response = await gpt.completePrompt(text + "\n### Generate markdown:\n", { max_tokens: 150 });

  response = client.chat.completions.create(
    model="gpt-35-turbo",
    messages=text + "\n### Generate markdown:\n",
    { max_tokens: 150 },
    stream= false
  )

  // Return markdown
  return response.choices[0].message.content();
}

// Main function to process files
async function processFiles() {
  const files = await readDirRecursive('./');
  const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf-8').split('\n') : [];

  for (const file of files) {
    const relativePath = path.relative('./', file);
    if (!gitignore.includes(relativePath)) {
      const fileContent = await readFile(file, 'utf-8');
      const markdownContent = await generateMarkdown(fileContent);
      const markdownPath = path.join('.codemate', relativePath.replace(/\.[^/.]+$/, '') + '.md');
      const markdownDir = path.dirname(markdownPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(markdownDir)) {
        fs.mkdirSync(markdownDir, { recursive: true });
      }

      // Write markdown content to file
      await writeFile(markdownPath, markdownContent);
      console.log(`Generated markdown for: ${file}`);
    }
  }

  console.log('Markdown generation completed.');
}

// Call main function
processFiles().catch(console.error);


