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
        var data = [];

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

// Func for running a Movie Search 
let getMovie = function(movieName) {
    if (movieName === undefined) {
        movieName = "Mr Nobody";
    }

    let urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    axios.get(urlHit).then(
        function(response) {
            let jsonData = response.data;

            let data = {
                "Title:" : jsonData.Title,
                "Year:" : jsonData.Year,
                "Rated:" : jsonData.Rated,
                "IMDB Rating:" : jsonData.imdbRating,
                "Country:" : jsonData.Country,
                "Language:" : jsonData.Language,
                "Plot:" : jsonData.Plot,
                "Actors:" : jsonData.Actors,
                "Rotten Tomatoes Rating:" : jsonData.Ratings[1].Value
            };

            console.log(data);
            writeToLog(data);
        }
    );
};

// Func for running a command based on text file
let doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        
        let dataArr = data.split(",");

        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

// Func for determining which command is executed
let pick = function(caseData, functionData) {
    switch (caseData) {
        case "concert-this":
            getMyBands(functionData);
            break;
        case "spotify-this-song":
            getMeSpotify(functionData);
            break;
        case "movie-this":
            getMovie(functionData);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
        console.log("LIRI doesn't know that");
    }
};

// Func to take in CL arguments and execute correct function accordingly
let runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

// MAIN PROCESS
runThis(process.argv[2], process.argv.slice(3).join(" "));
