let tableBody;
let buttonRow;

let region = "all";
let players = -1;

function xhrSuccess() {
	this.callback.apply(this, this.arguments);
}

function xhrError() {
	console.error(this.statusText);
}

function loadFile(sURL, fCallback) {
	var oReq = new XMLHttpRequest();
	oReq.callback = fCallback;
	oReq.arguments = Array.prototype.slice.call(arguments, 2);
	oReq.onload = xhrSuccess;
	oReq.onerror = xhrError;
	oReq.open("get", sURL, true);
	oReq.send(null);
}

function init() {
	loadFile("http://localhost/api/getallgames", initGames);
}

function resetTable() {
	tableBody.innerHTML = "";
}

function initGames() {
	let allGames = JSON.parse(this.responseText); // json antwort von der api parsen und in array laden
	for (let i = 0; i < allGames.length; i++) {
		let currentGame = allGames[i];
		let row = tableBody.insertRow(i);
		var title = row.insertCell(0);
		title.innerHTML = currentGame.title;
		var genre = row.insertCell(1);
		genre.innerHTML = currentGame.genre;
		var developer = row.insertCell(2);
		developer.innerHTML = currentGame.developer;
		var players = row.insertCell(3);
		if (currentGame.players.max === 1) {
			players.innerHTML = "1";
		}
		else {
			players.innerHTML =  currentGame.players.min + "-" + currentGame.players.max;
		}
	}
}

function initRegionButtons() {
	let regionButtonDiv = document.createElement("div");
	regionButtonDiv.classList = "btn-group col-md-6";	
	buttonRow.appendChild(regionButtonDiv);

	let regionButton = document.createElement("button");
	regionButton.type = "button";
	regionButton.classList = "btn btn-default dropdown-toggle";
	regionButton.setAttribute("data-toggle", "dropdown");
	regionButton.innerHTML = "Select your region <span class='caret'></span>";
	regionButtonDiv.appendChild(regionButton);

	let dropdownList = document.createElement("ul");
	dropdownList.className = "dropdown-menu";
	regionButtonDiv.appendChild(dropdownList);

	let usRegion = document.createElement("li");
	let usRegionLink = document.createElement("a");
	usRegionLink.href = "#";
	usRegionLink.innerText = "NTSC-U (America)";
	usRegion.appendChild(usRegionLink);
	dropdownList.appendChild(usRegion);

	usRegion.addEventListener("click", function () {
		onRegionClick("us");
	});

	let japRegion = document.createElement("li");
	let japRegionLink = document.createElement("a");
	japRegionLink.href = "#";
	japRegionLink.innerText = "NTSC-J (Japan)";
	japRegion.appendChild(japRegionLink);
	dropdownList.appendChild(japRegion);

	japRegion.addEventListener("click", function () {
		onRegionClick("jap");
	});

	let palRegion = document.createElement("li");
	let palRegionLink = document.createElement("a");
	palRegionLink.href = "#";
	palRegionLink.innerText = "PAL (Europe & Australia)";
	palRegion.appendChild(palRegionLink);
	dropdownList.appendChild(palRegion);

	palRegion.addEventListener("click", function () {
		onRegionClick("pal");
	});

	let separator = document.createElement("li");
	separator.className = "divider";
	separator.setAttribute("role", "separator");
	dropdownList.appendChild(separator);

	let allRegions = document.createElement("li");
	let allRegionsLink = document.createElement("a");
	allRegionsLink.href = "#";
	allRegionsLink.innerText = "Show all regions";
	allRegions.appendChild(allRegionsLink);
	dropdownList.appendChild(allRegions);

	allRegions.addEventListener("click", function () {
		onRegionClick("all");
	});

	buttonRow.style.paddingBottom = "20px";
}

function initPlayerButtons() {
	let playerButtonDiv = document.createElement("div");
	playerButtonDiv.classList = "btn-group col-md-6";	
	buttonRow.appendChild(playerButtonDiv);

	let playerButton = document.createElement("button");
	playerButton.type = "button";
	playerButton.classList = "btn btn-default dropdown-toggle pull-right";
	playerButton.setAttribute("data-toggle", "dropdown");
	playerButton.innerHTML = "Select how many players you are <span class='caret'></span>";
	playerButtonDiv.appendChild(playerButton);

	let dropdownList = document.createElement("ul");
	dropdownList.classList = "dropdown-menu pull-right";
	playerButtonDiv.appendChild(dropdownList);

	for (let i = 1; i <= 4; i++) {
		let players = document.createElement("li");
		let playerLink = document.createElement("a");
		playerLink.href = "#";
		playerLink.innerText = i + " players";
		players.appendChild(playerLink);
		dropdownList.appendChild(players);

		players.addEventListener("click", function () {
			onPlayerClick(i);
		});
	}

	let separator = document.createElement("li");
	separator.className = "divider";
	separator.setAttribute("role", "separator");
	dropdownList.appendChild(separator);

	let allGamesButton = document.createElement("li");
	let allGamesButtonLink = document.createElement("a");
	allGamesButtonLink.href = "#";
	allGamesButtonLink.innerText = "Show all games";
	allGamesButton.appendChild(allGamesButtonLink);
	dropdownList.appendChild(allGamesButton);

	allGamesButton.addEventListener("click", function () {
		onPlayerClick("all");
	});
}

