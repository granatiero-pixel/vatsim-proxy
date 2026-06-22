import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();

app.get("/", async (req, res) => {
  try {
    console.log("Richiesta ricevuta, contatto VATITA...");

    const response = await fetch("https://vatita.net/events", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1"
      }
    });

    console.log("Status VATITA:", response.status);

    const html = await response.text();
    console.log("Lunghezza HTML:", html.length);

    const $ = cheerio.load(html);

    const events = [];

    // Ogni evento è dentro <div class="mb-3 card">
    $(".mb-3.card").each((i, el) => {
      const title = $(el).find(".card-title a").text().trim();
      const link =
        "https://vatita.net" + $(el).find(".card-title a").attr("href");

      const description = $(el).find(".card-text").first().text().trim();

      const date = $(el)
        .find(".text-muted.card-text small")
        .text()
        .trim();

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
