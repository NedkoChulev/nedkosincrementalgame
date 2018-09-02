var storage = window.localStorage;

var clickPower = 1;
var critRate = 1;
var critDmgMultiplier = 2;

var combo;
var comboReward = 1000;
var comboCounter = 0;
var comboActiveColor = "#EC6F28";
var comboInactiveColor = "#eee";

var comboIntervalSpeed = 50;
var comboInterval = setInterval(drawComboCooldown, comboIntervalSpeed);
var loadingBarWidth = 1;

var clicks = 0;
var gameSpeed = 1000;
var gameLoop = setInterval(loop, gameSpeed);
var date;
var timestamp;
var numbersNotation = true; //True = Scientific; False = Alphabetical

var upgrades = [
	{name: "Upgrade 1", HTMLamount: document.getElementById("amount-upgrade0"), HTMLcps: document.getElementById("cps-upgrade0"), HTMLcost: document.getElementById("cost-upgrade0"), HTMLid: document.getElementById("upgrade0"), buttonx10: document.getElementById("upgrade0x10"), buttonx100: document.getElementById("upgrade0x100"), buttonxMAX: document.getElementById("upgrade0xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 50},
	{name: "Upgrade 2", HTMLamount: document.getElementById("amount-upgrade1"), HTMLcps: document.getElementById("cps-upgrade1"), HTMLcost: document.getElementById("cost-upgrade1"), HTMLid: document.getElementById("upgrade1"), buttonx10: document.getElementById("upgrade1x10"), buttonx100: document.getElementById("upgrade1x100"), buttonxMAX: document.getElementById("upgrade1xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 250},
	{name: "Upgrade 3", HTMLamount: document.getElementById("amount-upgrade2"), HTMLcps: document.getElementById("cps-upgrade2"), HTMLcost: document.getElementById("cost-upgrade2"), HTMLid: document.getElementById("upgrade2"), buttonx10: document.getElementById("upgrade2x10"), buttonx100: document.getElementById("upgrade2x100"), buttonxMAX: document.getElementById("upgrade2xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 1000},
	{name: "Upgrade 4", HTMLamount: document.getElementById("amount-upgrade3"), HTMLcps: document.getElementById("cps-upgrade3"), HTMLcost: document.getElementById("cost-upgrade3"), HTMLid: document.getElementById("upgrade3"), buttonx10: document.getElementById("upgrade3x10"), buttonx100: document.getElementById("upgrade3x100"), buttonxMAX: document.getElementById("upgrade3xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 4000},
	{name: "Upgrade 5", HTMLamount: document.getElementById("amount-upgrade4"), HTMLcps: document.getElementById("cps-upgrade4"), HTMLcost: document.getElementById("cost-upgrade4"), HTMLid: document.getElementById("upgrade4"), buttonx10: document.getElementById("upgrade4x10"), buttonx100: document.getElementById("upgrade4x100"), buttonxMAX: document.getElementById("upgrade4xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 20000},
	{name: "Upgrade 6", HTMLamount: document.getElementById("amount-upgrade5"), HTMLcps: document.getElementById("cps-upgrade5"), HTMLcost: document.getElementById("cost-upgrade5"), HTMLid: document.getElementById("upgrade5"), buttonx10: document.getElementById("upgrade5x10"), buttonx100: document.getElementById("upgrade5x100"), buttonxMAX: document.getElementById("upgrade5xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 100000},
	{name: "Upgrade 7", HTMLamount: document.getElementById("amount-upgrade6"), HTMLcps: document.getElementById("cps-upgrade6"), HTMLcost: document.getElementById("cost-upgrade6"), HTMLid: document.getElementById("upgrade6"), buttonx10: document.getElementById("upgrade6x10"), buttonx100: document.getElementById("upgrade6x100"), buttonxMAX: document.getElementById("upgrade6xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 400000},
	{name: "Upgrade 8", HTMLamount: document.getElementById("amount-upgrade7"), HTMLcps: document.getElementById("cps-upgrade7"), HTMLcost: document.getElementById("cost-upgrade7"), HTMLid: document.getElementById("upgrade7"), buttonx10: document.getElementById("upgrade7x10"), buttonx100: document.getElementById("upgrade7x100"), buttonxMAX: document.getElementById("upgrade7xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 2500000},
	{name: "Upgrade 9", HTMLamount: document.getElementById("amount-upgrade8"), HTMLcps: document.getElementById("cps-upgrade8"), HTMLcost: document.getElementById("cost-upgrade8"), HTMLid: document.getElementById("upgrade8"), buttonx10: document.getElementById("upgrade8x10"), buttonx100: document.getElementById("upgrade8x100"), buttonxMAX: document.getElementById("upgrade8xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 15000000},
	{name: "Upgrade 10",HTMLamount: document.getElementById("amount-upgrade9"), HTMLcps: document.getElementById("cps-upgrade9"), HTMLcost: document.getElementById("cost-upgrade9"), HTMLid: document.getElementById("upgrade9"), buttonx10: document.getElementById("upgrade9x10"), buttonx100: document.getElementById("upgrade9x100"), buttonxMAX: document.getElementById("upgrade9xMAX"), amount: 0, multiplier: 1.07, cps: 1, cost: 100000000}
,];

var skills = [
	{name: "Skill 1", HTMLcost: document.getElementById("cost-skill0"), HTMLid: document.getElementById("skill0"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 2", HTMLcost: document.getElementById("cost-skill1"), HTMLid: document.getElementById("skill1"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 3", HTMLcost: document.getElementById("cost-skill2"), HTMLid: document.getElementById("skill2"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 4", HTMLcost: document.getElementById("cost-skill3"), HTMLid: document.getElementById("skill3"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 5", HTMLcost: document.getElementById("cost-skill4"), HTMLid: document.getElementById("skill4"), duration: 0, cost: 100, coolDown: 0}
];

var features = [
	{name: "Inventory", 	HTMLbutton: document.getElementById("button-feature0"), HTMLid: document.getElementById("feature0")},
	{name: "Crafting", 		HTMLbutton: document.getElementById("button-feature1"), HTMLid: document.getElementById("feature1")},
	{name: "Achievements",	HTMLbutton: document.getElementById("button-feature2"), HTMLid: document.getElementById("feature2")},
	{name: "Pets", 			HTMLbutton: document.getElementById("button-feature3"), HTMLid: document.getElementById("feature3")},
	{name: "Quests",		HTMLbutton: document.getElementById("button-feature4"), HTMLid: document.getElementById("feature4")},
	{name: "Roulette",		HTMLbutton: document.getElementById("button-feature5"), HTMLid: document.getElementById("feature5")},
	{name: "Events",		HTMLbutton: document.getElementById("button-feature6"), HTMLid: document.getElementById("feature6")},
	{name: "Shop",			HTMLbutton: document.getElementById("button-feature7"), HTMLid: document.getElementById("feature7")}
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

var comboSequence =			document.getElementById("comboSequence");
var comboPointsMessage =	document.getElementById("comboPointsMessage");
var clicksCountText =		document.getElementById("clicksCount-text");
var mainButton =			document.getElementById("mainButton");
var loadingBarLeft =		document.getElementById("loadingBarLeft");
var loadingBarRight =		document.getElementById("loadingBarRight");
var alerts =				document.getElementById("alerts");
var marquee =				document.getElementById("marquee");
var log =					document.getElementById("log");



//Basically the main method that starts the game
window.onload = function(){
	window.addEventListener('keydown', handleFirstTab);
	
	//System initiation
	initiateCloseAllWindows();
	initiateMenuButtons();
	initiateUpgrades();
	initiateRightClick();
	initiateCombo();

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

// Game's main loop - passively adds clicks from the upgrades
function loop() {
	for (var i = upgrades.length - 1; i >= 0; i--) {
		clicks += upgrades[i].amount * upgrades[i].multiplier;
		drawElements();
		checkPrices();
	}
}

// Subtracts listed price from click count
// Adds 1 to the current amount of upgrades in the upgrades array
// Updates the upgrade's count text
// Updates the clicks count and the CPS of all upgrades
function buyUpgrade(n) {
	clicks -= upgrades[n].cost;
	console.log(upgrades[n].cost);

	upgrades[n].amount++;
	upgrades[n].HTMLamount.innerHTML = upgrades[n].amount;
	upgrades[n].HTMLcost.innerHTML = upgrades[n].cost + upgrades[n].amount;
	drawElements();
	checkPrices();
}

// Checks if any of the upgrades and skills are available for purchase
function checkPrices() {
	for (let i = upgrades.length - 1; i >= 0; i--) {
		//Check prices for x1
		if (clicks >= upgrades[i].cost) {
			upgrades[i].HTMLid.classList.remove("disabled");
			upgrades[i].HTMLid.classList.add("enabled");
			upgrades[i].HTMLid.disabled = false;
		} else {
			upgrades[i].HTMLid.classList.remove("enabled");
			upgrades[i].HTMLid.classList.add("disabled");
			upgrades[i].HTMLid.disabled = true;
		}

		//Check prices for x10
		if (clicks >= upgrades[i].cost) {
			upgrades[i].buttonx10.classList.remove("disabled");
			upgrades[i].buttonx10.classList.add("enabled");
			upgrades[i].buttonx10.disabled = false;
		} else {
			upgrades[i].buttonx10.classList.remove("enabled");
			upgrades[i].buttonx10.classList.add("disabled");
			upgrades[i].buttonx10.disabled = true;
		}

		//Check prices for x100
		if (clicks >= upgrades[i].cost) {
			upgrades[i].buttonx100.classList.remove("disabled");
			upgrades[i].buttonx100.classList.add("enabled");
			upgrades[i].buttonx100.disabled = false;
		} else {
			upgrades[i].buttonx100.classList.remove("enabled");
			upgrades[i].buttonx100.classList.add("disabled");
			upgrades[i].buttonx100.disabled = true;
		}

		//Check prices for xMAX
		if (clicks >= upgrades[i].cost) {
			upgrades[i].buttonxMAX.classList.remove("disabled");
			upgrades[i].buttonxMAX.classList.add("enabled");
			upgrades[i].buttonxMAX.disabled = false;
		} else {
			upgrades[i].buttonxMAX.classList.remove("enabled");
			upgrades[i].buttonxMAX.classList.add("disabled");
			upgrades[i].buttonxMAX.disabled = true;
		}
	}

	for (var i = skills.length - 1; i >= 0; i--) {
		if (clicks >= skills[i].cost) {
			skills[i].HTMLid.classList.remove("disabled");
			skills[i].HTMLid.classList.add("enabled");
			skills[i].HTMLid.disabled = false;
		} else {
			skills[i].HTMLid.classList.remove("enabled");
			skills[i].HTMLid.classList.add("disabled");
			skills[i].HTMLid.disabled = true;
		}
	}
}

// Updates the upgrades' price texts
function drawElements() {
	clicksCountText.innerHTML = numeral(clicks).format('0a');//clicks.toExponential(2);//.toLocaleString("en-EN");
	
	// Loops through all upgrade buttons and updates their CPS value
	for (var i = upgrades.length - 1; i >= 0; i--) {
		upgrades[i].HTMLcps.innerHTML = upgrades[i].amount;
	}
}

function get1k() {
	clicks += 1000;
	drawElements();
	checkPrices();
}
function get10k() {
	clicks += 10000;
	drawElements();
	checkPrices();
}
function get100k() {
	clicks += 100000;
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
	localStorage.setItem('Clicks', clicks);
	localStorage.setItem('CritRate', critRate);
}

function loadGame() {
	clicks = parseInt(localStorage.getItem('Clicks'));
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
	if (Math.random()*100 <= critRate) {
		clicks = clicks + clickPower * critDmgMultiplier;
	} else {
		clicks = clicks + clickPower;
	}
}

//Sets the function of the arrow keys
function initiateCombo() {
	document.addEventListener('keydown', (event) => {
	switch(event.key){
		case "ArrowLeft":
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
			break;
		case "ArrowRight":
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
			break;
		case "ArrowUp":
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
			break;
		case "ArrowDown":
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

			upgrades[i].HTMLcost.innerHTML = upgrades[i].cost.toLocaleString("en-EN");;
			upgrades[i].HTMLcps.innerHTML = upgrades[i].cps.toLocaleString("en-EN");;
	}
}

function checkComboCounter() {
	if (comboCounter >= combo.length) {
		clicks += comboReward;
		alertPlayer("Combo!");
		comboPointsAnimation();
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
	while (comboSequence.firstChild) {
    	comboSequence.removeChild(comboSequence.firstChild);
	}

	combo = new Array(Math.floor(Math.random() * 10) + 5);
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

function comboPointsAnimation() {
	comboPointsMessage.innerHTML = "+" + comboReward;

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
	ts.style.color = "#aaa";
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
		},500);
	}, 50);
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
			event.stopPropagation();
		})
	}
}

function initiateCloseAllWindows() {
	window.addEventListener("keydown", function(e) {
		if (e.keyCode == 27) {
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