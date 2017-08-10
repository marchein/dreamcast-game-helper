var config = require("./config");
var express = require("express");
var server = express();
let expressPort = config.port;
const mysql = require("mysql");
var apicache = require("apicache");
var cache = apicache.middleware;
//apicache.options({ debug: true });

let allgames = [];
let japangames = [];
let usgames = [];
let palgames = [];

server.use(cache("2 weeks"));

//server.use(express.static("dist"));

// eslint-disable-next-line
var router = express.Router(); // init the url for the api
server.use("/api", router);

router.get("/", function (req, res) {
	let header = "<h1>Dreamcast Games API</h1>\n";
	let commands = "<ul>\n\t<li>/getAllGames - shows all games from all regions</li>\n\t<li>/getjapangames - shows all games from the NTSC-J region</li>\n\t<li>/getjapangames/:players - shows all games from the NTSC-J region for ':players' players</li>\n\t<li>/getusgames - shows all games from the NTSC-U region</li>\n\t<li>/getusgames/:players - shows all games from the NTSC-U region for ':players' players</li>\n\t<li>/getpalgames - shows all games from the PAL region</li>\n\t<li>/getpalgames/:players - shows all games from the PAL region for ':players' players</li>\n</ul>";
	let usage = "<h2>Usage:</h2>\n" + commands;
	res.send(header + usage);
});

router.get("/getallgames", function (req, res) {
	var json = JSON.stringify(allgames);
	res.send(json);
});

router.get("/getallgames/:players", function (req, res) {
	let players = req.params.players;
	res.send(getNPlayerGames(allgames, players));
});

router.get("/getjapangames", function (req, res) {
	var json = JSON.stringify(japangames);
	res.send(json);
});

router.get("/getjapangames/:players", function (req, res) {
	let players = req.params.players;
	res.send(getNPlayerGames(japangames, players));
});

router.get("/getusgames", function (req, res) {
	var json = JSON.stringify(usgames);
	res.send(json);
});

router.get("/getusgames/:players", function (req, res) {
	let players = req.params.players;
	res.send(getNPlayerGames(usgames, players));
});

router.get("/getpalgames", function (req, res) {
	var json = JSON.stringify(palgames);
	res.send(json);
});

router.get("/getpalgames/:players", function (req, res) {
	let players = req.params.players;
	res.send(getNPlayerGames(palgames, players));
});

function getNPlayerGames(areaGames, numberOfPlayers) {
	if (numberOfPlayers >= 1 && numberOfPlayers <= 4) {
		let nPlayersGames = [];
		for (let i = 0; i < areaGames.length; i++) {
			if (areaGames[i].players.min <= numberOfPlayers && areaGames[i].players.max >= numberOfPlayers) {
				nPlayersGames.push(areaGames[i]);
			}
		}
		return JSON.stringify(nPlayersGames);
	}
	else {
		return { error: "Min 1 player and max 4 players allowed!" };
	}
}

// Handle 404 error.
server.use("*", function (req, res) {
	res.status(404).send("<h1>Error 404 - not found</h1>"); // not found error
});

server.listen(expressPort, function () {
	getAllGames(function (games) {
		allgames = games;
		for (let i = 0; i < allgames.length; i++) {
			if (allgames[i].releasedIn.japan !== "Unreleased") {
				japangames.push(allgames[i]);
			}
			if (allgames[i].releasedIn.us !== "Unreleased") {
				usgames.push(allgames[i]);
			}
			if (allgames[i].releasedIn.pal !== "Unreleased") {
				palgames.push(allgames[i]);
			}
		}
	});
	console.log("Server running on port: " + this.address().port);
});

function getAllGames(callback) {
	var mySQLConnection = mysql.createConnection({
		host: config.mysql.host,
		user: config.mysql.user,
		password: config.mysql.password,
		database: config.mysql.database,
		timezone: "UTC+2",
		dateStrings: "TIMESTAMP"
	});

	mySQLConnection.connect(function (err) {
		let games = [];
		if (err) {
			throw err;
		}
		let sql = "SELECT * FROM `games`";
		mySQLConnection.query(sql, function (err, result) {
			if (err) {
				throw err;
			}
			for (let i = 0; i < result.length; i++) {
				let playerCount = -1;
				if (result[i].players === "1") {
					playerCount = {
						min: 1,
						max: 1
					};
				}
				else {
					let playerString = result[i].players.split("-");
					playerCount = {
						min: playerString[0],
						max: playerString[1]
					};
				}
				let currentEntry = {
					title: result[i].Title,
					genre: result[i].Genre,
					developer: result[i].Developer,
					releasedIn: {
						japan: result[i].JP,
						us: result[i].NA,
						pal: result[i].PAL
					},
					players: playerCount
				};
				games.push(currentEntry);
			}
		});
		mySQLConnection.end(function () {
			callback(games);
		});
	});
}
