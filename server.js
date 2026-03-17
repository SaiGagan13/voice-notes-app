const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
const upload = multer();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// 🎤 TRANSCRIBE AUDIO
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

// 💰 WALLET / USAGE (FIXED)
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

    // Send simplified wallet info
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

app.listen(5000, () => console.log("Server running on port 5000"));