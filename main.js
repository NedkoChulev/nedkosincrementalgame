var storage = window.localStorage;

var skills = [
	{name: "2x Passive",	HTMLelement: $("#skill0")[0], duration: 0, coolDown: 3000},
	{name: "2x Crit DMG",	HTMLelement: $("#skill1")[0], duration: 0, coolDown: 5000},
	{name: "Skill 3",		HTMLelement: $("#skill2")[0], duration: 0, coolDown: 10000},
	{name: "Skill 4",		HTMLelement: $("#skill3")[0], duration: 0, coolDown: 50000},
	{name: "Skill 5",		HTMLelement: $("#skill4")[0], duration: 0, coolDown: 60000}
];

var featuresNames = ["Inventory", "Crafting", "Achievements", "Pets", "Quests",	"Roulette",	"Events", "Skill-Tree"];
var menuNames = ["Profile", "Log", "Options", "Save", "Load"];
var menuIdentifiers = ["profile", "log", "options", "save", "load"];

var options = [
	{name: "Number Notations Toggle", HTMLinput: $("#number-notation-toggle")[0]}
];


const leftSkyScraper =			$("#leftSkyScraper")[0];
const rightSkyScraper =			$("#rightSkyScraper")[0];
const comboSequence =			$("#combo-sequence")[0];
const comboPointsMessage =		$("#combo-points-message")[0];
const breadCountText =			$("#bread-count-text")[0];
const eggsCountText =			$("#eggs-count-text")[0];
const goldCountText =			$("#gold-count-text")[0];
const mainButton =				$("#main-button")[0];
const loadingBarLeft =			$("#loading-bar-left")[0];
const loadingBarRight =			$("#loading-bar-right")[0];
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
const marketHistoryButton =		$("#market-history-button")[0];
const marketOverlayWindow = 	$("#market-history-overlay")[0];
const marketOverlayContent = 	$("#market-history-overlay-content")[0];
const marketOverlayClose =		$("#close-market-history-menu")[0];
const marketTimer =				$("#market-timer")[0];
const chartOverlayContent =		$("#chart-overlay-content")[0];
const chartClose =				$("#close-chart-menu")[0];
const chartZoom =				$("#chart-zoom-button")[0];
const chartWindow =				$("#chart-overlay")[0];
const zoomedChart =				$("#zoomed-chart")[0];
const zoomedChartMenu =			$("#zoomed-chart-menu")[0];
const chartContainer =			$("#chart-container")[0];
const eggMarketChart =			document.getElementById("eggMarket").getContext('2d');

const gameSpeed = 1000;
const marketUpdateTime = 60000;
const clickPower = 1;
const baseEggPrice = 100;
const minEggPrice = 20;
const baseComboReward = 100;
const comboActiveColor = "#EC6F28";
const comboInactiveColor = "#eee";

const initialBaseCost = 50;

//Stats that will be saved
let clicks = 0;
let crits = 0;
let critRate = 1;
let critDmgMultiplier = 2;
let bread = 0;
let eggs = 0;
let gold = 500;
let demand = 1;
let inflation = 1;
let multipleCombos = 0;
let minComboLength = 5;
let maxComboLength = 10;

//Arrow Combo
let combinedComboReward = 0;
let comboArrowsCounter = 0;
let comboLength = 0;
let loadingBarWidth = 1;
let comboIntervalSpeed = 50;

//Market variables
let countdown = marketUpdateTime;
let currentEggPrice = baseEggPrice;
let marketChangePercentage = 0;
let disasterDecrementMultiplier = 1;

//Settings
let numbersNotation = true; //True = Scientific; False = Alphabetical

//Variable declarations
let features, menus, combo, comboInterval, birds, machines, chart, marketUpdate, marketTimerInterval, gameLoop;

/*----------------------------------------------------------MAIN----------------------------------------------------------------------------------------*/

