var request = require('request');
var fs = require('fs');
var Spotify = require('node-spotify-api');

var dotenv = require("dotenv").config();
var keys = require("./keys.js");


var moment = require('moment');
moment().format();


var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var input = process.argv[3];


function concertIt(bandQuery) {


    var queryUrl = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=codingbootcamp#";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            var concertData = JSON.parse(body);

            var concertDT = concertData[0].datetime
            var momentDT = moment().format('L');



            console.log("===============================");

            console.log("Venue Name : " + concertData[0].venue.name +
             
                "\nVenue Location: " + concertData[0].venue.city + "," + concertData[0].venue.country +

                "\nDate of the Event: " + momentDT +
                "\n===============================");
            
        };
    });
}

function spotifyIt(musicSearch) {


    if (musicSearch === undefined || null) {
        musicSearch = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: musicSearch }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
                    
        else {
            for (i = 0; i < data.tracks.items.length && i < 5; i++){
            
                var musicQuery = data.tracks.items[i];

                console.log("Artist: " + musicQuery.artists[0].name +
               
                "\nSong Name: " + musicQuery.name +
                
                "\nLink to Song: " + musicQuery.preview_url +
               
                "\nAlbum Name: " + musicQuery.album.name +
                "\n===============================");
            }
        };  
    });
}



function movieIt (movieQuery) {
 

     if (movieQuery === undefined || null) {
            movieQuery = "Mr.Nobody";
        }


    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";


    console.log(queryUrl);

    request(queryUrl, function (error, response, body) { 
        

       if (!error && response.statusCode === 200) {      
 
            var movieData = JSON.parse(body);
                                   
           
                console.log("===============================");
            // * Title of the movie.              
                console.log("Movie Title: " + movieData.Title +
            // * Year the movie came out.
                "\nYear: " + movieData.released +
            // * IMDB Rating of the movie.
                "\nIMDB Rating: " + movieData.imdbRating +
            // * Rotten Tomatoes Rating of the movie.
                "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value +
            // * Country where the movie was produced.
                "\nCountry: " + movieData.Country +
            // * Language of the movie.
                "\nLanguage: " + movieData.Language +
            // * Plot of the movie.
                "\nPlot: " + movieData.Plot +
            // * Actors in the movie.
                "\nActors: " + movieData.Actors +
                "\n===============================");             
            // };
        };
    }); 
}

var ask = function (commands, funData){
    switch(commands) {
        case "concert-this":
            concertIt(funData);
            break;
        case "movie-this" :
            movieIt(funData);
            break;    
        case 'spotify-this-song':
            spotifyIt(funData); 
            break;
        case 'do-what-it-says':
            doWhatItSays(); 
            break;
        default:
        console.log("Invalid command. Please try again");
    }
};


var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) throw err;
            var randomText = data.split(",");
        
        if (randomText.length == 2) {
            ask(randomText[0], randomText[1]);
        }
        else if (randomText.length == 1) {
            ask(randomText[0]);
        }
    });
}

ask (command, input);
