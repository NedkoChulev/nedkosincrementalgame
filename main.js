var storage = window.localStorage;

var skills = [
	{name: "2x Passive",	HTMLid: $("#skill0")[0], duration: 0, coolDown: 3000},
	{name: "2x Crit DMG",	HTMLid: $("#skill1")[0], duration: 0, coolDown: 5000},
	{name: "Skill 3",		HTMLid: $("#skill2")[0], duration: 0, coolDown: 10000},
	{name: "Skill 4",		HTMLid: $("#skill3")[0], duration: 0, coolDown: 50000},
	{name: "Skill 5",		HTMLid: $("#skill4")[0], duration: 0, coolDown: 60000}
];

var features = [
	{name: "Inventory", 	HTMLbutton: $("#button-feature0")[0], HTMLid: $("#feature0")[0]},
	{name: "Crafting", 		HTMLbutton: $("#button-feature1")[0], HTMLid: $("#feature1")[0]},
	{name: "Achievements",	HTMLbutton: $("#button-feature2")[0], HTMLid: $("#feature2")[0]},
	{name: "Pets", 			HTMLbutton: $("#button-feature3")[0], HTMLid: $("#feature3")[0]},
	{name: "Quests",		HTMLbutton: $("#button-feature4")[0], HTMLid: $("#feature4")[0]},
	{name: "Roulette",		HTMLbutton: $("#button-feature5")[0], HTMLid: $("#feature5")[0]},
	{name: "Events",		HTMLbutton: $("#button-feature6")[0], HTMLid: $("#feature6")[0]},
	{name: "Skill-Tree",	HTMLbutton: $("#button-feature7")[0], HTMLid: $("#feature7")[0]}
];

var menu = [
	{name: "Profile",	HTMLbutton: $("#button-menu0")[0], HTMLid: $("#menu0")[0], HTMLclose: $("#close-profile-menu")[0], HTMLwindow: $("#profile-overlay")[0], HTMLcontent: $("#profile-overlay-content")[0]},
	{name: "Log",		HTMLbutton: $("#button-menu1")[0], HTMLid: $("#menu1")[0], HTMLclose: $("#close-log-menu")[0], HTMLwindow: $("#log-overlay")[0], HTMLcontent: $("#log-overlay-content")[0]},
	{name: "Options",	HTMLbutton: $("#button-menu2")[0], HTMLid: $("#menu2")[0], HTMLclose: $("#close-options-menu")[0], HTMLwindow: $("#options-overlay")[0], HTMLcontent: $("#options-overlay-content")[0]},
	{name: "Save",		HTMLbutton: $("#button-menu3")[0], HTMLid: $("#menu3")[0], HTMLclose: $("#close-save-menu")[0], HTMLwindow: $("#save-overlay")[0], HTMLcontent: $("#save-overlay-content")[0]},
	{name: "Load",		HTMLbutton: $("#button-menu4")[0], HTMLid: $("#menu4")[0], HTMLclose: $("#close-load-menu")[0], HTMLwindow: $("#load-overlay")[0], HTMLcontent: $("#load-overlay-content")[0]}
];

var options = [
	{name: "Number Notations Toggle", HTMLinput: $("#number-notation-toggle")}
];

