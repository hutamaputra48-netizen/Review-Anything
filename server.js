require('dotenv').config({ path: './MY.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/report', async (req, res) => {
  const { commentId, reason, details, author, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'hutamanocturnal@gmail.com',
    subject: `Report comment: ${reason}`,
    text: [
      `Comment ID: ${commentId}`,
      `Reported reason: ${reason}`,
      `Author: ${author || 'Unknown'}`,
      `Comment text: ${text || ''}`,
      `Details: ${details || '-'}`,
      `Sent at: ${new Date().toISOString()}`,
    ].join('\n'),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Report server running on http://localhost:${port}`);
});

