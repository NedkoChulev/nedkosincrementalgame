var storage = window.localStorage;

var skills = [
	{name: "2x Passive", HTMLid: document.getElementById("skill0"), duration: 0, coolDown: 3000},
	{name: "2x Crit DMG", HTMLid: document.getElementById("skill1"), duration: 0, coolDown: 5000},
	{name: "Skill 3", HTMLid: document.getElementById("skill2"), duration: 0, coolDown: 10000},
	{name: "Skill 4", HTMLid: document.getElementById("skill3"), duration: 0, coolDown: 50000},
	{name: "Skill 5", HTMLid: document.getElementById("skill4"), duration: 0, coolDown: 60000}
];

var features = [
	{name: "Inventory", 	HTMLbutton: document.getElementById("button-feature0"), HTMLid: document.getElementById("feature0")},
	{name: "Crafting", 		HTMLbutton: document.getElementById("button-feature1"), HTMLid: document.getElementById("feature1")},
	{name: "Achievements",	HTMLbutton: document.getElementById("button-feature2"), HTMLid: document.getElementById("feature2")},
	{name: "Pets", 			HTMLbutton: document.getElementById("button-feature3"), HTMLid: document.getElementById("feature3")},
	{name: "Quests",		HTMLbutton: document.getElementById("button-feature4"), HTMLid: document.getElementById("feature4")},
	{name: "Roulette",		HTMLbutton: document.getElementById("button-feature5"), HTMLid: document.getElementById("feature5")},
	{name: "Events",		HTMLbutton: document.getElementById("button-feature6"), HTMLid: document.getElementById("feature6")},
	{name: "Skill-Tree",	HTMLbutton: document.getElementById("button-feature7"), HTMLid: document.getElementById("feature7")}
];

var menu = [
	{name: "Profile",	HTMLbutton: document.getElementById("button-menu0"), HTMLid: document.getElementById("menu0"), HTMLclose: document.getElementById("close-profile-menu"), HTMLwindow: document.getElementById("profile-overlay"), HTMLcontent: document.getElementById("profile-overlay-content")},
	{name: "Log",		HTMLbutton: document.getElementById("button-menu1"), HTMLid: document.getElementById("menu1"), HTMLclose: document.getElementById("close-log-menu"), HTMLwindow: document.getElementById("log-overlay"), HTMLcontent: document.getElementById("log-overlay-content")},
	{name: "Options",	HTMLbutton: document.getElementById("button-menu2"), HTMLid: document.getElementById("menu2"), HTMLclose: document.getElementById("close-options-menu"), HTMLwindow: document.getElementById("options-overlay"), HTMLcontent: document.getElementById("options-overlay-content")},
	{name: "Save",		HTMLbutton: document.getElementById("button-menu3"), HTMLid: document.getElementById("menu3"), HTMLclose: document.getElementById("close-save-menu"), HTMLwindow: document.getElementById("save-overlay"), HTMLcontent: document.getElementById("save-overlay-content")},
	{name: "Load",		HTMLbutton: document.getElementById("button-menu4"), HTMLid: document.getElementById("menu4"), HTMLclose: document.getElementById("close-load-menu"), HTMLwindow: document.getElementById("load-overlay"), HTMLcontent: document.getElementById("load-overlay-content")}
];

var options = [
	{name: "Number Notations Toggle", HTMLinput: document.getElementById("number-notation-toggle")}
];

var leftSkyScraper =			document.getElementById("leftSkyScraper");
var rightSkyScraper =			document.getElementById("rightSkyScraper");
var comboSequence =				document.getElementById("comboSequence");
var comboPointsMessage =		document.getElementById("comboPointsMessage");
var breadCountText =			document.getElementById("bread-count-text");
var eggsCountText =				document.getElementById("eggs-count-text");
var goldCountText =				document.getElementById("gold-count-text");
var mainButton =				document.getElementById("mainButton");
var loadingBarLeft =			document.getElementById("loadingBarLeft");
var loadingBarRight =			document.getElementById("loadingBarRight");
var alerts =					document.getElementById("alerts");
var marquee =					document.getElementById("marquee");
var log =						document.getElementById("log");
var sellStockButton =			document.getElementById("sell-stock-button");
var buyStockButton =			document.getElementById("buy-stock-button");
var overlaySellStockButton =	document.getElementById("overlay-sell-stock-button");
var overlayBuyStockButton =		document.getElementById("overlay-buy-stock-button");
var marketHistoryLog =			document.getElementById("market-history");
var marketIndex =				document.getElementById("market-index");
var marketIndexOverlay =		document.getElementById("market-index-overlay");
var marketOverlayWindow = 		document.getElementById("market-history-overlay");
var marketOverlayContent = 		document.getElementById("market-history-overlay-content");
var marketOverlayClose =		document.getElementById("close-market-history-menu");