function onRegionClick(gameRegion) {
	resetTable();
	let url;
	region = gameRegion;
	switch (gameRegion) {
		case "us":
			url = "getusgames";
			break;
		case "jap":
			url = "getjapangames";
			break;
		case "pal":
			url = "getpalgames";
			break;
		case "all":
		default:
			url = "getallgames";
			break;
	};
	if (players !== -1) {
		url += "/" + players;
	}
	console.log(url);
	loadFile("http://localhost/api/" + url, initGames);
}

function onPlayerClick(newPlayers) {
	resetTable();
	let url;
	players = newPlayers;
	switch (region) {
		case "us":
			url = "getusgames";
			break;
		case "jap":
			url = "getjapangames";
			break;
		case "pal":
			url = "getpalgames";
			break;
		case "all":
		default:
			url = "getAllGames";
			break;
	};
	if (newPlayers !== -1) {
		if(newPlayers !== "all") {
			url += "/" + newPlayers;
		}
	}
	console.log(url);
	loadFile("http://localhost/api/" + url, initGames);
}

function setUpPage() {
	document.querySelector("head").innerHTML += "<!-- Bootstrap CSS -->\n<link rel='stylesheet' href='style/bootstrap.min.css'>";

	let content = document.getElementById("content");

	let container = document.createElement("div");
	container.className = "container";
	container.id = "main";
	content.appendChild(container);

	let navigation = document.createElement("nav");
	navigation.classList = "navbar navbar-inverse navbar-fixed-top";
	container.appendChild(navigation);

	let navigationHeader = document.createElement("div");
	navigationHeader.className = "navbar-header";
	navigation.appendChild(navigationHeader);

	let collapseButton = document.createElement("button");
	collapseButton.type = "button";
	collapseButton.classList = "navbar-toggle collapsed";
	collapseButton.setAttribute("data-toggle", "dropdown");
	collapseButton.setAttribute("data-target", ".navbar-collapse");
	collapseButton.innerHTML = "<span class='sr-only'>Toggle navigation</span>\n<span class='icon-bar'></span>\n<span class='icon-bar'></span>\n<span class='icon-bar'></span>";
	navigationHeader.appendChild(collapseButton);

	let brandButton = document.createElement("a");
	brandButton.className = "navbar-brand";
	brandButton.href = "https://dreamcast.xnmn.de";
	brandButton.innerHTML = "Dreamcast Game Helper";
	navigationHeader.appendChild(brandButton);

	let navbar = document.createElement("div");
	navbar.classList = "navbar-collapse collapse";
	navigation.appendChild(navbar);

	let navbarItems = document.createElement("ul");
	navbarItems.classList = "nav navbar-nav";
	navbar.appendChild(navbarItems);

	let homeButton = document.createElement("li");
	homeButton.className = "active";
	navbarItems.appendChild(homeButton);

	let homeButtonLink = document.createElement("a");
	homeButtonLink.href = "https://dreamcast.xnmn.de";
	homeButtonLink.innerHTML = "Home";
	homeButton.appendChild(homeButtonLink);

	let impressumButton = document.createElement("li");
	navbarItems.appendChild(impressumButton);

	let impressumButtonLink = document.createElement("a");
	impressumButtonLink.href = "https://xnmn.de/impressum/";
	impressumButtonLink.innerHTML = "Impressum";
	impressumButton.appendChild(impressumButtonLink);

	let NUMBER_OF_ROWS = 3;
	let rows = [];

	for (let i = 0; i < NUMBER_OF_ROWS; i++) {
		let row = document.createElement("div");
		row.className = "row";
		rows[i] = row;
		container.appendChild(row);
	}

	let headlineBox = document.createElement("div");
	headlineBox.classList = "col-md-12";
	rows[0].appendChild(headlineBox);

	let headlineBoxHeader = document.createElement("div");
	headlineBoxHeader.classList = "page-header";
	headlineBox.appendChild(headlineBoxHeader);

	let headline = document.createElement("h1");
	headline.innerText = "Dreamcast Game Helper";
	headlineBoxHeader.appendChild(headline);

	buttonRow = rows[1];

	let tableDiv = document.createElement("div");
	tableDiv.className = "table-responsive col-md-12";
	rows[2].appendChild(tableDiv);

	let table = document.createElement("table");
	table.classList = "table table-striped table-bordered table-hover";
	tableDiv.appendChild(table);

	let header = table.createTHead();
	let headRow = header.insertRow(0);
	var head = new Array(4);
	head[0] = document.createElement("th");
	head[0].innerHTML = "Title";
	headRow.appendChild(head[0]);
	head[1] = document.createElement("th");
	head[1].innerHTML = "Genre";
	headRow.appendChild(head[1]);
	head[2] = document.createElement("th");
	head[2].innerHTML = "Developer";
	headRow.appendChild(head[2]);
	head[3] = document.createElement("th");
	head[3].innerHTML = "Number of players";
	headRow.appendChild(head[3]);

	tableBody = table.createTBody();

	let footer = document.createElement("footer");
	content.appendChild(footer);

	let footerContainer = document.createElement("div");
	footerContainer.classList = "container text-center";
	footer.appendChild(footerContainer);

	let footerContent = document.createElement("p");
	footerContent.classList = "text-muted credit";
	footerContent.innerHTML = "&copy; 2015 - 2017 <a href='https://marc-hein.de'>Marc Hein</a> - <a href='https://xnmn.de/impressum/Datenschutz/'>Datenschutz</a>";
	footerContainer.appendChild(footerContent);

	let body = document.querySelector("body");

	let bootstrapJS = document.createElement("script");
	bootstrapJS.src = "js/bootstrap.min.js";
	body.appendChild(bootstrapJS);

	initRegionButtons();
	initPlayerButtons();

	init();
}

setUpPage();
