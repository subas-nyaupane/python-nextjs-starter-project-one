'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const localFallbackAnswers: Record<string, string> = {
    'best phone': 'Locally: iPhone 15 Pro Max is currently leading the global sales charts.',
    'best laptop': 'Locally: MacBook Air M3 and Dell XPS are considered top choices in 2025.',
    'best camera': 'Locally: Sony Alpha and Canon EOS are among the top digital cameras.',
  };

  const handleAsk = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('http://localhost:8000/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok && data.answer) {
        setAnswer(data.answer);
      } else {
        // fallback if AI returns no answer
        fallbackAnswer();
      }
    } catch (err) {
      console.warn('AI service failed. Using fallback.', err);
      fallbackAnswer();
    }

    setLoading(false);
  };

  const fallbackAnswer = () => {
    const key = Object.keys(localFallbackAnswers).find((k) =>
      prompt.toLowerCase().includes(k)
    );

    setAnswer(
      key
        ? localFallbackAnswers[key]
        : 'Sorry, I couldn’t connect to AI and have no local answer for this query.'
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ask AI about Products</h1>

      <textarea
        rows={4}
        className="w-full border p-2 rounded-md"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something like: 'What is the best laptop?'"
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {answer && (
        <div className="mt-4 p-4 border border-gray-100/3 bg-black-100 rounded">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
