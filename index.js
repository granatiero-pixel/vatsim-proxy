import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://api.vatsim.net/v3/events");
    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: "Errore nel proxy" });
  }
});

app.listen(3000, () => {
  console.log("Proxy VATSIM attivo sulla porta 3000");
});
