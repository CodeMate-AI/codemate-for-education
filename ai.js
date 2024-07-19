const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = '138e17b0178640e28448efdfe4a5898c';  // Replace with your actual API key

// Middleware to parse JSON requests
app.use(express.json());

// Route to make the API call
app.post('/api/ask', async (req, res) => {
  try {
    const { content } = req.body;

    // Check if content is provided and is an array
    if (!Array.isArray(content)) {
      return res.status(400).json({ error: 'Invalid content format. It should be an array.' });
    }

    const response = await axios.post(
      'https://code-mateai.openai.azure.com/openai/deployments/gpt4-turbo/chat/completions?api-version=2024-02-15-preview',
      {
        messages: content,
        max_tokens: 800,
        temperature: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 0.95,
        stop: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error making API call:', error);
    res.status(500).json({ error: 'An error occurred while making the API call' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// {
//     "content": [
//       {
//         "role": "user",
//         "content": "Prepare me for a behavioral interview by being my coach using this Draft 1 / Interview Thought Tree\n1. Self-Introduction\n● Background\no Name\no Native Place\no Education Qualification\no Family Background\no Internship (if any)\no Work Experience\n● Key Skills\no Technical Skills\no Soft Skills\n● Career Goals\no Short- Term - Immediate\no Long – Term – 5 years Vision\n2. Understanding the Company\no Company Profile (Company Research, History, Mission and Vision, Products & Services, Owners, CEOs etc.)\n● Current News (Company)\no Recent Achievements\no Industry Position\n3. Job-Specific Preparation\n● Job Description\no Key Responsibilities\no Required Skills\n● Matching Skills\no Relevant Experience\no Examples of Past Work\n4. Common Interview Challenges\n● Behavioral Questions\no STAR Method (Situation, Task, Action, Result)\n● Technical Questions\no Problem-Solving Examples\no Relevant Projects\n5. Questions for the Interviewer\n● Role-Specific\no Day-to-Day Responsibilities\no Team Structure\n● Company Culture\no Work Environment\no Growth Opportunities\n6. Closing the Interview\n● Expressing Interest\no Why You’re a Good Fit\no Enthusiasm for the Role\n● Next Steps\no Follow-Up Timeline\no Thank You Note"
//       }
//     ]
//   }
  