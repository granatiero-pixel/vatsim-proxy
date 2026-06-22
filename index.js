import express from "express";

const app = express();

app.get("/", async (req, res) => {
  try {
    console.log("Richiesta ricevuta, contatto VATSIM...");

    const response = await fetch("https://api.vatsim.net/v3/events", {
      headers: { "User-Agent": "RenderProxy/1.0" }
    });

    console.log("Status VATSIM:", response.status);

    const data = await response.text();

    console.log("Lunghezza risposta:", data.length);

    res.setHeader("Content-Type", "application/json");
    res.send(data);

  } catch (err) {
    console.error("Errore nel proxy:", err);
    res.status(500).json({ error: "Errore nel proxy" });
  }
});

app.listen(3000, () => {
  console.log("Proxy VATSIM attivo sulla porta 3000");
});
