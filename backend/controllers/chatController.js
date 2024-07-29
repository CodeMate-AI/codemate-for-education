const { getJson } = require("serpapi");

async function references(query, assignmentId = "") {
  const params = {
    api_key: "dc04d437e8e83d594f3344b2928644d8a6dcce2164d26012fe0944ddc82ee2fa",
    engine: "youtube",
    search_query: query,
  };

  return new Promise((resolve, reject) => {
    getJson(params, (data) => {
      if (data.error) {
        console.error('Error fetching YouTube results:', data.error);
        reject([]);
      } else {
        resolve(data.video_results);
      }
    });
  });
}

  

const chat = async (req, res) => {
    const data = req.body;
  
    const messages = [
      { role: "system", content: "You are CodeMate by CodeMate for Education. You help individuals to learn programming languages. Your task is to explain the concepts to the user rather than providing the code. Don't ever provide the code to the user. You are allowed to provide sudo code to the users but never complete code. Help them in learning the language rather than just handing them over the code.\n\nRESPONSE FORMAT: STRICT MARKDOWN" },
      { role: "user", content: "THE TASK GIVEN TO THE USER RELATED TO WHICH HE/SHE WILL BE ASKING QUESTIONS POSSIBLY IS: " + data.task },
      { role: "assistant", content: "Understood! I will help the user accomplish the task and will not provide any code to them. However, as per the instructions, I will provide the user with sudo code if it is very necessary." }
    ];
  
    const tems = [
      {
        role: "system",
        content: "Based on the provided context, convert the last query of the user to a YouTube search query. ONLY RETURN THE YOUTUBE SEARCH QUERY and nothing else."
      },
      {
        role: "user",
        content: "TASK TO COMPLETE: " + data.task
      }
    ];
  
    tems.push(...data.messages);
  
    try {
      const response = await axios.post(
        'https://code-mateai.openai.azure.com/openai/deployments/gpt4-turbo/chat/completions?api-version=2024-02-15-preview',
        {
          messages: tems,
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
  
      const query = response.data.choices[0].message.content;
      const functionResponse = await references(query);
  
      data.messages[data.messages.length - 1].content += "\n\n\nREFERENCE VIDEOS TO SHARE WITH THE STUDENT. ADD THE FOLLOWING LINKS IN YOUR RESPONSE.:\n" + JSON.stringify(functionResponse);
      messages.push(...data.messages);
  
      while (true) {
        const chatResponse = await axios.post(
          'https://code-mateai.openai.azure.com/openai/deployments/gpt4-turbo/chat/completions?api-version=2024-02-15-preview',
          {
            messages: messages,
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
  
        const chatContent = chatResponse.data.choices[0].message.content;
  
        if (chatContent) {
          return res.json({ response: chatContent });
        } else {
          messages.push({
            role: "assistant",
            function_call: {
              name: "references",
              arguments: chatResponse.data.choices[0].message.function_call.arguments
            }
          });
  
          const functionResponse = await references(JSON.parse(chatResponse.data.choices[0].message.function_call.arguments).q);
          messages.push({
            role: "function",
            name: "references",
            content: JSON.stringify(functionResponse)
          });
        }
      }
    } catch (error) {
      console.error('Error processing chat:', error);
      res.status(500).send('Internal Server Error');
    }
};
  
module.exports = { chat };