//Main function that starts the game
window.onload = () => {
	comboInterval = setInterval(drawComboCooldown, comboIntervalSpeed);
	
	//identifier, parent, produceIdentifier
	birds = createSkyscraper("bird", leftSkyScraper, "eggs");
	//arrayItem, level, multiplier, baseCost, cost, produce, productionCycle, productionCost, happiness
	for (let i = 0; i < birds.length; i++) {
		initiateSkyscraper(birds[i], 0, 2, initialBaseCost*(i+1), 0, 1, 59000, 100, 1);
	}

	//identifier, parent, produceIdentifier
	machines = createSkyscraper("machine", rightSkyScraper, "bread");
	//arrayItem, level, multiplier, baseCost, cost, produce, productionCycle, productionCost, happiness
	for (let i = 0; i < machines.length; i++) {
		initiateSkyscraper(machines[i], 0, 1, initialBaseCost*(i+1), 0, 1, 59000, 100, 1);
	}

	initiateChart();
	marketUpdate = setInterval(updateMarket, marketUpdateTime);
	marketTimerInterval = setInterval(updateMarketCountdown, 1000);
	gameLoop = setInterval(loop, gameSpeed);


	initiateFeatures();
	initiateMenus();
	initiateKeyboardListeners();
	initiateButtons();
	
	checkAllPrices();

	drawUpdate();
	alertPlayer("Welcome!");
};

// Game's main loop - passively adds bread from the upgrades
function loop() {
}

/*----------------------------------------------------------INITIATION METHODS----------------------------------------------------------------------------------------*/
//Create the features bar
function initiateFeatures() {
	features = [];
	for (var i = featuresNames.length - 1; i >= 0; i--) {
		let feature = {
			name: featuresNames[i],
			HTMLbutton: $("#button-feature" + i)[0],
			HTMLelement: $("#feature" + i)[0]};
		features.push(feature);
	}
}

//Create the menu bar
function initiateMenus() {
	menus = [];
	for (var i = menuNames.length - 1; i >= 0; i--) {
		let menuItem = {
			name: menuNames[i],
			HTMLbutton: $("#button-menu" + i)[0],
			HTMLelement: $("#menu" + i)[0],
			HTMLclose: $("#close-" + menuIdentifiers[i] + "-menu")[0],
			HTMLwindow: $("#" + menuIdentifiers[i] + "-overlay")[0],
			HTMLcontent: $("#" + menuIdentifiers[i] + "-overlay-content")[0]};
		menus.push(menuItem);
	}
}

//Fills the skyscrapers' data
function initiateSkyscraper(arrayItem, level, multiplier, baseCost, cost, produce, productionCycle, productionCost, happiness) {
	arrayItem.level = level;
	arrayItem.multiplier = multiplier; //To be used in the cost formula
	arrayItem.baseCost = baseCost; //Base cost of the unit
	arrayItem.cost = baseCost; //Calculated current cost
	arrayItem.produce = produce; //Eggs generated in one iteration
	arrayItem.productionCycle = productionCycle; //Time it takes to produce eggs
	arrayItem.productionCost = productionCost; //Bread it takes to have the bird start producing eggs
	arrayItem.happiness = happiness;
}

//Set up Event handlers for keyboard input
function initiateKeyboardListeners() {
	//Keyboard listeners
	// 9(Tab)	27(Esc)		32(Spacebar)	37(Left)	38(Up)	39(Right)	40(Down)
	window.addEventListener('keydown', e => {
		if (e.keyCode === 9) {
			document.body.classList.add('user-is-tabbing');
			window.removeEventListener('keydown', handleFirstTab);
    	}

		if (comboSequence.firstChild) {
			switch(e.keyCode){
				case 37:
					if (combo[comboArrowsCounter] === 1) {
		      			$("#combo" + comboArrowsCounter).css({"color": comboActiveColor});
			      		comboArrowsCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
			      			$("#combo" + i).css({"color": comboInactiveColor});
			      		}
				      	comboArrowsCounter = 0;
			      	}
					validateCombo();
					e.preventDefault();
					break;
				case 39:
					if (combo[comboArrowsCounter] === 2) {
		      			$("#combo" + comboArrowsCounter).css({"color": comboActiveColor});
			      		comboArrowsCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
			      			$("#combo" + i).css({"color": comboInactiveColor});
			      		}
				      	comboArrowsCounter = 0;
			      	}
			   		validateCombo();
			   		e.preventDefault();
					break;
				case 38:
					if (combo[comboArrowsCounter] === 3) {
		      			$("#combo" + comboArrowsCounter).css({"color": comboActiveColor});
			      		comboArrowsCounter++;
			      	} else {
			      		for (let i = 0; i <= combo.length - 1; i++) {
		      				$("#combo" + i).css({"color": comboInactiveColor});
			      		}
				      	comboArrowsCounter = 0;
			      	}
			      	validateCombo();
			      	e.preventDefault();
					break;
				case 40:
					if (combo[comboArrowsCounter] === 4) {
		      			$("#combo" + comboArrowsCounter).css({"color": comboActiveColor});
			      		comboArrowsCounter++;
			      	} else {
			      		for (var i = 0; i <= combo.length - 1; i++) {
		      				$("#combo" + i).css({"color": comboInactiveColor});
			      		}
				    	comboArrowsCounter = 0;
			      	}
			      	validateCombo();
			      	e.preventDefault();
					break;
			}
		}

		if (e.keyCode === 27) {
			menus.forEach( menuItem => menuItem.HTMLwindow.style.display = "none");
			closeChart();
		}
	}, false);
}

