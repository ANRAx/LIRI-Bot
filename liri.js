// DEPENDENCIES 

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

