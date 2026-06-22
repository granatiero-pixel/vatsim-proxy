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
      const title = $(el).find(".card-title a").text().trim();
      const link = "https://vatita.net" + $(el).find(".card-title a").attr("href");

      // Prima card-text = descrizione
      const description = $(el).find(".card-text").first().text().trim();

      // card-text con text-muted = data
      const date = $(el).find(".text-muted.card-text small").text().trim();

      const image = $(el).find(".card-img").attr("src");

      if (title) {
        events.push({
          title,
          link,
          description,
          date,
          image
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
