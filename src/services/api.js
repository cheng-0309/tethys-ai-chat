const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * System prompt that defines Tethys's personality and behavior.
 */
const SYSTEM_PROMPT = `You are Tethys, a smart and modern AI assistant.

- Respond in a natural, conversational tone
- Be clear, direct, and helpful
- Avoid robotic or textbook-style responses
- Do NOT include unnecessary disclaimers like "I am a language model"
- If you don't know something, say it briefly without over-explaining
- Keep answers structured and readable
- Use short paragraphs and bullet points for complex answers
- Match the user's energy — casual if they're casual, detailed if they ask for depth
- Never start responses with "Sure!" or "Of course!" every time — vary your openings naturally`;

/**
 * Build the conversation history for Groq from the messages array.
 * Maps 'user'/'ai' senders to 'user'/'assistant' roles.
 * Limits history to the last 20 messages to stay within token limits.
 */
function buildConversationHistory(messages) {
  const MAX_HISTORY = 20;

  return messages
    .filter((msg) => msg.text && msg.text.trim())
    .slice(-MAX_HISTORY)
    .map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));
}

/**
 * Clean up the AI response text — strip any stray metadata or formatting artifacts.
 */
function cleanResponseText(text) {
  return text
    .replace(/^\s+/, '')   // trim leading whitespace
    .replace(/\s+$/, '');  // trim trailing whitespace
}

/**
 * Send a message to the AI and return the response text.
 * Includes full conversation history for multi-turn context.
 *
 * @param {string} userMessage - The latest user message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} The AI's reply text
 */
export async function sendMessageToAI(userMessage, conversationHistory = []) {
  const messages = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    ...buildConversationHistory(conversationHistory),
    {
      role: 'user',
      content: userMessage,
    },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg =
      errorData?.error?.message || `API request failed (${response.status})`;
    throw new Error(errorMsg);
  }

  const data = await response.json();

  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error('Empty response from AI. Please try rephrasing your message.');
  }

  return cleanResponseText(rawText);
}