var clickPower = 1;
var critRate = 1;
var critDmgMultiplier = 2;

var combo;
var baseComboReward = 100;
var combinedComboReward = 0;
var comboCounter = 0;
var comboLength = 0;
var multipleCombos = 0;
var comboActiveColor = "#EC6F28";
var comboInactiveColor = "#eee";

var comboIntervalSpeed = 50;
var comboInterval = setInterval(drawComboCooldown, comboIntervalSpeed);
var loadingBarWidth = 1;

const marketUpdateTime = 1000;
let countdown = marketUpdateTime;
var marketUpdate = setInterval(updateMarket, marketUpdateTime);

var marketTimerInterval = setInterval(updateMarketTimer, 1000);

var bread = 0;
var eggs = 0;
var gold = 0;

var demand = 1;
const baseEggPrice = 100;
const minEggPrice = 20;
var currentEggPrice = baseEggPrice;

var gameSpeed = 1000;
var gameLoop = setInterval(loop, gameSpeed);
var numbersNotation = true; //True = Scientific; False = Alphabetical

var upgrades = initiateSkyScrapers();

var marketTimer = document.getElementById("market-timer")
var chartOverlayContent = document.getElementById("chart-overlay-content");
var chartClose = document.getElementById("close-chart-menu");
var chartZoom = document.getElementById("chart-zoom");
var chartWindow = document.getElementById("chart-overlay");
var zoomedChart = document.getElementById("zoomed-chart");
var zoomedChartMenu = document.getElementById("zoomed-chart-menu");
var chartContainer = document.getElementById("chart-container");
var eggMarketChart = document.getElementById("eggMarket").getContext('2d');
var chart = new Chart(eggMarketChart, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
        		 " ", " ", " ", " ", " ", " ", " ", " ", " ", " ",
        		 " ", " ", " ", " ", " "
        ],
        datasets: [{
            label: "EGM",
            borderColor: 'rgb(255, 99, 132)',
            data: [baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice,
            	   baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice,
            	   baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice,
            	   baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice,
            	   baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice, baseEggPrice
            ],
        }]
    },

    // Configuration options go here
    options: {
    	maintainAspectRatio: false,
    	responsive: true,
    	legend: {
    		display: false
    	},
    	
    	configuration: {
    		responsiveAnimationDuration: true
    	}
    }
});

//Basically the main method that starts the game
window.onload = function(){
	window.addEventListener('keydown', handleFirstTab);
	
	//System initiation
	initiateCloseAllWindows();
	initiateMenuButtons();
	initiateUpgrades();
	initiateRightClick();
	initiateCombo();
	skillsCooldown();
	initiateChartZoom();

	//Visuals initiation
	drawElements();
	animateButton();
	checkPrices();

	alertPlayer("Welcome!");
};

// What happens when you click the Click button
function buttonClick() {
	animateButton();
	hit();
	drawElements();
	checkPrices();
}

// Game's main loop - passively adds bread from the upgrades
function loop() {
	for (var i = upgrades.length - 1; i >= 0; i--) {
		eggs += upgrades[i].amount * upgrades[i].multiplier;
		drawElements();
		checkPrices();
	}
}

// Subtracts listed price from click count
// Adds 1 to the current amount of upgrades in the upgrades array
// Updates the upgrade's count text
// Updates the bread count and the CPS of all upgrades
function buyUpgrade(n) {
	upgrades[n].cost = Math.floor(Math.pow(upgrades[n].multiplier, upgrades[n].amount) * upgrades[n].baseCost);
	bread -= upgrades[n].cost;

	upgrades[n].amount++;
	document.getElementById(upgrades[n].HTMLamount.id).innerHTML = upgrades[n].amount;
	upgrades[n].HTMLcost.innerHTML = upgrades[n].cost + upgrades[n].amount;
	drawElements();
	checkPrices();
}

