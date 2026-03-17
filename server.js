const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
const upload = multer();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// ✅ ROOT ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Voice Notes Backend Running 🚀");
});

// 🎤 TRANSCRIBE
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.deepgram.com/v1/listen",
      req.file.buffer,
      {
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "audio/webm",
        },
      }
    );

    const text =
      response.data.results.channels[0].alternatives[0].transcript;

    res.json({ text });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// 💰 WALLET
app.get("/balance", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.deepgram.com/v1/projects",
      {
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
        },
      }
    );

    const project = response.data.projects[0];

    res.json({
      project_name: project.name,
      project_id: project.project_id,
      status: "Active Account (Wallet Connected)"
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Balance fetch failed" });
  }
});

// ✅ IMPORTANT: use Render PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));