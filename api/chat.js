// api/chat.js — Función serverless para Vercel
// Esta función actúa como proxy seguro entre tu web y la API de Anthropic.
// La clave de API NUNCA se expone al navegador del cliente.

module.exports = async function handler(req, res) {
  // Permitir CORS para que tu web pueda llamar a esta función
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder a preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { message, context, persona, botName } = req.body;

  if (!message || !context) {
    return res.status(400).json({ error: 'Faltan campos requeridos: message y context' });
  }

  const systemPrompt = `You are a friendly chatbot named "${botName || 'Asistente'}".

CRITICAL LANGUAGE RULE: Detect the language of the user's message and ALWAYS respond in that EXACT same language. If they write in English → respond in English. Spanish → Spanish. French → French. And so on for any language.

KNOWLEDGE BASE:
${context}

RULES:
- Answer ONLY based on the knowledge base above.
- Match the user's language perfectly. Translate/adapt the answer naturally.
- If no relevant answer found, politely say so in the user's language.
- Do not invent information outside the knowledge base.
- Tone: ${persona || 'Be warm, friendly and professional.'}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,   // ← variable de entorno segura
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',  // modelo rápido y económico para producción
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'Error al contactar la IA', detail: err });
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text || 'No pude generar una respuesta.';

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