// Checks if any of the upgrades and skills are available for purchase
function checkPrices() {
	for (let i = upgrades.length - 1; i >= 0; i--) {
		//Check prices for x1
		if (bread >= upgrades[i].cost && bread >= upgrades[i].baseCost) {
			upgrades[i].HTMLid.classList.remove("disabled");
			upgrades[i].HTMLid.classList.add("enabled");
			upgrades[i].HTMLid.disabled = false;
		} else {
			upgrades[i].HTMLid.classList.remove("enabled");
			upgrades[i].HTMLid.classList.add("disabled");
			upgrades[i].HTMLid.disabled = true;
		}

		//Check prices for x10
		if (bread >= upgrades[i].cost && bread >= upgrades[i].baseCost) {
			upgrades[i].buttonx10.classList.remove("disabled");
			upgrades[i].buttonx10.classList.add("enabled");
			upgrades[i].buttonx10.disabled = false;
		} else {
			upgrades[i].buttonx10.classList.remove("enabled");
			upgrades[i].buttonx10.classList.add("disabled");
			upgrades[i].buttonx10.disabled = true;
		}

		//Check prices for x100
		if (bread >= upgrades[i].cost && bread >= upgrades[i].baseCost) {
			upgrades[i].buttonx100.classList.remove("disabled");
			upgrades[i].buttonx100.classList.add("enabled");
			upgrades[i].buttonx100.disabled = false;
		} else {
			upgrades[i].buttonx100.classList.remove("enabled");
			upgrades[i].buttonx100.classList.add("disabled");
			upgrades[i].buttonx100.disabled = true;
		}

		//Check prices for xMAX
		if (bread >= upgrades[i].cost && bread >= upgrades[i].baseCost) {
			upgrades[i].buttonxMAX.classList.remove("disabled");
			upgrades[i].buttonxMAX.classList.add("enabled");
			upgrades[i].buttonxMAX.disabled = false;
		} else {
			upgrades[i].buttonxMAX.classList.remove("enabled");
			upgrades[i].buttonxMAX.classList.add("disabled");
			upgrades[i].buttonxMAX.disabled = true;
		}
	}

	if (gold < currentEggPrice){buyStockButton.disabled = true;}
	if (gold < currentEggPrice){overlayBuyStockButton.disabled = true;}
	if (gold >= currentEggPrice){buyStockButton.disabled = false;}
	if (gold >= currentEggPrice){overlayBuyStockButton.disabled = false;}

	if (eggs <= 0){sellStockButton.disabled = true;}
	if (eggs <= 0){overlaySellStockButton.disabled = true;}
	if (eggs > 0){sellStockButton.disabled = false;}
	if (eggs > 0){overlaySellStockButton.disabled = false;}

/*	for (var i = skills.length - 1; i >= 0; i--) {
		if (bread >= skills[i].cost) {
			skills[i].HTMLid.classList.remove("disabled");
			skills[i].HTMLid.classList.add("enabled");
			skills[i].HTMLid.disabled = false;
		} else {
			skills[i].HTMLid.classList.remove("enabled");
			skills[i].HTMLid.classList.add("disabled");
			skills[i].HTMLid.disabled = true;
		}
	}*/
}

// Updates the upgrades' price texts
function drawElements() {
	breadCountText.innerHTML = numeral(bread).format('0.00a');//bread.toExponential(2);//.toLocaleString("en-EN");
	eggsCountText.innerHTML = numeral(eggs).format('0.00a');
	goldCountText.innerHTML = numeral(gold).format('0.00a');

	// Loops through all upgrade buttons and updates their CPS value
	for (let i = upgrades.length - 1; i >= 0; i--) {
		document.getElementById(upgrades[i].HTMLcps.id).innerHTML = upgrades[i].cps * upgrades[i].amount;
		document.getElementById(upgrades[i].HTMLamount.id).innerHTML = upgrades[i].amount;
	}
}

function get1k() {
	bread += 1000;
	drawElements();
	checkPrices();
}
function get10k() {
	bread += 10000;
	drawElements();
	checkPrices();
}
function get100k() {
	bread += 100000;
	drawElements();
	checkPrices();
}

function doubleSpeed() {
	clearInterval(gameLoop);
	gameSpeed = 500;
	gameLoop = setInterval(loop, gameSpeed);

	setTimeout(function() {
		clearInterval(gameLoop);
		gameSpeed = 1000;
		gameLoop = setInterval(loop, gameSpeed);
	}, 5000);
}

