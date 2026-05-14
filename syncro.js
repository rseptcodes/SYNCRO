// main.js
const appState = {
	timerArray: [],
	timerListeners: [],
	subscribe(callback){
	  this.timerListeners.push(callback);
	},
	unsubscribe(callback) {
  this.timerListeners = this.timerListeners.filter(
    listener => listener !== callback
  );
},
	update(){
		this.timerListeners.forEach((listenerCallback) => {
			console.log(appState.timerArray);
			listenerCallback(this.timerArray);
		});
	},
};

const themeManager = {
  theme: "white",
  init() {
    this.apply();
  },

  toggle() {
    this.theme = this.theme === "white" ? "dark" : "white";
    this.apply();
  },

  apply() {
    document.body.setAttribute("data-theme", this.theme);
  }
};
const appConfig = {
	frame: document.getElementById("frame"),
	init(){
		header.init();
		timerUI.init();
		masterTick.init(appState.timerArray);
	},
};

const masterTick = {
	start: performance.now(),
	seconds: 0,
	lastSecond: 0,
	init(array){
			masterTick.update(array);
	},
	update(array){
		let agora = performance.now();
		this.seconds = Math.floor((agora - this.start) / 1000);
		if (this.seconds > this.lastSecond){
			this.lastSecond = this.seconds;
			timerManager.updateTimers(array);
		}
		requestAnimationFrame(()=>{
			masterTick.update(array)});
	},
};

// timer.js
const timerManager = {
	setTimer(timerName, type, seconds) {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

    const timerData = {
        name: timerName,
        seconds: seconds || 0,
        id: id,
        type: type || "stopwatch",
        isActive: true,
    };

    appState.timerArray.push(timerData);
    return timerData; 
},
updateTimers(array){
	array.forEach((timerData) => {
		if(timerData.isActive){

			if(timerData.type === "stopwatch"){
				timerData.seconds++;

      } else if (timerData.type === "timer"){

    if(timerData.seconds > 0){
        timerData.seconds--;
    } else {
        timerData.seconds = 0;
        timerData.isActive = false;
    }
}
			timerUI.timerCard.updateCard(timerData);
		}
	});
},
toggleActive(data) {
    data.isActive = !data.isActive;
    timerUI.timerCard.updateCard(data);
},

deleteTimer(array, data) {
    const index = array.findIndex(item => item.id === data.id);
    if (index !== -1) {
        array.splice(index, 1);
    }
    data.domElement?.remove();
    appState.update();
},
}

