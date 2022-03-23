require("dotenv").config();
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const { newspapaers } = require("./newspapers");
const PORT = process.env.PORT || 5000;

const app = express();

const articles = [];

newspapaers.map(newspaper => {
    axios
        .get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("climate")', html).each(function() {
                const title = $(this)
                    .text()
                    .replace("\n", "")
                    .trim();
                const url = $(this).attr("href");
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                });
            });
        })
        .catch(error => console.log(error));
});

app.get("/", (req, res) => {
    res.json({ msg: "Welcome to Nigerian news API" });
});

app.get("/news", (req, res) => {
    res.json(articles);
});

app.get("/news/:newsId", (req, res) => {
    const { newsId } = req.params;

    const specificNewspaper = newspapaers.filter(
        newspaper => newspaper.name === newsId
    )[0].address;
    const specificSource = newspapaers.filter(
        newspaper => newspaper.name === newsId
    )[0].base;
    axios
        .get(specificNewspaper)
        .then(response => {
            const specificArticle = [];
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("climate")', html).each(function() {
                const title = $(this)
                    .text()
                    .replace("\n", "")
                    .trim();
                const url = $(this).attr("href");
                specificArticle.push({
                    title,
                    url: specificSource + url,
                    source: newsId
                });
            });
            res.json(specificArticle);
        })
        .catch(error => console.log(error));
});

app.get("/kalu/:kaluId", (req, res) => {
    console.log(req.params.kaluId);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
