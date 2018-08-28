require("dotenv").config();

var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var keys = require('./keys');
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

//READS THE USER INPUT.

var input = process.argv[2];
var term = process.argv.slice(3).join(" ");

// INSTEAD OF CREATING A FUNCTION , IT READS THE USER INPUT ON TERMINAL AND DIRECTLY GRABS THE TWEETS.  

if (input === 'my-tweets') {

    client.get('statuses/user_timeline', { screen_name: 'harryrim', count: 20 }, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            {
                for (i = 0; i < tweets.length; i++) {
                    console.log("Created at: " + tweets[i].created_at);
                    console.log("Text: " + tweets[i].text);
                    console.log('--------------------------------------');
                }
            }
        }
    });
}
// MADE THIS INTO A FUNCTION SO IT CAN BE CALLED WHEN INPUTTING DO-WHAT-IT-SAYS.
function song() {

    spotify.search({ type: 'track', query: term }, function (error, data, response) {
        if (error && response.statusCode === 200) {
            return console.log('Error occurred: ' + err);
        }

        var song = data.tracks.items[0];

        var trackData = [
            "  Artist(s): " + song.artists[0].name,
            "  Song Title: " + song.name,
            "  Spotify Link: " + song.external_urls.spotify,
            "  Album: " + song.album.name
        ].join("\n\n");
        console.log('\n' + trackData);

    });
}
// READS USER INPUT THAT CALLS THE FUNCTION.
if (input === "spotify-this-song") {
    if (!term) {
        term = 'The Sign by Ace of Base'
    }
    song(); 
};



// INSTEAD OF CREATING A FUNCTION , IT READS THE USER INPUT ON TERMINAL AND DIRECTLY GRABS THE MOVIE INFO.  
if (input === 'movie-this') {
    
        if (!term) {
            term = 'Mr.Nobody'
        }
    request("http://www.omdbapi.com/?t=" + term + "&y=&plot=full&tomatoes=true&apikey=trilogy", (error, response, body) => {

        if (!error && response.statusCode === 200) {
            
            var movies = JSON.parse(body)
            var movieList = [
                "  Movie Title: " + movies.Title,
                "  Release Year: " + movies.Year,
                "  IMDB Rating: " + movies.imdbRating,
                "  Rotton Tomatoes: " + movies.Ratings[1].Value,
                "  Country: " + movies.Country,
                "  Language: " + movies.Language,
                "  Plot: " + movies.Plot,
                "  Actors: " + movies.Actors
            ].join("\n\n");
            console.log('\n' + movieList);


        }
    });

}
//READS THE USER INPUT FROM TERMINAL AND USES fs require to read the random.txt file and to use the first set as a search input and the other half the term input.
else if (input === 'do-what-it-says') {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }

        var randomSong = data.split(',')
        search = randomSong[0]
        term = randomSong[1]
        song();


    }
    );
}


