import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  if (req.method === 'GET') {
    try {
      const response = await fetch(url as string, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        redirect: "follow"
      });
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        res.json(data);
      } catch (e) {
        res.status(500).json({ 
          error: "Received HTML instead of JSON. Please ensure your Google Script is deployed as a Web App with 'Who has access: Anyone'.",
          preview: text.substring(0, 100)
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch from script" });
    }
  } else if (req.method === 'POST') {
    try {
      const response = await fetch(url as string, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        body: JSON.stringify(req.body),
        redirect: "follow"
      });
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        res.json(data);
      } catch (e) {
        res.json({ success: true, note: "Update sent successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to send data to script" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
