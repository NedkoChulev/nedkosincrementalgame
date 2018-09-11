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
const marketHistoryButton =		$("#market-history-button")[0];
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

const gameSpeed = 1000;
const marketUpdateTime = 1000;
const clickPower = 1;
const baseEggPrice = 100;
const minEggPrice = 20;
const baseComboReward = 100;
const comboActiveColor = "#EC6F28";
const comboInactiveColor = "#eee";

//Stats that will be saved
let clicks = 0;
let crits = 0;
let critRate = 1;
let critDmgMultiplier = 2;
let bread = 0;
let eggs = 0;
let gold = 0;
let demand = 1;
let inflation = 0;
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

//Settings
let numbersNotation = true; //True = Scientific; False = Alphabetical

//Variable declarations
let features, menus, combo, comboInterval, birds, machines, chart, marketUpdate, marketTimerInterval, gameLoop;

//Main function that starts the game
window.onload = () => {
	comboInterval = setInterval(drawComboCooldown, comboIntervalSpeed);
	
	birds = initiateSkyscraper("bird", leftSkyScraper);
	machines = initiateSkyscraper("machine", rightSkyScraper);

	marketUpdate = setInterval(updateMarket, marketUpdateTime);
	marketTimerInterval = setInterval(updateMarketCountdown, 1000);
	gameLoop = setInterval(loop, gameSpeed);

	initiateFeatures();
	initiateMenus();
	initiateKeyboardListeners();
	initiateButtons();
	initiateChart();
	
	checkPrices(birds, bread);
	checkPrices(machines, gold);

	drawUpdate();
	alertPlayer("Welcome!");
};

// Game's main loop - passively adds bread from the upgrades
function loop() {
	checkPrices(birds, bread);
	checkPrices(machines, gold);
	drawUpdate();
}