//Set up Event handlers for all buttons in the game
function initiateButtons() {
	mainButton.addEventListener("mouseover", e => {
		TweenMax.to(mainButton, 0.1, {scaleY: 1.1, ease: Expo.easeOut});
		TweenMax.to(mainButton, 0.1, {scaleX: 1.1, ease: Expo.easeOut});
	});
	mainButton.addEventListener("mouseout", e => {
		TweenMax.to(mainButton, 0.1, {scaleY: 1, ease: Expo.easeOut});
		TweenMax.to(mainButton, 0.1, {scaleX: 1, ease: Expo.easeOut});
	});

	mainButton.addEventListener("contextmenu", e => {
		e.preventDefault();
		animateMainButton();
		click();
		return false;
	}, false);

	mainButton.addEventListener("click", e => {
		animateMainButton();
		click();
	});

	menus.forEach(menuItem => {
		menuItem.HTMLbutton.addEventListener("click", e => {
			menuItem.HTMLwindow.style.display = "block";
			document.getElementsByClassName("log-overlay-middle grid-item")[0].scrollTop = document.getElementsByClassName("log-overlay-middle grid-item")[0].scrollHeight;
		});
		menuItem.HTMLclose.addEventListener("click", e => menuItem.HTMLwindow.style.display = "none");
		menuItem.HTMLwindow.addEventListener("click", e => menuItem.HTMLwindow.style.display = "none");
		menuItem.HTMLcontent.addEventListener("click", e => e.stopPropagation()); //clicking inside the window does not close it
	});

	for (let i = skills.length - 1; i >= 0; i--) {
		skills[i].HTMLelement.addEventListener("click", e => {
			skillsCooldownAnimation(i);
		});
	}

	birds.forEach( bird => {
		bird.HTMLelement.addEventListener("click", e => buyUpgrade(birds, bird));
	});
	
	machines.forEach( machine => {
		machine.HTMLelement.addEventListener("click", e => buyUpgrade(machines, machine));
	});

	chartZoom.addEventListener("click", e => {
		chartWindow.style.display = "block";
	});

	chartWindow.addEventListener("click", e => {
		chartWindow.style.display = "none";
	});

	chartClose.addEventListener("click", e => {
		marketOverlayWindow.style.display = "none";
		chartWindow.style.display = "none";
	});

	//Market Overlay Events
	chartOverlayContent.addEventListener("click", e => e.stopPropagation());
	marketOverlayClose.addEventListener("click", e => marketOverlayWindow.style.display = "none");
	marketOverlayWindow.addEventListener("click", e => marketOverlayWindow.style.display = "none");
	marketOverlayContent.addEventListener("click", e => {
		e.stopPropagation();
		overlayBuyStockButton.startPropagation();
		overlaySellStockButton.startPropagation();
	});

	marketHistoryButton.addEventListener("click", e => marketOverlayWindow.style.display = "block");

	buyStockButton.addEventListener("click", e => buyEggStock());
	overlayBuyStockButton.addEventListener("click", e => buyEggStock());
	sellStockButton.addEventListener("click", e => sellEggStock());
	overlaySellStockButton.addEventListener("click", e => sellEggStock());
}

