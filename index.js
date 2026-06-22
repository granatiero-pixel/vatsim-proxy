import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();

app.get("/", async (req, res) => {
  try {
    console.log("Richiesta ricevuta, contatto VATITA...");

    const response = await fetch("https://vatita.net/events", {
      headers: { "User-Agent": "RenderProxy/1.0" }
    });

    console.log("Status VATITA:", response.status);

    const html = await response.text();
    console.log("Lunghezza HTML:", html.length);

    const $ = cheerio.load(html);

    const events = [];

    $(".card").each((i, el) => {
      const title = $(el).find(".card-title").text().trim();
      const description = $(el).find(".card-text").text().trim();

      if (title) {
        events.push({
          title,
          description
        });
      }
    });

    res.json({ events });

  } catch (err) {
    console.error("Errore nel proxy:", err);
    res.status(500).json({ error: "Errore nel proxy" });
  }
});

app.listen(3000, () => {
  console.log("Proxy VATITA attivo sulla porta 3000");
});