function doubleCritDmg() {
	setTimeout(function() {
		critDmgMultiplier *= 2;
	}, 5000);
}


function saveGame() {
	localStorage.setItem('Bread', bread);
	localStorage.setItem('CritRate', critRate);
}

function loadGame() {
	bread = parseInt(localStorage.getItem('Bread'));
	critRate = parseInt(localStorage.getItem('CritRate'));
	drawElements();
	checkPrices();
}

//If you click with the right mouse key
function initiateRightClick() {
	mainButton.addEventListener("contextmenu", function(event) {
		event.preventDefault();
		animateButton();
		hit();
		drawElements();
		checkPrices();
		return false;
	}, false);
}

function hit() {
	alertPlayer("click");
	if (Math.random()*100 <= critRate) {
		bread = bread + clickPower * critDmgMultiplier;
	} else {
		bread = bread + clickPower;
	}
}

//Sets the function of the arrow keys
function initiateCombo() {
	document.addEventListener('keydown', (event) => {
	switch(event.key){
		case "ArrowLeft":
			if (comboSequence.firstChild) {
				if (combo[comboCounter] == 1) {
		      		document.getElementById("combo" + comboCounter).style.color = comboActiveColor;
		      	comboCounter++;
		      	} else {
		      		for (var i = 0; i <= combo.length - 1; i++) {
		      			document.getElementById("combo" + i).style.color = comboInactiveColor;
		      		}
			      	comboCounter = 0;
		      	}
		      	checkComboCounter();
		      }
			break;
		case "ArrowRight":
			if (comboSequence.firstChild) {
				if (combo[comboCounter] == 2) {
		      		document.getElementById("combo" + comboCounter).style.color = comboActiveColor;
		      	comboCounter++;
		      	} else {
		      		for (var i = 0; i <= combo.length - 1; i++) {
		      			document.getElementById("combo" + i).style.color = comboInactiveColor;
		      		}
			      	comboCounter = 0;
		      	}
		      	checkComboCounter();
		      }
			break;
		case "ArrowUp":
			if (comboSequence.firstChild) {
				if (combo[comboCounter] == 3) {
		      		document.getElementById("combo" + comboCounter).style.color = comboActiveColor;
		      	comboCounter++;
		      	} else {
		      		for (var i = 0; i <= combo.length - 1; i++) {
		      			document.getElementById("combo" + i).style.color = comboInactiveColor;
		      		}
			      	comboCounter = 0;
		      	}
		      	checkComboCounter();
		      }
			break;
		case "ArrowDown":
			if (comboSequence.firstChild) {
				if (combo[comboCounter] == 4) {
		      		document.getElementById("combo" + comboCounter).style.color = comboActiveColor;
		      	comboCounter++;
		      	} else {
		      		for (var i = 0; i <= combo.length - 1; i++) {
		      			document.getElementById("combo" + i).style.color = comboInactiveColor;
		      		}
			      	comboCounter = 0;
		      	}
		      	checkComboCounter();
		      }
			break;
		}
	});
}

function initiateUpgrades() {
	for (let i = upgrades.length - 1; i >= 0; i--) {
			upgrades[i].HTMLid.addEventListener("click", function() {
				buyUpgrade(i);
			});

			upgrades[i].buttonx10.addEventListener("click", function() {
				for (var j = 0; j < 10; j++) {
					checkPrices();
					buyUpgrade(i);
				}
			});

			upgrades[i].buttonx100.addEventListener("click", function() {
				for (var j = 0; j < 10; j++) {
					buyUpgrade(i);
				}
			});

			upgrades[i].buttonxMAX.addEventListener("click", function() {
				for (var j = 0; j < 10; j++) {
					buyUpgrade(i);
				}
			});

			upgrades[i].HTMLcost.innerHTML = upgrades[i].baseCost.toLocaleString("en-EN");;
			upgrades[i].HTMLcps.innerHTML = upgrades[i].cps.toLocaleString("en-EN");;
	}
}

function checkComboCounter() {
	if (comboCounter >= combo.length) {
		multipleCombos++;
		combinedComboReward = baseComboReward * comboLength * multipleCombos;
		bread = bread + combinedComboReward;
		comboPointsAnimation(combinedComboReward, multipleCombos);
		drawElements();
		while (comboSequence.firstChild) {
    		comboSequence.removeChild(comboSequence.firstChild);
			}
		comboCounter = 0;
	}
}