// ui.js
const header = {
  element: null,
  init() {
    if (this.element) return this.element;
    this.element = helperFunctions.createElement("header", appConfig.frame, "header");

    const title = helperFunctions.createElement("h1", this.element, "headerTitle");
    title.innerText = "SYNCR";

    const buttonsWrap = helperFunctions.createElement("div", this.element, "headerButtons");

    const themeButton = helperFunctions.createButton(buttonsWrap, "headerButtons", "fa-palette");

    themeButton.title = "Theme";

    themeButton.addEventListener("click", () => {
      themeManager.toggle();
    });

    return this.element;
  }
};
const timerUI = {
	createButton: null,
	init(){
		this.buildCreateButton(() => createArea.toggle());
		this.timerCard.init();
		const timerCardUpdate = appState.subscribe(() => {
			timerUI.timerCard.getCardInfo();
			});
	},
	buildCreateButton(callback){
		if(this.createButton !== null) return this.createButton;
		const createButton = helperFunctions.createButton(appConfig.frame, "createButton","fa-pen");
		if (callback){
		createButton.addEventListener("click", () => {
      callback();
		});
		}
		return createButton;
	},
  timerCard: {
  	cardList: null,
  	init(){
  		this.cardList = helperFunctions.createElement("div", appConfig.frame, "cardList");
  	},
  	render(cardData){
  		const iconMapper = {
    timer: "fa-hourglass-half",
    stopwatch: "fa-stopwatch",
    pomodoro: "fa-brain",
};
  		const card = helperFunctions.createElement("div", this.cardList, "timerCard");
  		card.dataset.id = cardData.id;
  		
  		const timerName = helperFunctions.createElement("p", card, "timerName");
  		timerName.innerText = cardData.name;
  		const wrapper = helperFunctions.createElement("div", card, "wrapper");
  		const infoContainer = helperFunctions.createElement("div", wrapper, "infoContainer");
  		const btnContainer = helperFunctions.createElement("div", wrapper, "btnContainer");
  		
      const iconClass = iconMapper[cardData.type] || iconMapper.default;
      const timerIcon = helperFunctions.createButton(infoContainer, "ICTimerIcon", iconClass);

  		const timerDisplay = helperFunctions.createElement("p", infoContainer, "timerDisplay");
     
  		const btnStop = helperFunctions.createButton(btnContainer, "cardButton", "fa-stop");
  		btnStop.dataset.iconTrue = "fa-stop";
  		btnStop.dataset.iconFalse = "fa-play";
  		helperFunctions.refreshButton(btnStop, cardData.isActive);
  		
  		btnStop.addEventListener("click", () => {
      timerManager.toggleActive(cardData);
      helperFunctions.refreshButton(btnStop, cardData.isActive);
});
  		const btnReset = helperFunctions.createButton(btnContainer, "cardButton", "fa-xmark");
  		btnReset.addEventListener("click", () => {
  			helperFunctions.applyTempClass(cardData.domElement, "fade-out-collapse", () => {
  				timerManager.deleteTimer(appState.timerArray, cardData);
  			}
  		)});
  		
  		const progressBar = progressBarManager.create( cardData, card);
  		
  		timerDisplay.innerText = helperFunctions.formatTime(cardData.seconds) || "00:00";
  		cardData.domElement = card;
  		cardData.displayElement = timerDisplay;
  		cardData.btnStopElement = btnStop;
      cardData.progressBarElement = progressBar;
      helperFunctions.applyTempClass(card, "fadeIn");
  	},
  	getCardInfo() {
  appState.timerArray.forEach((timerData) => {
    if (document.querySelector(`[data-id="${timerData.id}"]`)) return;
    this.render(timerData);
  });
},
updateCard(timerData) {
    if(!timerData.displayElement) return;
    
    timerData.displayElement.innerText = helperFunctions.formatTime(timerData.seconds);

    if(timerData.progressBarElement) {
        if(timerData.isActive){
            timerData.progressBarElement.classList.remove("progressBar--paused")
        } else {
            timerData.progressBarElement.classList.add("progressBar--paused")
            if(timerData.seconds === 0){
           timerData.domElement.classList.add("timerCard--finished");
           timerData.progressBarElement.classList.remove("progressBar--paused")
           timerData.progressBarElement.classList.add("progressBar--finished");
            }
        }
    }
},
},
};
const createArea = {
    elements: {
        container: null,
        toggleTypeBtn: null,
        nameInput: null,
        doneButton: null,
        timerSetContainer: null,
        minutesInput: null,
        secondsInput: null,
    },
    
    isHidden: true,
    isTransitioning: false,
    currentMode: "stopwatch",
    toggle() {
    	if(this.isTransitioning) return;
        if (!this.elements.container) this.create();
        this.isHidden = !this.isHidden;
        this.isHidden ? this.hide() : this.show();
    },

    toggleMode() {

        this.currentMode = this.currentMode === "stopwatch" ? "timer" : "stopwatch";
        
        if (this.currentMode === "timer") {
            this.elements.container.classList.add("createArea--timerMode");
        } else {
        	helperFunctions.applyTempClass(this.elements.timerSetContainer, "createArea--timerMode--fadeOut",() => {
        		this.elements.container.classList.remove("createArea--timerMode");
        	})
        }
    },

    create() {
        
        this.elements.container = helperFunctions.createElement("div", document.body, "createArea");
        
        this.elements.toggleTypeBtn = helperFunctions.createElement("div", this.elements.container , "toggleTypeButton");
        this.elements.toggleTypeBtn.innerHTML = `
        <i class="fa-solid fa-stopwatch stopwatch"></i>
        <i class="fa-solid fa-hourglass-half timer"></i> `;
        
        this.elements.nameInput = helperFunctions.createElement("input", this.elements.container, "createAreaInput");
        this.elements.nameInput.placeholder = "Timer name";

        this.elements.timerSetContainer = helperFunctions.createElement("div", this.elements.container, "timerSetContainer");
        
        this.elements.minutesInput = helperFunctions.createElement("input", this.elements.timerSetContainer, "minutesInput");
        this.elements.minutesInput.placeholder = "MM";
        
        this.elements.secondsInput = helperFunctions.createElement("input", this.elements.timerSetContainer, "secondsInput");
        this.elements.secondsInput.placeholder = "SS";

        this.elements.doneButton = helperFunctions.createButton(this.elements.container, "createAreaButton", "fa-check");

        this.elements.toggleTypeBtn.addEventListener("click", () => {
            this.toggleMode();
        });

        this.elements.doneButton.addEventListener("click", () => {
            const rawValue = this.elements.nameInput.value || "Sem nome";
            const timerName = rawValue.substring(0, 20);
            let seconds
            if(this.currentMode === "timer") {
            	seconds = (this.elements.minutesInput.value * 60) + Number(this.elements.secondsInput.value) || 0;
            } 
            if(this.currentMode === "timer" && seconds === 0){
            	helperFunctions.createInfoText("não é possivel existir um temporarizador de 0 segundos.", 3000)
            } else {
            timerManager.setTimer(timerName, this.currentMode, seconds);
            appState.update();
            }
            
            helperFunctions.removeOverlay();
            this.toggle();
        });

        return this.elements.container;
    },

    show() {
    	this.isTransitioning = true;
        this.elements.container.classList.remove("createArea--hidden");
        helperFunctions.applyTempClass(this.elements.container, "fadeIn", () => {
        	this.isTransitioning = false;
        });
        helperFunctions.setOverlay(() => {
        	this.toggle();
        });
    },

    hide() {
    	this.isTransitioning = true;
        helperFunctions.applyTempClass(this.elements.container, "fadeOut", () => {
            this.elements.container.classList.add("createArea--hidden");
            this.elements.nameInput.value = "";
            this.elements.minutesInput.value = "";
            this.elements.secondsInput.value = "";
            this.isTransitioning = false;
        });
       
    }
};



