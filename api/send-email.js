const nodemailer = require('nodemailer');
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { gmailUser, gmailAppPw, to, subject, body } = req.body;
  if (!gmailUser || !gmailAppPw || !to) return res.status(400).json({ error: 'Missing fields' });
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 587, secure: false,
    auth: { user: gmailUser, pass: gmailAppPw.replace(/\s/g, '') }
  });
  try {
    await transporter.sendMail({ from: `"Studio One" <${gmailUser}>`, to, subject, text: body, html: body.replace(/\n/g, '<br>') });
    res.json({ success: true, mode: 'sent' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