//Removes any existing combo
//Generates a random combo between 5 and 10 moves long
function comboSpawner() {
	comboCounter = 0;
	if (comboSequence.firstChild) {
		multipleCombos = 0;
	}
	while (comboSequence.firstChild) {
    	comboSequence.removeChild(comboSequence.firstChild);
	}

	combo = new Array(Math.floor(Math.random() * 10) + 5);
	comboLength = combo.length;
	for (var i = 0; i <= combo.length - 1; i++) {
		combo[i] = Math.floor(Math.random() * 4) + 1;

		switch(combo[i]){
			case 1:
				var node = document.createElement("SPAN");
				node.innerHTML = "&#x21e6;";
				node.id = "combo" + i;
				comboSequence.appendChild(node);
				break;
			case 2:
				var node = document.createElement("SPAN");
				node.innerHTML = "&#x21e8;";
				node.id = "combo" + i;
				comboSequence.appendChild(node);
				break;
			case 3:
				var node = document.createElement("SPAN");
				node.innerHTML = "&#x21e7;";
				node.id = "combo" + i;
				comboSequence.appendChild(node);
				break;
			case 4:
				var node = document.createElement("SPAN");
				node.innerHTML = "&#x21e9;";
				node.id = "combo" + i;
				comboSequence.appendChild(node);
				break;
		}
	}
}

function drawComboCooldown() {
        if (loadingBarWidth >= 52) {
        	comboSpawner();
            loadingBarWidth = 1;
    		loadingBarLeft.style.width = 0;
    		loadingBarRight.style.width = 0;
        } else {
            loadingBarWidth += 0.5; 
            loadingBarLeft.style.width = loadingBarWidth + '%'; 
            loadingBarRight.style.width = loadingBarWidth + '%'; 
        }
    }

//Makes the main button wobble
function animateButton() {
	var duration = 0.3,
	delay = 0.08;
	TweenMax.to(mainButton, duration, {scaleY: 1.6, ease: Expo.easeOut});
	TweenMax.to(mainButton, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
	TweenMax.to(mainButton, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });

	mainButton.addEventListener("mouseover", function() {
		TweenMax.to(mainButton, 0.1, {scaleY: 1.1, ease: Expo.easeOut});
		TweenMax.to(mainButton, 0.1, {scaleX: 1.1, ease: Expo.easeOut});
	});
	mainButton.addEventListener("mouseout", function() {
		TweenMax.to(mainButton, 0.1, {scaleY: 1, ease: Expo.easeOut});
		TweenMax.to(mainButton, 0.1, {scaleX: 1, ease: Expo.easeOut});
	});
}

function comboPointsAnimation(n, m) {
	comboPointsMessage.innerHTML = "+" + n;
	alertPlayer("Combo X" + m + " [+" + n + "]");

	comboPointsMessage.classList.toggle("show");
	setTimeout(function() {
		comboPointsMessage.classList.toggle("hide");
		setTimeout(function() {
			comboPointsMessage.classList.toggle("hide");
			comboPointsMessage.classList.toggle("show");
		},1000);
	}, 200);
}

function alertPlayer(message) {
	date = new Date();
	timestamp = "[" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "]";

	marquee.innerHTML = "";
	marquee.innerHTML = timestamp + ": " + message;

	const ts = document.createElement("SPAN");
	const e = document.createElement("SPAN");
	const logEntry = document.createElement("P");

	ts.innerHTML = timestamp + ": ";
	ts.classList.add("timestamp");
	e.innerHTML = message;
	logEntry.appendChild(ts);
	logEntry.appendChild(e);

	log.appendChild(document.createElement("HR"));
	log.appendChild(logEntry);
	
	alerts.innerHTML = message;
	alerts.classList.toggle("show");
	setTimeout(function() {
		alerts.classList.toggle("hide");
		setTimeout(function() {
			alerts.classList.toggle("hide");
			alerts.classList.toggle("show");
		},2000);
	}, 1000);
}

function handleFirstTab(e) {
    if (e.keyCode === 9) { // the "I am a keyboard user" key
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
    }

    //Disable Arrow Keys for Scrolling
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}


