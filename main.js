var storage = window.localStorage;

var clickPower = 1;
var critRate = 1;
var critDmgMultiplier = 2;

var combo;
var comboReward = 1000;
var comboCounter = 0;
var comboActiveColor = "#EC6F28";
var comboInactiveColor = "#eee";

var comboInterval;
var comboIntervalSpeed = 50;
var loadingBarWidth = 1;

var clicks = 0;
var gameSpeed = 1000;
var gameLoop = setInterval(loop, gameSpeed);

var upgrades = [
	{HTMLamount: document.getElementById("amount-upgrade0"), HTMLcps: document.getElementById("cps-upgrade0"), HTMLcost: document.getElementById("cost-upgrade0"), HTMLid: document.getElementById("upgrade0"), name: "Upgrade 1", amount: 0, multiplier: 1, cps: 1, cost: 10},
	{HTMLamount: document.getElementById("amount-upgrade1"), HTMLcps: document.getElementById("cps-upgrade1"), HTMLcost: document.getElementById("cost-upgrade1"), HTMLid: document.getElementById("upgrade1"), name: "Upgrade 2", amount: 0, multiplier: 2, cps: 1, cost: 100},
	{HTMLamount: document.getElementById("amount-upgrade2"), HTMLcps: document.getElementById("cps-upgrade2"), HTMLcost: document.getElementById("cost-upgrade2"), HTMLid: document.getElementById("upgrade2"), name: "Upgrade 3", amount: 0, multiplier: 3, cps: 1, cost: 1000},
	{HTMLamount: document.getElementById("amount-upgrade3"), HTMLcps: document.getElementById("cps-upgrade3"), HTMLcost: document.getElementById("cost-upgrade3"), HTMLid: document.getElementById("upgrade3"), name: "Upgrade 4", amount: 0, multiplier: 4, cps: 1, cost: 10000},
	{HTMLamount: document.getElementById("amount-upgrade4"), HTMLcps: document.getElementById("cps-upgrade4"), HTMLcost: document.getElementById("cost-upgrade4"), HTMLid: document.getElementById("upgrade4"), name: "Upgrade 5", amount: 0, multiplier: 5, cps: 1, cost: 100000},
	{HTMLamount: document.getElementById("amount-upgrade5"), HTMLcps: document.getElementById("cps-upgrade5"), HTMLcost: document.getElementById("cost-upgrade5"), HTMLid: document.getElementById("upgrade5"), name: "Upgrade 6", amount: 0, multiplier: 6, cps: 1, cost: 1000000},
	{HTMLamount: document.getElementById("amount-upgrade6"), HTMLcps: document.getElementById("cps-upgrade6"), HTMLcost: document.getElementById("cost-upgrade6"), HTMLid: document.getElementById("upgrade6"), name: "Upgrade 7", amount: 0, multiplier: 7, cps: 1, cost: 10000000},
	{HTMLamount: document.getElementById("amount-upgrade7"), HTMLcps: document.getElementById("cps-upgrade7"), HTMLcost: document.getElementById("cost-upgrade7"), HTMLid: document.getElementById("upgrade7"), name: "Upgrade 8", amount: 0, multiplier: 8, cps: 1, cost: 100000000},
	{HTMLamount: document.getElementById("amount-upgrade8"), HTMLcps: document.getElementById("cps-upgrade8"), HTMLcost: document.getElementById("cost-upgrade8"), HTMLid: document.getElementById("upgrade8"), name: "Upgrade 9", amount: 0, multiplier: 9, cps: 1, cost: 1000000000},
	{HTMLamount: document.getElementById("amount-upgrade9"), HTMLcps: document.getElementById("cps-upgrade9"), HTMLcost: document.getElementById("cost-upgrade9"), HTMLid: document.getElementById("upgrade9"), name: "Upgrade 10", amount: 0, multiplier: 10, cps: 1, cost: 10000000000}
,];

var skills = [
	{name: "Skill 1", HTMLcost: document.getElementById("cost-skill0"), HTMLid: document.getElementById("skill0"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 2", HTMLcost: document.getElementById("cost-skill1"), HTMLid: document.getElementById("skill1"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 3", HTMLcost: document.getElementById("cost-skill2"), HTMLid: document.getElementById("skill2"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 4", HTMLcost: document.getElementById("cost-skill3"), HTMLid: document.getElementById("skill3"), duration: 0, cost: 100, coolDown: 0},
	{name: "Skill 5", HTMLcost: document.getElementById("cost-skill4"), HTMLid: document.getElementById("skill4"), duration: 0, cost: 100, coolDown: 0}
];

var saveButton = document.getElementById("saveButton");
var loadButton = document.getElementById("loadButton");

var comboSequence = document.getElementById("comboSequence");
var comboPointsMessage = document.getElementById("comboPointsMessage");
var clicksCountText = document.getElementById("clicksCount-text");
var mainButton = document.getElementById("mainButton");
var loadingBarLeft = document.getElementById("loadingBarLeft");
var loadingBarRight = document.getElementById("loadingBarRight");
var alerts = document.getElementById("alerts");



//Basically the main method that starts the game
window.onload = function(){
	window.addEventListener('keydown', handleFirstTab);
	initiateUpgrades();
	initiateRightClick();
	initiateCombo();
	drawElements();
	animateButton();
	checkPrices();
	comboInterval = setInterval(frame, comboIntervalSpeed);
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

	upgrades[n].amount++;
	upgrades[n].HTMLamount.innerHTML = upgrades[n].amount;
	upgrades[n].HTMLcost.innerHTML = upgrades[n].cost + upgrades[n].amount;
	drawElements();
	checkPrices();
}

// Checks if any of the upgrades and skills are available for purchase
function checkPrices() {
	for (let i = upgrades.length - 1; i >= 0; i--) {
		if (clicks >= upgrades[i].cost) {
			upgrades[i].HTMLid.classList.remove("disabled");
			upgrades[i].HTMLid.classList.add("enabled");
			upgrades[i].HTMLid.disabled = false;
		} else {
			upgrades[i].HTMLid.classList.remove("enabled");
			upgrades[i].HTMLid.classList.add("disabled");
			upgrades[i].HTMLid.disabled = true;
		}

		if (upgrades[i].amount > 0) {
			upgrades[i].HTMLamount.style.color = "black";
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
	clicksCountText.innerHTML = clicks.toLocaleString("en-EN");
	
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
			let upgrade = upgrades[i].HTMLid;
			upgrade.addEventListener("click", function() {
				buyUpgrade(i);
			});

			upgrades[i].HTMLcost.innerHTML = upgrades[i].cost.toLocaleString("en-EN");;
			upgrades[i].HTMLcps.innerHTML = upgrades[i].cps.toLocaleString("en-EN");;
	}
}

function checkComboCounter() {
	if (comboCounter >= combo.length) {
		clicks += 1000;
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

function frame() {
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
}