const leftSkyScraper =			$("#leftSkyScraper")[0];
const rightSkyScraper =			$("#rightSkyScraper")[0];
const comboSequence =			$("#comboSequence")[0];
const comboPointsMessage =		$("#comboPointsMessage")[0];
const breadCountText =			$("#bread-count-text")[0];
const eggsCountText =			$("#eggs-count-text")[0];
const goldCountText =			$("#gold-count-text")[0];
const mainButton =				$("#main-button")[0];
const loadingBarLeft =			$("#loadingBarLeft")[0];
const loadingBarRight =			$("#loadingBarRight")[0];
const alerts =					$("#alerts")[0];
const marquee =					$("#marquee")[0];
const log =						$("#log")[0];
const sellStockButton =			$("#sell-stock-button")[0];
const buyStockButton =			$("#buy-stock-button")[0];
const overlaySellStockButton =	$("#overlay-sell-stock-button")[0];
const overlayBuyStockButton =	$("#overlay-buy-stock-button")[0];
const marketHistoryLog =		$("#market-history")[0];
const marketIndex =				$("#market-index")[0];
const marketIndexOverlay =		$("#market-index-overlay")[0];
const marketOverlayWindow = 	$("#market-history-overlay")[0];
const marketOverlayContent = 	$("#market-history-overlay-content")[0];
const marketOverlayClose =		$("#close-market-history-menu")[0];
const marketTimer =				$("#market-timer")[0];
const chartOverlayContent =		$("#chart-overlay-content")[0];
const chartClose =				$("#close-chart-menu")[0];
const chartZoom =				$("#chart-zoom")[0];
const chartWindow =				$("#chart-overlay")[0];
const zoomedChart =				$("#zoomed-chart")[0];
const zoomedChartMenu =			$("#zoomed-chart-menu")[0];
const chartContainer =			$("#chart-container")[0];
const eggMarketChart =			document.getElementById("eggMarket").getContext('2d');

const marketUpdateTime = 1000;
const baseEggPrice = 100;
const minEggPrice = 20;

//Damage Stats
let critRate = 1;
let critDmgMultiplier = 2;
let clickPower = 1;

//Stats that change throughout the game
let clicks = 0;
let crits = 0;
let bread = 0;
let eggs = 0;
let gold = 0;
let demand = 1;
let multipleCombos = 0;

//Arrow Combo
let combo;
let baseComboReward = 100;
let combinedComboReward = 0;
let comboCounter = 0;
let comboLength = 0;
let comboActiveColor = "#EC6F28";
let comboInactiveColor = "#eee";
let loadingBarWidth = 1;

let comboIntervalSpeed = 50;
let comboInterval = setInterval(drawComboCooldown, comboIntervalSpeed);

let countdown = marketUpdateTime;
let marketUpdate = setInterval(updateMarket, marketUpdateTime);
let marketTimerInterval = setInterval(updateMarketTimer, 1000);



let currentEggPrice = baseEggPrice;

let gameSpeed = 1000;
let gameLoop = setInterval(loop, gameSpeed);
let numbersNotation = true; //True = Scientific; False = Alphabetical

let birds = initiateSkyscraper("bird", leftSkyScraper);
let machines = initiateSkyscraper("machine", rightSkyScraper);