function initiateMenuButtons() {
	for (let i = menu.length - 1; i >= 0; i--) {
		menu[i].HTMLbutton.addEventListener("click", function() {
			menu[i].HTMLwindow.style.display = "block";
		});

		menu[i].HTMLclose.addEventListener("click", function () {
			menu[i].HTMLwindow.style.display = "none";
		});

		menu[i].HTMLwindow.addEventListener("click", function() {
    	    menu[i].HTMLwindow.style.display = "none";
		});

		menu[i].HTMLcontent.addEventListener("click", function(e) {
			e.stopPropagation(); //clicking inside the window does not close it
		});
	}
}

function initiateCloseAllWindows() {
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 27) {
			closeChart();
			for (var i = menu.length - 1; i >= 0; i--) {
				menu[i].HTMLwindow.style.display = "none";
			}
		}
	});
}

//Options
function resetOptions() {
	options[0].HTMLinput.checked = true;
}

function saveOptions() {
	if (options[0].HTMLinput.checked) {

	}
}

function initiateSkyScrapers() {
	let upgradesArray = [];
	for (let i = 9; i >= 0; i--) {
		let container = document.createElement("DIV");
		let divx10 = document.createElement("DIV");
		let divx100 = document.createElement("DIV");
		let divxMAX = document.createElement("DIV");
		let btnx10 = document.createElement("BUTTON");
		let btnx100 = document.createElement("BUTTON");
		let btnxMAX = document.createElement("BUTTON");
		let upgradeContainer = document.createElement("DIV");
		let btnUpgrade = document.createElement("BUTTON");
		let upgradeTextContainer = document.createElement("DIV");
		let upgradeAmount = document.createElement("SPAN");
		let upgradeCPS = document.createElement("SPAN");
		let upgradeCost = document.createElement("SPAN");

		container.classList.add("grid-container-upgrades-buttons-left");
		upgradeContainer.classList.add("upgrade");
		upgradeTextContainer.classList.add("upgrade-text");
		divx10.classList.add("buy-multiple");
		divx100.classList.add("buy-multiple");
		divxMAX.classList.add("buy-multiple");

		btnx10.id = "upgrade" + i + "x10";
		btnx10.innerHTML = "x10";
		btnx100.id = "upgrade" + i + "x100";
		btnx100.innerHTML = "x100";
		btnxMAX.id = "upgrade" + i + "xMAX";
		btnxMAX.innerHTML = "MAX";
		btnUpgrade.id = "upgrade" + i;
		upgradeAmount.id = "amount-upgrade" + i;
		upgradeCPS.id = "cps-upgrade" + i;
		upgradeCost.id = "cost-upgrade" + i;

		upgradeTextContainer.innerHTML = "Upgrade " + i + " [";
		upgradeTextContainer.appendChild(upgradeAmount);
		upgradeTextContainer.innerHTML = upgradeTextContainer.innerHTML + "]<br>" + "(CPS: ";
		upgradeTextContainer.appendChild(upgradeCPS);
		upgradeTextContainer.innerHTML = upgradeTextContainer.innerHTML + ")<br>" + "Cost: ";
		upgradeTextContainer.appendChild(upgradeCost);

		btnUpgrade.appendChild(upgradeTextContainer);
		upgradeContainer.appendChild(btnUpgrade);

		divx10.appendChild(btnx10);
		divx100.appendChild(btnx100);
		divxMAX.appendChild(btnxMAX);

		container.appendChild(divx10);
		container.appendChild(upgradeContainer);
		container.appendChild(divx100);
		container.appendChild(divxMAX);

		leftSkyScraper.appendChild(container);

		let elem = {name: "Upgrade " + i,  amount: 0, multiplier: 1.07, cps: 5, cost: 0, baseCost: 50, HTMLamount: upgradeAmount, HTMLcps: upgradeCPS, HTMLcost: upgradeCost, HTMLid: btnUpgrade, buttonx10: btnx10, buttonx100: btnx100, buttonxMAX: btnxMAX};
		upgradesArray.push(elem);
	}

	for (let j = 19; j >= 10; j--) {
		let container = document.createElement("DIV");
		let divx10 = document.createElement("DIV");
		let divx100 = document.createElement("DIV");
		let divxMAX = document.createElement("DIV");
		let btnx10 = document.createElement("BUTTON");
		let btnx100 = document.createElement("BUTTON");
		let btnxMAX = document.createElement("BUTTON");
		let upgradeContainer = document.createElement("DIV");
		let btnUpgrade = document.createElement("BUTTON");
		let upgradeTextContainer = document.createElement("DIV");
		let upgradeAmount = document.createElement("SPAN");
		let upgradeCPS = document.createElement("SPAN");
		let upgradeCost = document.createElement("SPAN");

		container.classList.add("grid-container-upgrades-buttons-right");
		upgradeContainer.classList.add("upgrade");
		upgradeTextContainer.classList.add("upgrade-text");
		divx10.classList.add("buy-multiple");
		divx100.classList.add("buy-multiple");
		divxMAX.classList.add("buy-multiple");

		btnx10.id = "upgrade" + j + "x10";
		btnx10.innerHTML = "x10";
		btnx100.id = "upgrade" + j + "x100";
		btnx100.innerHTML = "x100";
		btnxMAX.id = "upgrade" + j + "xMAX";
		btnxMAX.innerHTML = "MAX";
		btnUpgrade.id = "upgrade" + j;
		upgradeAmount.id = "amount-upgrade" + j;
		upgradeCPS.id = "cps-upgrade" + j;
		upgradeCost.id = "cost-upgrade" + j;

		upgradeTextContainer.innerHTML = "Upgrade " + j + " [";
		upgradeTextContainer.appendChild(upgradeAmount);
		upgradeTextContainer.innerHTML = upgradeTextContainer.innerHTML + "]<br>" + "(CPS: ";
		upgradeTextContainer.appendChild(upgradeCPS);
		upgradeTextContainer.innerHTML = upgradeTextContainer.innerHTML + ")<br>" + "Cost: ";
		upgradeTextContainer.appendChild(upgradeCost);


		btnUpgrade.appendChild(upgradeTextContainer);
		upgradeContainer.appendChild(btnUpgrade);

		divx10.appendChild(btnx10);
		divx100.appendChild(btnx100);
		divxMAX.appendChild(btnxMAX);

		container.appendChild(divx10);
		container.appendChild(upgradeContainer);
		container.appendChild(divx100);
		container.appendChild(divxMAX);

		rightSkyScraper.appendChild(container);

		let elem = {name: "Upgrade " + j,  amount: 0, multiplier: 1.07, cps: 5, cost: 0, baseCost: 50, HTMLamount: upgradeAmount, HTMLcps: upgradeCPS, HTMLcost: upgradeCost, HTMLid: btnUpgrade, buttonx10: btnx10, buttonx100: btnx100, buttonxMAX: btnxMAX};
		upgradesArray.push(elem);
	}

	leftSkyScraper.scrollTop = leftSkyScraper.scrollHeight;
	rightSkyScraper.scrollTop = rightSkyScraper.scrollHeight;
	return upgradesArray
}

