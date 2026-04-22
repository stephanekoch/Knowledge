// Vercel serverless proxy — forwards requests to Google Apps Script
// Paste your Apps Script deployment URL below after deploying Code.gs

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxz4VKnz9NkQ06ThcuHI5-LvLeUK8sS2xwfn3ZxOas0NqQ07G5W75aKxecvuHuGe5XVIw/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let response;
    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query).toString();
      response = await fetch(`${APPS_SCRIPT_URL}?${params}`, { redirect: 'follow' });
    } else {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      response = await fetch(APPS_SCRIPT_URL, { method: 'POST', body, redirect: 'follow' });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