let chart = new Chart(eggMarketChart, {
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
	var a = ["a", "b", "c"];
	a.forEach(entry => console.log(entry));

	initiateEventListeners(); //Keyboard and mouse
	
	//System initiation
	initiateSkyscraperButtons(birds, bread);
	initiateSkyscraperButtons(machines, gold);
	skillsCooldown();
	initiateChartZoom();

	//Visuals initiation
	drawElements();
	animateButton();
	checkPrices(birds, bread);
	checkPrices(machines, gold);

	alertPlayer("Welcome!");
};

function initiateEventListeners() {
	//Keyboard listeners
	// 9(Tab)
	// 27(Esc)
	// 32(Spacebar)
	// 37(Left)
	// 38(Up)
	// 39(Right)
	// 40(Down)
	window.addEventListener('keydown', e => {
		if (e.keyCode === 9) {
			document.body.classList.add('user-is-tabbing');
			window.removeEventListener('keydown', handleFirstTab);
    	}
		
		if (comboSequence.firstChild) {
			switch(e.key){
				case 37:
					if (combo[comboCounter] === 1) {
		      			$("#combo" + i).css({color: comboActiveColor});
			      		comboCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
			      			$("#combo" + i).css({color: comboInactiveColor});
			      		}
				      	comboCounter = 0;
			      	}
					checkComboCounter();
					e.preventDefault();
					break;
				case 39:
					if (combo[comboCounter] === 2) {
		      			$("#combo" + i).css({color: comboActiveColor});
			      		comboCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
			      			$("#combo" + i).css({color: comboInactiveColor});
			      		}
				      	comboCounter = 0;
			      	}
			   		checkComboCounter();
			   		e.preventDefault();
					break;
				case 38:
					if (combo[comboCounter] === 3) {
		      			$("#combo" + i).css({color: comboActiveColor});
			      		comboCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
		      				$("#combo" + i).css({color: comboInactiveColor});
			      		}
				      	comboCounter = 0;
			      	}
			      	checkComboCounter();
			      	e.preventDefault();
					break;
				case 40:
					if (combo[comboCounter] === 4) {
		      			$("#combo" + i).css({color: comboActiveColor});
			      		comboCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
		      				$("#combo" + i).css({color: comboInactiveColor});
			      		}
				    	comboCounter = 0;
			      	}
			      	checkComboCounter();
			      	e.preventDefault();
					break;
			}
		}

		if (e.keyCode === 27) {
			menu.forEach( menuItem => menuItem.HTMLwindow.style.display = "none");
			closeChart();
		}
	}, false);

	mainButton.addEventListener("contextmenu", e => {
		e.preventDefault();
		click();
		animateButton();
		drawElements();
		checkPrices(birds, bread);
		return false;
	}, false);

	mainButton.addEventListener("click", e => {
		click();
		animateButton();
		drawElements();
		checkPrices(birds, bread);
	});

	menu.forEach(menuItem => {
		menuItem.HTMLbutton.addEventListener("click", e => menuItem.HTMLwindow.style.display = "block");
		menuItem.HTMLclose.addEventListener("click", e => menuItem.HTMLwindow.style.display = "none");
		menuItem.HTMLwindow.addEventListener("click", e => menuItem.HTMLwindow.style.display = "none");
		menuItem.HTMLcontent.addEventListener("click", e => e.stopPropagation()); //clicking inside the window does not close it
	});
}

// Game's main loop - passively adds bread from the upgrades
function loop() {
	checkPrices(birds, bread);
	checkPrices(machines, gold);
	drawElements();
}

// Subtracts listed price from click count
// Adds 1 to the current amount of upgrades in the upgrades array
// Updates the upgrade's count text
// Updates the bread count and the CPS of all upgrades
function buyUpgrade(array, currency, index) {
	let n = index;
	array[n].cost = Math.floor(Math.pow(array[n].multiplier, array[n].level) * array[n].baseCost);
	bread -= array[n].cost;

	array[n].level++;
	document.getElementById(array[n].HTMLlevel.id).innerHTML = array[n].level;
	array[n].HTMLcost.innerHTML = array[n].cost + array[n].level;
	drawElements();
	checkPrices(array, currency);
}

