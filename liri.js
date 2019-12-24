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

// Func for concert search 
let getMyBands = function(artist) {
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function(response) {
            let jsonData = response.data;

            if (!jsonData.length) {
                console.log("No results found for " + artist);
                return;
            }

            let logData = [];

            logData.push("Upcoming concerts for " + artist + ":");

            for (let i = 0; i < jsonData.length; i++) {
                let show = jsonData[i];
                // push eachline of concert data to logData
                // if concert doesn't have a region, display the country instead
                // use moment to format the date
                logData.push(
                    show.venue.city + 
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " + 
                    show.venue.name + 
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                );
            }

            // Print and write the concert data as a string joined by a newline
            console.log(logData.join("\n"));
            writeToLog(logData.join("\n"));
        }
    );
};