//Fill the Egg Market Chart with data
function initiateChart() {
	chart = new Chart(eggMarketChart, {
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
	    	},

			scales: {
				yAxes: [{
					display: true,
					ticks: {
						callback: function(label, index, labels) {
							return numeral(label).format('0.00a');
						}
					}
				}]
			}
	    }



	});
}

/*----------------------------------------------------------VISUAL UPDATES----------------------------------------------------------------------------------------*/
//Sends a short pop up notification
//Adds an entry to the log menu
//Updates the text in the marquee area
function alertPlayer(message) {
	const date = new Date();
	const timestamp = "[" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "]";

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

//Creates the buttons for bird and machines and declares the values in the array
function createSkyscraper(identifier, parent, produceIdentifier) {
	let array = [];
	for (let i = 9; i > 0; i--) {

		let container = document.createElement("DIV");
		let button = document.createElement("BUTTON");
		
		let textContainer = document.createElement("DIV");
		let level = document.createElement("SPAN");
		let produce = document.createElement("SPAN");
		let cost = document.createElement("SPAN");

		container.classList.add(identifier);
		textContainer.classList.add(identifier + "-text");

		button.id = identifier + i;
		level.id = "level-" + identifier + i;
		produce.id = "eggs-" + identifier + i;
		cost.id = "cost-" + identifier + i;

		textContainer.innerHTML = identifier + " " + i + " [";
		textContainer.appendChild(level);
		textContainer.innerHTML = textContainer.innerHTML + "]<br>" + "(" + produceIdentifier + " production: ";
		textContainer.appendChild(produce);
		textContainer.innerHTML = textContainer.innerHTML + ")<br>" + "Cost: ";
		textContainer.appendChild(cost);
		textContainer.innerHTML = textContainer.innerHTML + " Gold";

		button.appendChild(textContainer);
		container.appendChild(button);

		parent.appendChild(container);

		let elem = {name: "",  
					level: 0,
					multiplier: 0, //To be used in the cost formula
					baseCost: 0, //Base cost of the unit
					cost: 0, //Calculated current cost
					produce: 0, //Eggs generated in one iteration
					productionCycle: 0, //Time it takes to produce eggs
					productionCost: 0, //Bread it takes to have the bird start producing eggs
					happiness: 0, //Random multiplier for each group of upgrades

					HTMLlevel: level, HTMLproduce: produce, HTMLcost: cost, HTMLelement: button};
		array.unshift(elem);
	}
	parent.scrollTop = parent.scrollHeight;
	return array;
}

//Makes the bread wobble
function animateMainButton() {
	let duration = 0.3;
	let delay = 0.08;
	TweenMax.to(mainButton, duration, {scaleY: 1.6, ease: Expo.easeOut});
	TweenMax.to(mainButton, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
	TweenMax.to(mainButton, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
}

//Creates the cooldown animation for each skill button
function skillsCooldownAnimation(index) {
	let c = skills[index].coolDown/1000;
	skills[index].HTMLelement.innerHTML = c + "s";
	skills[index].HTMLelement.style.fontSize = "2vw";
	skills[index].HTMLelement.style.color = "#EC6F28";

	let int = setInterval(() => {
		c--;
		skills[index].HTMLelement.innerHTML = c + "s";
		if (c === 0) {
			clearInterval(int);
		}
	}, 999);

	skills[index].HTMLelement.disabled = true;
	setTimeout(() => {
		skills[index].HTMLelement.disabled = false;
		skills[index].HTMLelement.innerHTML = skills[index].name;
		skills[index].HTMLelement.style.fontSize = "18px";
		skills[index].HTMLelement.style.color = "#eee";
	}, skills[index].coolDown);
}

//Removes any existing combo
//Generates a random combo between minComboLength and maxComboLength moves long
function comboGenerator() {
	comboArrowsCounter = 0;
	multipleCombos = comboSequence.firstChild ? 0 : multipleCombos;
	while (comboSequence.firstChild) {comboSequence.removeChild(comboSequence.firstChild);}

	combo = new Array(randomNumberGenerator(minComboLength, maxComboLength));
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

//Controls the values of the combo bar animation
function drawComboCooldown() {
    if (loadingBarWidth >= 52) {
    	comboGenerator();
        loadingBarWidth = 1;
		loadingBarLeft.style.width = 0;
		loadingBarRight.style.width = 0;
    } else {
        loadingBarWidth += 0.5; 
        loadingBarLeft.style.width = loadingBarWidth + '%'; 
        loadingBarRight.style.width = loadingBarWidth + '%'; 
    }
}

//Creates a short pop up if the player completes an arrow combo
function comboPointsAnimation(n, m) {
	alertPlayer("Combo X" + m);

	comboPointsMessage.innerHTML = "+" + n;
	comboPointsMessage.classList.toggle("show");
	setTimeout(function() {
		comboPointsMessage.classList.toggle("hide");
		setTimeout(function() {
			comboPointsMessage.classList.toggle("hide");
			comboPointsMessage.classList.toggle("show");
		},1000);
	}, 200);
}

//Updates the Bread text in the Currencies panel
/*bread.toExponential(2);//.toLocaleString("en-EN");*/
function drawBread() {breadCountText.innerHTML = numeral(bread).format('0.00a');}

//Updates the Eggs text in the Currencies panel
function drawEggs() {eggsCountText.innerHTML = numeral(eggs).format('0.00a');}

//Updates the Gold text in the Currencies panel
function drawGold() {goldCountText.innerHTML = numeral(gold).format('0.00a');}

//Updates the text in the Birds/Machines buttons
function drawSkyScraper(array) {
	for (let element of array) {
		drawSkyScraperItem(element);
	}
}

//Updates the text in a Birds/Machines button
function drawSkyScraperItem(arrayItem) {
	$("#" + arrayItem.HTMLproduce.id).html((arrayItem.produce).toLocaleString("en-EN"));
	$("#" + arrayItem.HTMLlevel.id).html(arrayItem.level);
	$("#" + arrayItem.HTMLcost.id).html(arrayItem.cost.toLocaleString("en-EN"));
}

//Draws all currencies, birds buttons and machines buttons
function drawUpdate() {
	drawBread();
	drawEggs();
	drawGold();
	drawSkyScraper(birds);
	drawSkyScraper(machines);
}

//Updates the Chart with the changed value
function updateMarket() {
	marketCalculations();
	//Declaration
	let marketDirection;
	const marketDate = new Date();
	const marketTimestamp = ("0" + marketDate.getHours()).slice(-2) + ":" + ("0" + marketDate.getMinutes()).slice(-2);

   	if (marketChangePercentage > 0) {
   		marketDirection = " &uarr; ";
		marketIndex.style.color = "#599643";
		marketIndexOverlay.style.color = "#599643";
		archiveMarket("EGM " + numeral(currentEggPrice).format('0.00a') + "&#8370; (" + marketDirection + (marketChangePercentage*100).toFixed(2) + "%)", 1);
   	}
   	if (marketChangePercentage < 0) {
   		marketDirection = " &darr; ";
   		marketIndex.style.color = "#db3a2b";
		marketIndexOverlay.style.color = "#db3a2b";
		archiveMarket("EGM " + numeral(currentEggPrice).format('0.00a') + "&#8370; (" + marketDirection + (marketChangePercentage*100).toFixed(2) + "%)", -1);
   	}
   	if (marketChangePercentage === 0) {
   		marketDirection = " &rarr; ";
   		marketIndex.style.color = "#aaa";
		marketIndexOverlay.style.color = "#aaa";
		archiveMarket("EGM " + numeral(currentEggPrice).format('0.00a') + "&#8370; (" + marketDirection + (marketChangePercentage*100).toFixed(2) + "%)", 0);	
   	}

	marketIndex.innerHTML = marketDirection + (marketChangePercentage*100).toFixed(2) + "%</br>" + numeral(currentEggPrice).format('0.00a') + " &#8370;";
	marketIndexOverlay.innerHTML = marketDirection + (marketChangePercentage*100).toFixed(2) + "%</br>" + numeral(currentEggPrice).format('0.00a') + " &#8370;";


    chart.data.datasets[0].data[25] = currentEggPrice;
    chart.data.datasets[0].data.shift();
	chart.data.labels.push(marketTimestamp);
    chart.data.labels.shift();
    chart.update();
}

//Creates an entry in the history with the change of the index and a timestamp
function archiveMarket(message, direction) {
	const date = new Date();
	const timestamp = "[" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "]";

	const ts = document.createElement("SPAN");
	const entry = document.createElement("SPAN");
	const entryContainer = document.createElement("P");

	entry.style.color = direction === 1 ? "#599643" : direction === 0 ? "#aaa" : "#db3a2b";

	ts.innerHTML = timestamp + ": ";
	ts.classList.add("timestamp");
	entry.innerHTML = message;
	entryContainer.appendChild(ts);
	entryContainer.appendChild(entry);

	marketHistoryLog.appendChild(document.createElement("HR"));
	marketHistoryLog.appendChild(entryContainer);

	marketHistoryLog.parentElement.scrollTop = marketHistoryLog.parentElement.scrollHeight;
	
	if (marketHistoryLog.childElementCount >= 200) {
		marketHistoryLog.removeChild(marketHistoryLog.childNodes[0]);
		marketHistoryLog.removeChild(marketHistoryLog.childNodes[0]);
	}
}

//Creates a countdown for when the market index will update
function updateMarketCountdown() {
	let minutes, seconds;
	countdown-=1000;
	seconds = Math.floor(countdown / 1000);
	minutes = Math.floor(seconds / 60);
	marketTimer.innerHTML = ("0" + minutes).slice(-2) + ":" + ("0" + (seconds % 60)).slice(-2);
	countdown = countdown <= 0 ? marketUpdateTime : countdown;
}

/*----------------------------------------------------------GAME LOGIC----------------------------------------------------------------------------------------*/

//Makes bread, increases click count and crit count
function click() {
	let didItCrit = Math.random()*100 <= critRate ? true : false;

	clicks++;
	crits = didItCrit ? crits++ : crits;

	addBread(didItCrit ? clickPower * critDmgMultiplier : clickPower);

	alertPlayer("Peck!");
}

//Generates a random number between min and max
function randomNumberGenerator(min, max) {return Math.floor(Math.random() * (max - min + 1) ) + min;}

//Confirms if an arrow combo has been complete and gives bread if it has
function validateCombo() {
	if (comboArrowsCounter >= combo.length) {
		multipleCombos++;
		combinedComboReward = baseComboReward * comboLength * multipleCombos;
		addBread(combinedComboReward)

		comboPointsAnimation(combinedComboReward, multipleCombos);
		while (comboSequence.firstChild) {comboSequence.removeChild(comboSequence.firstChild);}
		comboArrowsCounter = 0;
	}
}

//Adds more bread
function addBread(amount) {
	bread += amount;
	drawBread();
}

//Subtracts from the bread
function subtractBread(amount) {
	bread -= amount;
	drawBread();
}

//Adds more eggs
function addEggs(amount) {
	eggs += amount;
	drawEggs();
}

//Subtracts from the eggs
function subtractEggs(amount) {
	eggs -= amount;
	drawEggs();
}

//Adds more gold
function addGold(amount) {
	gold += amount;
	drawGold();
}

//Subtracts from the gold
function subtractGold(amount) {
	gold -= amount;
	drawGold();
}

//Checks if you can buy the next level all upgrades
function checkUpgradesPrices(array) {
	for (let element of array) {
		//Check prices for x1
		if (gold >= element.cost) {
			element.HTMLelement.classList.remove("disabled");
			element.HTMLelement.classList.add("enabled");
			element.HTMLelement.disabled = false;
		} else {
			element.HTMLelement.classList.remove("enabled");
			element.HTMLelement.classList.add("disabled");
			element.HTMLelement.disabled = true;
		}
	}
}

//Checks if you can make any market transaction
function checkMarketPrices() {
	if (gold < currentEggPrice){
		buyStockButton.disabled = true;
		overlayBuyStockButton.disabled = true;
	}

	if (gold >= currentEggPrice){
		buyStockButton.disabled = false;
		overlayBuyStockButton.disabled = false;
	}

	if (eggs <= 0){
		sellStockButton.disabled = true;
		overlaySellStockButton.disabled = true;
	}

	if (eggs > 0){
		sellStockButton.disabled = false;
		overlaySellStockButton.disabled = false;
	}
}

//Checks if you can buy the next level all upgrades
//Checks if you can make any market transaction
function checkAllPrices() {
	checkMarketPrices();
	checkUpgradesPrices(birds);
	checkUpgradesPrices(machines);
}

//Buys the next level of an upgrade
function buyUpgrade(array, arrayItem) {
	subtractGold(arrayItem.cost);
	arrayItem.level++;
	arrayItem.cost = Math.pow(arrayItem.multiplier, arrayItem.level) * arrayItem.baseCost;

	checkAllPrices();
	drawSkyScraperItem(arrayItem);
}

//50% = up 1-8%
//35% = down -1 - -5%
//15% = no change
//Changes the market index depending on the above probabilities
function marketCalculations() {
	let marketChangeProbability = randomNumberGenerator(1, 100);

	if (marketChangeProbability >= 51 && marketChangeProbability <= 100) {marketChangePercentage = Math.random() * 7;}
	else if (marketChangeProbability >= 16 && marketChangeProbability <= 50) {marketChangePercentage = Math.random() * -4 * disasterDecrementMultiplier;}
	else {marketChangePercentage = 0;}
	//Initialisation
   	marketChangePercentage /= 100;
   	currentEggPrice = Math.floor((currentEggPrice + currentEggPrice * marketChangePercentage) * demand * inflation);

   	//Verification
   	currentEggPrice = currentEggPrice <= 20 ? 20 : currentEggPrice;
   	marketChangePercentage = currentEggPrice <= 20 ? 0 : marketChangePercentage;
}

//Spend Gold to buy Eggs
function buyEggStock() {
	demand += 0.001;
	eggs++;
	gold -= currentEggPrice;

	checkAllPrices();
	addEggs();
	addGold();
}

//Spend Eggs to buy Gold
//Reduces the demand
function sellEggStock() {
	demand = demand > 1 ? demand - 0.001 : demand;
	eggs--;
	gold += currentEggPrice;

	checkAllPrices();
	addEggs();
	addGold();
}

/*----------------------------------------------------------SKILLS----------------------------------------------------------------------------------------*/
//Doubles the game speed for 5 seconds
function doubleSpeed() {
	clearInterval(gameLoop);
	gameLoop = setInterval(loop, gameSpeed/2); //Doubles the speed of the game

	setTimeout(() => {
		clearInterval(gameLoop);
		gameLoop = setInterval(loop, gameSpeed);
	}, 5000);
}

//Doubles the crit damage for 5 seconds
function doubleCritDmg() {setTimeout(() => {critDmgMultiplier *= 2;}, 5000);}

/*----------------------------------------------------------MENUS----------------------------------------------------------------------------------------*/
//Saves the game
function saveGame() {
	localStorage.setItem("Bread", bread);
	localStorage.setItem("Eggs", eggs);
	localStorage.setItem("Gold", gold);
	localStorage.setItem("Demand", demand);
	localStorage.setItem("Inflation", inflation);
	localStorage.setItem("Clicks", clicks);
	localStorage.setItem('CritRate', critRate);
	localStorage.setItem('Multiple_Combos', multipleCombos);
	localStorage.setItem("Birds", birds);
	localStorage.setItem("Machines", machines);
}

//Loads the game
function loadGame() {
	bread = parseInt(localStorage.getItem('Bread'));
	critRate = parseInt(localStorage.getItem('CritRate'));
}

//Resets the options menu to its default values
function resetOptions() {
	options[0].HTMLinput.checked = true;
	options[0].HTMLinput.checked = true;
}

//Saves the user selected values in the options menu
function saveOptions() {}

/*----------------------------------------------------------DEVELOPER TOOLS----------------------------------------------------------------------------------------*/

function get1k() {addBread(1000);}

function get10k() {addBread(10000);}

function get100k() {addBread(100000);}

function gridToggle() {
	let gridElements = $(".grid-item");
	let toggleCheck = $("#gridToggle")[0];

	if (toggleCheck.innerHTML == "ON") {
		for (let element of gridElements) {
			element.style.border = "none";
		}
		toggleCheck.innerHTML = "OFF";
		return;
	}

	if (toggleCheck.innerHTML == "OFF") {
		for (let element of gridElements) {
			element.style.border = "1px solid darkmagenta";
		}
		toggleCheck.innerHTML = "ON";
		return;
	}
}