// DEPENDENCIES 
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read and set enironment variables
require("dotenv").config();

// Import API Keys
let keys = require("./keys");

// Import the node-spotify-api(NPM), axiosi(NPM), momenti(NPM), and FS packages
let Spotify = require("node-spotify-api");
let axios = require("axios");
let moment = require("moment");
let fs = require("fs");

// Initialize the Spotify API client using our client id and secret key
let spotify = new Spotify(keys.spotify);

// FUNCTIONS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Write to the log.txt file
let writeToLog = function(data) {
    // Append the JSON data and add a newline to end of log.txt file
    fs.appendFile("log.txt", JSON.stringify(data) + "\n", function (err) {
        if (err) {
           return console.log(err);
        }
        console.log("log.txt was updated!");
    });
};

// Helper func that gets the artist name
let getArtistNames = function (artist) {
    return artist.name;
};

// Func to run Spotify search
let getMeSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search({ type: "track", query: songName}, function (err, data) {
        if (err) {
            console.log("Error occured: " + err);
            return; 
        }

        let songs = data.tracks.items;
        let data = [];

        for (let i = 0; i < songs.length; i++) {
          data.push({
              "artist(s)": songs[i].artists.map(getArtistNames),
              "song name: ": songs[i].name,
              "preview song: ": songs[i].preview_url,
              "album: ": songs[i].album.name
          });
        }

        console.log(data);
        writeToLog(data);
    });
};