const progressBarManager = {
	create(data, local){
		const progressBar = helperFunctions.createElement("div", local, "progressBar");
		this.setAnimation(progressBar, data);
		return progressBar;
	},
	setAnimation(element, data){
		if(data.type === "stopwatch"){
			element.classList.add("progressBar--stopwatch");
		} else if (data.type === "timer"){
      element.classList.add("progressBar--timer");
      element.style.setProperty("--duration", data.seconds + "s");
		}
	},
};
//helper.js
const helperFunctions = {
delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
},
applyTempClass(element, className, callback){
	if(!element) return;
	const onEnd = () => {
		element.classList.remove(className);
		element.removeEventListener("animationend", onEnd);
		if(callback) callback();
	};
	element.addEventListener("animationend", onEnd);
	element.classList.add(className);
	void element.offsetWidth;
},
setOverlay(callback){
	if(document.querySelector(".overlay")) return;
	const overlay = this.createElement("div", appConfig.frame, "overlay");
	overlay.addEventListener("click", (e) => {
		e.stopPropagation();
		callback?.();
		overlay.remove();
	});
},
removeOverlay(){
	document.querySelector(".overlay")?.remove();
},
// versao resumida do document.createElement
createElement(tipo, local, classe){
	const nome = document.createElement(tipo);
	nome.classList.add(classe);
  local.appendChild(nome);
  return nome;
},
createButton(local, classe, FAName){
	const button = this.createElement("button", local, classe);
	if(FAName) {
		const icon = this.createElement("i", button, FAName);
		icon.classList.add("fa");
	}
	return button;
},
refreshButton(button, condition) {
    const icon = button.querySelector('i');
    if(!icon) return;
    const { iconTrue, iconFalse } = button.dataset;
    
    icon.classList.toggle(iconTrue, condition);
    icon.classList.toggle(iconFalse, !condition);
},
async createInfoText(texto, delayMs){
	const infoDiv = this.createElement("div", appConfig.frame, "infoText");
	infoDiv.innerText = texto;
this.applyTempClass(infoDiv, "fadeIn", async () => {
		if (delayMs) {
			await this.delay(delayMs)
		}
		this.applyTempClass(infoDiv, "fadeOut", () => {
			infoDiv?.remove();
		});
	});
},
formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const h = String(hours).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return `${m}:${s}`;
},

};

appConfig.init();