function skillsCooldown() {
	for (let i = skills.length - 1; i >= 0; i--) {
		skills[i].HTMLid.addEventListener("click", function() {
			let c = skills[i].coolDown/1000;
			skills[i].HTMLid.innerHTML = c + "s";
			skills[i].HTMLid.style.fontSize = "30px";
			skills[i].HTMLid.style.color = "#EC6F28";

			let int = setInterval(function () {
				c--;
				skills[i].HTMLid.innerHTML = c + "s";
				if (c == 0) {
					clearInterval(int);
				}
			}, 1000);

			skills[i].HTMLid.disabled = true;
			setTimeout(function(){
    			skills[i].HTMLid.disabled = false;
				skills[i].HTMLid.innerHTML = skills[i].name;
				skills[i].HTMLid.style.fontSize = "18px";
				skills[i].HTMLid.style.color = "#eee";
			}, skills[i].coolDown);
		});
	}
}

function gridToggle() {
	let gridElements = document.getElementsByClassName("grid-item");
	let toggleCheck = document.getElementById("gridToggle");

	if (toggleCheck.innerHTML == "ON") {
		for (var i = gridElements.length - 1; i >= 0; i--) {
			gridElements[i].style.border = "none";
		}
		toggleCheck.innerHTML = "OFF";
		return;
	}

	if (toggleCheck.innerHTML == "OFF") {
		for (var i = gridElements.length - 1; i >= 0; i--) {
			gridElements[i].style.border = "1px solid darkmagenta";
		}
		toggleCheck.innerHTML = "ON";
		return;
	}
}

