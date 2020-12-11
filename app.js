'use strict';
const api = require("mangadex-full-api");
const USERNAME = "UWCSProject";
const PASSWORD = "Huskies123";

const express = require('express');
const genre = require("mangadex-full-api/src/enum/genre");
const app = express();

app.use(express.static('public'));
app.use(express.json());
let themeExclusion = [4, 1, 42, 43, 44, 45, 46, 47, 48, 50];

// Function to retrieve the search results from mangadex api
// Returns a JSON object with title, cover, url, and description
// Searches for the manga using the ID saved from the user click
app.get('/recommended/:userID', async function(req, res) {
    let mangaID = req.params["userID"];
    let genres;
    let recommended;
    let recommendedList = [];
    api.agent.login(USERNAME, PASSWORD, true).then(async() => {
            var manga = new api.Manga(mangaID);
            manga.fill().then(() => {
                genres = manga.genres;
                genres = genres.filter(val => !themeExclusion.includes(val));
            }).then(async() => {
                recommended = await api.Manga.fullSearch({includeAll: true, includeTags: genres, order: "Views (Des)"});
                if (recommended[0].id < 10 && recommended[0].title.length === 1) {
                    recommended = await api.Manga.fullSearch({includeAll: false, includeTags: genres, order: "Views (Des)"});
                }
                let iterator = 0;
                let iteratorLimit = 5;
                let recommendationLimit = Object.keys(recommended).length;
                while (iterator < recommendationLimit && iterator < iteratorLimit) {
                    if (recommended[iterator].id == manga.id) {
                        iterator++;
                        iteratorLimit++;
                        continue;
                    } else {
                        var recManga = new api.Manga(recommended[iterator].id);
                        await recManga.fill();
                        recommendedList.push({title: recManga.title, cover: recManga.cover, url: recManga.url, description: recManga.description});
                    }
                    iterator++;
                }
            }).then(() =>{
                res.json(recommendedList);
            })
        })
});

// After the user iinputs their manga
// Send the manga title and search for it
// Returning a JSON object with title, cover, and ID.
app.get('/display/:pickedManga', async function(req, res) {
    let title = req.params["pickedManga"];
    let displayWindowObject = [];
    api.agent.login(USERNAME, PASSWORD, true).then(async() => {
        var result = await api.Manga.fullSearch({title: title, order: "Views (Des)"});
        if (result[0].id < 10 && result[0].title.length === 1) {
            result = await api.Manga.search(title);
            var manga = new api.Manga(result);
            manga.fill().then(() => {
                displayWindowObject.push({title: manga.title, cover: manga.cover, id: manga.id});
                res.json(displayWindowObject);
            })
        } else {
            let limit = Object.keys(result).length;
            let iterator = 0;
            while (iterator < 5 && iterator < limit) {
                var displayManga = new api.Manga(result[iterator].id);
                await displayManga.fill();
                displayWindowObject.push({title: displayManga.title, cover: displayManga.cover, id: displayManga.id});
                iterator++;
            }
            res.json(displayWindowObject);
        }
    })
});

// Port number for website
// Open website in browser with localhost:8080/osus
const portNumber = 8080;
const PORT = process.env.port || portNumber;
app.listen(PORT);