/*----------------------------------------------------------INITIATIONS----------------------------------------------------------------------------------------*/
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

	menus.forEach(menuItem => {
		menuItem.HTMLbutton.addEventListener("click", e => menuItem.HTMLwindow.style.display = "block");
		menuItem.HTMLclose.addEventListener("click", e => menuItem.HTMLwindow.style.display = "none");
		menuItem.HTMLwindow.addEventListener("click", e => menuItem.HTMLwindow.style.display = "none");
		menuItem.HTMLcontent.addEventListener("click", e => e.stopPropagation()); //clicking inside the window does not close it
	});

	for (let i = skills.length - 1; i >= 0; i--) {
		skills[i].HTMLelement.addEventListener("click", e => {
			let c = skills[i].coolDown/1000;
			skills[i].HTMLelement.innerHTML = c + "s";
			skills[i].HTMLelement.style.fontSize = "2vw";
			skills[i].HTMLelement.style.color = "#EC6F28";

			let int = setInterval(() => {
				c--;
				skills[i].HTMLelement.innerHTML = c + "s";
				if (c == 0) {
					clearInterval(int);
				}
			}, 1000);

			skills[i].HTMLelement.disabled = true;
			setTimeout(() => {
    			skills[i].HTMLelement.disabled = false;
				skills[i].HTMLelement.innerHTML = skills[i].name;
				skills[i].HTMLelement.style.fontSize = "18px";
				skills[i].HTMLelement.style.color = "#eee";
			}, skills[i].coolDown);
		});
	}

	birds.forEach( bird => {
		bird.HTMLelement.addEventListener("click", e => buyUpgrade(birds, bird, currency));
		bird.buttonx10.addEventListener("click", e => buyUpgrade(birds, bird, currency));
		bird.buttonx100.addEventListener("click", e => buyUpgrade(birds, bird, currency));
		bird.buttonxMAX.addEventListener("click", e => buyUpgrade(birds, bird, currency));
	});
	
	machines.forEach( machine => {
		machine.HTMLelement.addEventListener("click", e => buyUpgrade(machines, machine, currency));
		machine.buttonx10.addEventListener("click", e => buyUpgrade(machines, machine, currency));
		machine.buttonx100.addEventListener("click", e => buyUpgrade(machines, machine, currency));
		machine.buttonxMAX.addEventListener("click", e => buyUpgrade(machines, machine, currency));
	});

	chartZoom.addEventListener("click", e => {
		chartWindow.style.display = "block";
		zoomedChart.appendChild(document.getElementById("eggMarket"));
	});

	chartWindow.addEventListener("click", e => {
		chartWindow.style.display = "none";
		chartContainer.appendChild(document.getElementById("eggMarket"));
	});

	chartClose.addEventListener("click", e => {
		marketOverlayWindow.style.display = "none";
		chartWindow.style.display = "none";
		chartContainer.appendChild(document.getElementById("eggMarket"));
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

//Updates the text in the Birds buttons
function drawBirds() {
	for (let bird of birds) {
		$("#" + bird.HTMLcurrency.id).html((bird.currency).toLocaleString("en-EN"));
		$("#" + bird.HTMLlevel.id).html(bird.level);
		$("#" + bird.HTMLcost.id).html(bird.baseCost.toLocaleString("en-EN"));
	}
}

//Updates the text in the Machines buttons
function drawMachines() {
	for (let machine of machines) {
		$("#" + machine.HTMLcurrency.id).html((machine.currency).toLocaleString("en-EN"));
		$("#" + machine.HTMLlevel.id).html(machine.level);
		$("#" + machine.HTMLcost.id).html(machine.baseCost.toLocaleString("en-EN"));
	}
}

//Draws all currencies, birds buttons and machines buttons
function drawUpdate() {
	drawBread();
	drawEggs();
	drawGold();
	drawBirds();
	drawMachines();
}

//Changes the Market Index by a random value between 0 and 50
//Updates the Chart with the changed value
function updateMarket() {
	//Declaration
	let marketDirection, marketChange;
	const marketDate = new Date();
	const marketTimestamp = ("0" + marketDate.getHours()).slice(-2) + ":" + ("0" + marketDate.getMinutes()).slice(-2);

   	//Initialisation
   	marketChange = (Math.random() * 49) * (Math.floor(Math.random()*2) === 1 ? 1 : -1)/100;
   	currentEggPrice = Math.floor((currentEggPrice + currentEggPrice * marketChange) * demand);

   	//Verification
   	currentEggPrice = currentEggPrice <= 20 ? 20 : currentEggPrice;
   	marketChange = currentEggPrice <= 20 ? 0 : marketChange;

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
   	if (marketChange === 0) {
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

//Creates an entry in the history with the change of the index and a timestamp
function archiveMarket(message, direction) {
	const date = new Date();
	const timestamp = "[" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "]";

	const ts = document.createElement("SPAN");
	const entry = document.createElement("SPAN");
	const entryContainer = document.createElement("P");

	entry.style.color = direction === 1 ? "#599643" : "#db3a2b";

	ts.innerHTML = timestamp + ": ";
	ts.classList.add("timestamp");
	entry.innerHTML = message;
	entryContainer.appendChild(ts);
	entryContainer.appendChild(entry);

	marketHistoryLog.appendChild(document.createElement("HR"));
	marketHistoryLog.appendChild(entryContainer);
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

	addBread(didItCrit ? bread + clickPower * critDmgMultiplier : bread + clickPower);

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
function addBread(amount) {bread += amount;}

//Adds more eggs
//Increases the demand
function addEggs(amount) {eggs += amount;}

//Adds more gold
function addGold(amount) {gold += amount;}

//TO DO
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

		let elem = {name: "",  
					level: 0,
					multiplier: 0, //To be used in the cost formula
					baseCost: 0, //Base cost of the unit
					cost: 0, //Calculated current cost
					currency: 0, //Eggs generated in one iteration
					productionCycle: 0, //Time it takes to produce eggs
					productionCost: 0, //Bread it takes to have the bird start producing eggs

					HTMLlevel: level, HTMLcurrency: currency, HTMLcost: cost, HTMLelement: button, buttonx10: btnx10, buttonx100: btnx100, buttonxMAX: btnxMAX};
		array.push(elem);
	}

	parent.scrollTop = parent.scrollHeight;
	return array;
}

//TO DO
function checkPrices(upgrade, currency) {
	for (let element of upgrade) {
		//Check prices for x1
		if (currency >= element.cost && currency >= element.baseCost) {
			element.HTMLelement.classList.remove("disabled");
			element.HTMLelement.classList.add("enabled");
			element.HTMLelement.disabled = false;
		} else {
			element.HTMLelement.classList.remove("enabled");
			element.HTMLelement.classList.add("disabled");
			element.HTMLelement.disabled = true;
		}

		//Check prices for x10
		if (currency >= element.cost && currency >= element.baseCost) {
			element.buttonx10.classList.remove("disabled");
			element.buttonx10.classList.add("enabled");
			element.buttonx10.disabled = false;
		} else {
			element.buttonx10.classList.remove("enabled");
			element.buttonx10.classList.add("disabled");
			element.buttonx10.disabled = true;
		}

		//Check prices for x100
		if (currency >= element.cost && currency >= element.baseCost) {
			element.buttonx100.classList.remove("disabled");
			element.buttonx100.classList.add("enabled");
			element.buttonx100.disabled = false;
		} else {
			element.buttonx100.classList.remove("enabled");
			element.buttonx100.classList.add("disabled");
			element.buttonx100.disabled = true;
		}

		//Check prices for xMAX
		if (currency >= element.cost && currency >= element.baseCost) {
			element.buttonxMAX.classList.remove("disabled");
			element.buttonxMAX.classList.add("enabled");
			element.buttonxMAX.disabled = false;
		} else {
			element.buttonxMAX.classList.remove("enabled");
			element.buttonxMAX.classList.add("disabled");
			element.buttonxMAX.disabled = true;
		}
	}

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

//TO DO
function buyUpgrade(array, arrayItem, currency) {
	arrayItem.cost = Math.floor(Math.pow(arrayItem.multiplier, arrayItem.level) * arrayItem.baseCost);
	bread -= arrayItem.cost;
	arrayItem.level++;
	$("#" + arrayItem.HTMLlevel.id)[0].html(arrayItem.level);
	arrayItem.HTMLcost.innerHTML = arrayItem.cost + arrayItem.level;
	drawElements();
	checkPrices(array, currency);
}

//Spend Gold to buy Eggs
function buyEggStock() {
	demand += 0.001;
	eggs++;
	gold -= currentEggPrice;

	checkPrices();
	addEggs();
	addGold();
}

//Spend Eggs to buy Gold
//Reduces the demand
function sellEggStock() {
	demand = demand > 1 ? demand - 0.001 : demand;
	eggs--;
	gold += currentEggPrice;

	checkPrices();
	addEggs();
	addGold();
}

/*----------------------------------------------------------SKILLS----------------------------------------------------------------------------------------*/
//Doubles the game speed for 5 seconds
function doubleSpeed() {
	clearInterval(gameLoop);
	gameSpeed = 500;
	gameLoop = setInterval(loop, gameSpeed);

	setTimeout(() => {
		clearInterval(gameLoop);
		gameSpeed = 1000;
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

function get1k() {
	addBread(1000);
}

function get10k() {
	addBread(10000);
}

function get100k() {
	addBread(100000);
}

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