// Checks if any of the upgrades and skills are available for purchase
function checkPrices(upgrade, currency) {
	for (let i = upgrade.length - 1; i >= 0; i--) {
		//Check prices for x1
		if (currency >= upgrade[i].cost && currency >= upgrade[i].baseCost) {
			upgrade[i].HTMLid.classList.remove("disabled");
			upgrade[i].HTMLid.classList.add("enabled");
			upgrade[i].HTMLid.disabled = false;
		} else {
			upgrade[i].HTMLid.classList.remove("enabled");
			upgrade[i].HTMLid.classList.add("disabled");
			upgrade[i].HTMLid.disabled = true;
		}

		//Check prices for x10
		if (currency >= upgrade[i].cost && currency >= upgrade[i].baseCost) {
			upgrade[i].buttonx10.classList.remove("disabled");
			upgrade[i].buttonx10.classList.add("enabled");
			upgrade[i].buttonx10.disabled = false;
		} else {
			upgrade[i].buttonx10.classList.remove("enabled");
			upgrade[i].buttonx10.classList.add("disabled");
			upgrade[i].buttonx10.disabled = true;
		}

		//Check prices for x100
		if (currency >= upgrade[i].cost && currency >= upgrade[i].baseCost) {
			upgrade[i].buttonx100.classList.remove("disabled");
			upgrade[i].buttonx100.classList.add("enabled");
			upgrade[i].buttonx100.disabled = false;
		} else {
			upgrade[i].buttonx100.classList.remove("enabled");
			upgrade[i].buttonx100.classList.add("disabled");
			upgrade[i].buttonx100.disabled = true;
		}

		//Check prices for xMAX
		if (currency >= upgrade[i].cost && currency >= upgrade[i].baseCost) {
			upgrade[i].buttonxMAX.classList.remove("disabled");
			upgrade[i].buttonxMAX.classList.add("enabled");
			upgrade[i].buttonxMAX.disabled = false;
		} else {
			upgrade[i].buttonxMAX.classList.remove("enabled");
			upgrade[i].buttonxMAX.classList.add("disabled");
			upgrade[i].buttonxMAX.disabled = true;
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
}

// Updates the upgrades' price texts
function drawElements() {
	breadCountText.innerHTML = numeral(bread).format('0.00a');//bread.toExponential(2);//.toLocaleString("en-EN");
	eggsCountText.innerHTML = numeral(eggs).format('0.00a');
	goldCountText.innerHTML = numeral(gold).format('0.00a');

	// Loops through all upgrade buttons and updates their CPS value
	for (let i = birds.length - 1; i >= 0; i--) {
		document.getElementById(birds[i].HTMLcurrency.id).innerHTML = birds[i].eggs * birds[i].level;
		document.getElementById(birds[i].HTMLlevel.id).innerHTML = birds[i].level;
	}

	for (let i = machines.length - 1; i >= 0; i--) {
		document.getElementById(machines[i].HTMLcurrency.id).innerHTML = machines[i].bread * machines[i].level;
		document.getElementById(machines[i].HTMLlevel.id).innerHTML = machines[i].level;
	}
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
	localStorage.setItem("Bread", bread);
	localStorage.setItem("Eggs", eggs);
	localStorage.setItem("Gold", gold);
	localStorage.setItem("Demand", demand);
	localStorage.setItem("Clicks");
	localStorage.setItem('CritRate', critRate);
	localStorage.setItem('Multiple_Combos', multipleCombos);
	localStorage.setItem("Birds", birds);
	localStorage.setItem("Machines", machines);
}

function loadGame() {
	bread = parseInt(localStorage.getItem('Bread'));
	critRate = parseInt(localStorage.getItem('CritRate'));
	drawElements();
	checkPrices(birds, bread);
	checkPrices(machines, gold);
}

function click() {
	clicks++;
	alertPlayer("click");
	if (Math.random()*100 <= critRate) {
		bread = bread + clickPower * critDmgMultiplier;
	} else {
		bread = bread + clickPower;
	}
}

function initiateSkyscraperButtons(array, currency) {
	for (let i = array.length - 1; i >= 0; i--) {
			array[i].HTMLid.addEventListener("click", function() {
				buyUpgrade(array, currency, i);
			});

			array[i].buttonx10.addEventListener("click", function() {
				for (var j = 0; j < 10; j++) {
					buyUpgrade(array, currency, i);
				}
			});

			array[i].buttonx100.addEventListener("click", function() {
				for (var j = 0; j < 10; j++) {
					buyUpgrade(array, currency, i);
				}
			});

			array[i].buttonxMAX.addEventListener("click", function() {
				for (var j = 0; j < 10; j++) {
					buyUpgrade(array, currency, i);
				}
			});

			array[i].HTMLcost.innerHTML = array[i].baseCost.toLocaleString("en-EN");;
			array[i].HTMLcurrency.innerHTML = array[i].eggs.toLocaleString("en-EN");;
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
	for (let i = 0; i <= combo.length - 1; i++) {
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
	let duration = 0.3;
	let delay = 0.08;
	TweenMax.to(mainButton, duration, {scaleY: 1.6, ease: Expo.easeOut});
	TweenMax.to(mainButton, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
	TweenMax.to(mainButton, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });

	mainButton.addEventListener("mouseover", e => {
		TweenMax.to(mainButton, 0.1, {scaleY: 1.1, ease: Expo.easeOut});
		TweenMax.to(mainButton, 0.1, {scaleX: 1.1, ease: Expo.easeOut});
	});
	mainButton.addEventListener("mouseout", e => {
		TweenMax.to(mainButton, 0.1, {scaleY: 1, ease: Expo.easeOut});
		TweenMax.to(mainButton, 0.1, {scaleX: 1, ease: Expo.easeOut});
	});
}

function comboPointsAnimation(n, m) {
	comboPointsMessage.innerHTML = "+" + n;
	alertPlayer("Combo X" + m);

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

//Options
function resetOptions() {
	options[0].HTMLinput.checked = true;
}

function saveOptions() {
	if (options[0].HTMLinput.checked) {

	}
}

function initiateSkyscraper(identifier, parent) {
	let array = [];
	for (let i = 9; i >= 0; i--) {
		let wrapper = document.createElement("DIV");

		let container = document.createElement("DIV");
		let button = document.createElement("BUTTON");
		
		let divx10 = document.createElement("DIV");
		let divx100 = document.createElement("DIV");
		let divxMAX = document.createElement("DIV");
		let btnx10 = document.createElement("BUTTON");
		let btnx100 = document.createElement("BUTTON");
		let btnxMAX = document.createElement("BUTTON");

		let textContainer = document.createElement("DIV");
		let level = document.createElement("SPAN");
		let currency = document.createElement("SPAN");
		let cost = document.createElement("SPAN");

		wrapper.classList.add("grid-container-birds-buttons");
		container.classList.add("bird");
		textContainer.classList.add("bird-text");
		divx10.classList.add("buy-multiple");
		divx100.classList.add("buy-multiple");
		divxMAX.classList.add("buy-multiple");

		btnx10.id = "bird" + i + "x10";
		btnx10.innerHTML = "x10";
		btnx100.id = "bird" + i + "x100";
		btnx100.innerHTML = "x100";
		btnxMAX.id = "bird" + i + "xMAX";
		btnxMAX.innerHTML = "MAX";
		button.id = "bird" + i;
		level.id = "level-bird" + i;
		currency.id = "eggs-bird" + i;
		cost.id = "cost-bird" + i;

		textContainer.innerHTML = "Upgrade " + i + " [";
		textContainer.appendChild(level);
		textContainer.innerHTML = textContainer.innerHTML + "]<br>" + "(CPS: ";
		textContainer.appendChild(currency);
		textContainer.innerHTML = textContainer.innerHTML + ")<br>" + "Cost: ";
		textContainer.appendChild(cost);

		button.appendChild(textContainer);
		container.appendChild(button);

		divx10.appendChild(btnx10);
		divx100.appendChild(btnx100);
		divxMAX.appendChild(btnxMAX);

		wrapper.appendChild(divx10);
		wrapper.appendChild(container);
		wrapper.appendChild(divx100);
		wrapper.appendChild(divxMAX);

		parent.appendChild(wrapper);

		let elem = {name: "Bird " + i,  
					level: 0,
					multiplier: 1, //To be used in the cost formula
					baseCost: 50, //Base cost of the unit
					cost: 0, //Calculated current cost
					
					eggs: 1, //Eggs generated in one iteration
					productionCycle: 59000, //Time it takes to produce eggs
					productionCost: 0, //Bread it takes to have the bird start producing eggs

					HTMLlevel: level, HTMLcurrency: currency, HTMLcost: cost, HTMLid: button, buttonx10: btnx10, buttonx100: btnx100, buttonxMAX: btnxMAX};
		array.push(elem);
	}

	parent.scrollTop = parent.scrollHeight;
	return array;
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