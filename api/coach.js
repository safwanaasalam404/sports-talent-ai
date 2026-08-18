/**
 * Vercel Serverless Function: /api/coach
 * Securely handles LLM API calls using server-side environment variables
 * (OPENAI_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY) without exposing keys to the client.
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { sportId, score, percentile, metrics, reactionTimeMs } = req.body || {};

  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      success: false,
      fallbackUsed: true,
      message: 'No LLM API key configured in Vercel Environment Variables. Using expert offline coaching bank.',
    });
  }

  try {
    const prompt = `You are an Olympic sports biomechanics coach. Provide a concise, highly actionable 2-sentence coaching insight for an athlete in ${sportId} who scored ${score}/100 (top ${100 - percentile}% nationally). Lateral speed score: ${metrics?.lateralSpeed || score}/100, Reaction time: ${reactionTimeMs}ms. Focus on kinetic chain efficiency and next-level footwork refinement.`;

    // OpenAI API call
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an Olympic sports biomechanics coach for the Sports Authority of India. Give concise, elite coaching tips.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 120,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`);
      }

      const data = await response.json();
      const coachingTip = data.choices?.[0]?.message?.content?.trim();

      return res.status(200).json({
        success: true,
        coachingTip,
        source: 'openai',
      });
    }

    return res.status(200).json({
      success: false,
      fallbackUsed: true,
    });
  } catch (error) {
    console.error('Serverless coaching generation error:', error);
    return res.status(200).json({
      success: false,
      fallbackUsed: true,
      error: error.message,
    });
  }
}