function updateMarket() {
	let marketDirection;
	const marketDate = new Date();
	const marketTimestamp = ("0" + marketDate.getHours()).slice(-2) + ":" + ("0" + marketDate.getMinutes()).slice(-2);
   	let marketChange = (Math.random() * 49) * (Math.floor(Math.random()*2) == 1 ? 1 : -1)/100;
   	currentEggPrice = Math.floor((currentEggPrice + currentEggPrice * marketChange) * demand);
   	if (currentEggPrice < 20) {
   		currentEggPrice = 20;
   		marketChange = 0;
   	}
   	if (marketChange > 0) {
   		marketDirection = " &uarr; ";
		marketIndex.style.color = "#599643";
		marketIndexOverlay.style.color = "#599643";
		archiveMarket("EGM" + marketDirection + (marketChange*100).toFixed(2) + "%", 1);
   	}
   	if (marketChange < 0) {
   		marketDirection = " &darr; ";
   		marketIndex.style.color = "#db3a2b";
		marketIndexOverlay.style.color = "#db3a2b";
		archiveMarket("EGM" + marketDirection + (marketChange*100).toFixed(2) + "%", 0);
   	}
   	if (marketChange == 0) {
   		marketDirection = " &rarr; ";
   		marketIndex.style.color = "#aaa";
		marketIndexOverlay.style.color = "#aaa";
		archiveMarket("EGM" + marketDirection + (marketChange*100).toFixed(2) + "%", 0);	
   	}
	marketIndex.innerHTML = marketDirection + (marketChange*100).toFixed(2) + "%";
	marketIndexOverlay.innerHTML = marketDirection + (marketChange*100).toFixed(2) + "%";


    chart.data.datasets[0].data[25] = currentEggPrice;
    chart.data.datasets[0].data.shift();
	chart.data.labels.push(marketTimestamp);
    chart.data.labels.shift();
    chart.update();
}

function buyEggStock(b) {
	b.startPropagation;

	demand += 0.001;
	eggs++;
	gold = gold - currentEggPrice;

	checkPrices();
	drawElements();
}

function sellEggStock(b) {
	b.startPropagation;

	if (demand > 1) {demand -= 0.001;}
	eggs--;
	gold = gold + currentEggPrice;

	checkPrices();
	drawElements();
}

function updateMarketTimer() {
	let minutes, seconds;
	countdown-=1000;
	seconds = Math.floor(countdown / 1000);
	minutes = Math.floor(seconds / 60);
	marketTimer.innerHTML = ("0" + minutes).slice(-2) + ":" + ("0" + (seconds % 60)).slice(-2);

	if (countdown <= 0) {
		countdown = marketUpdateTime;
	}
}

function initiateChartZoom() {
	chartZoom.addEventListener("click", function() {
		chartWindow.style.display = "block";
		zoomedChart.appendChild(document.getElementById("eggMarket"));
	});

	chartWindow.addEventListener("click", function() {
		chartWindow.style.display = "none";
		chartContainer.appendChild(document.getElementById("eggMarket"));
	});

	chartClose.addEventListener("click", function() {
		chartWindow.style.display = "none";
		chartContainer.appendChild(document.getElementById("eggMarket"));
	});

	chartOverlayContent.addEventListener("click", function(e) {
		e.stopPropagation();
	});
}

function closeChart() {
	marketOverlayWindow.style.display = "none";
	chartWindow.style.display = "none";
	chartContainer.appendChild(document.getElementById("eggMarket"));
}

function openMarketHistory() {
	marketOverlayWindow.style.display = "block";

	marketOverlayClose.addEventListener("click", function () {
		marketOverlayWindow.style.display = "none";
	});

	marketOverlayWindow.addEventListener("click", function() {
	    marketOverlayWindow.style.display = "none";
	});

	marketOverlayContent.addEventListener("click", function(e) {
		e.stopPropagation(); //clicking inside the window does not close it
	});
}

function archiveMarket(message, direction) {
	const date = new Date();
	const timestamp = "[" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "]";

	const ts = document.createElement("SPAN");
	const entry = document.createElement("SPAN");
	const entryContainer = document.createElement("P");

	if (direction == 1) {entry.style.color = "#599643";}
	if (direction == 0) {entry.style.color = "#db3a2b";}

	ts.innerHTML = timestamp + ": ";
	ts.classList.add("timestamp");
	entry.innerHTML = message;
	entryContainer.appendChild(ts);
	entryContainer.appendChild(entry);

	marketHistoryLog.appendChild(document.createElement("HR"));
	marketHistoryLog.appendChild(entryContainer);
}