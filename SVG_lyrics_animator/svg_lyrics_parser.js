"use strict";
var audioInit = false;
var audio;

var animInit = false;
var animIsPlaying = false;
var audioFileName;

//global var for direct access to svg elems
var playPauseButtonText;
var playIcon;
var pauseIcon;

var timeText;
var delayText;
var correctionDelayText;
var loadJsonButton;
var playButton;
var subDelayButton;
var addDelayButton;

var positionScroller;
var cursorPositionMarginInBar = 0.75;
var minX_CursorPosition = 10.0; //TODO compute this at init
var maxX_CursorPosition = 130.0; //TODO compute this at init

//var startTimerButton = document.querySelector('.startTimer');
//var pauseTimerButton = document.querySelector('.pauseTimer');
//var timerDisplay = document.querySelector('.timer');
var startTime;
var updatedTime;
var difference;
var audioTimeDelay = 0;
var tInterval;
var savedTime;
var paused = 0;
var running = 0;


function initPage() {
	loadJSON(function(response) {
		// Parse JSON string into object
		//window.alert("before parse");
		//window.alert("contenu du json :\n" + response);
		console.log("contenu du json :\n",response);
		var json_root = null;
		try {
           // null
			json_root = JSON.parse(response);
		} catch (e) {
		console.error("Erreur lors du parse :", e); 
		}
		//window.alert("after parse :\n");
		
		for (var key in json_root.Lyrics) {
			//TODO populate timeEvent table
		}
			//TODO populate 
		    // for (var key in json_root.Effects){			
			// var attrName = key;
			// var attrValue = json_root[key];
			// if( (typeof attrValue) === 'string') {
				// setTextValue(attrName,attrValue);
			// }
			// else {
				// if( (typeof attrValue) === 'number')
				// setNumberValue(attrName,attrValue, 8);
			// }
		// }				
		
		window.alert("Init fini !");
	});
		
	playPauseButtonText = getSvgElem("play-pause-button-text");
	timeText = getSvgElem("timeText");
	delayText = getSvgElem("delayText");
	correctionDelayText = getSvgElem("correctionDelayText");
	playIcon = getSvgElem('playIcon');
	pauseIcon = getSvgElem('pauseIcon');
	
	loadJsonButton = getSvgElem("loadJsonButton");
	playButton = getSvgElem("playButton");
	subDelayButton = getSvgElem("subDelayButton");
	addDelayButton = getSvgElem("addDelayButton");
	
	positionScroller = getSvgElem("positionScroller");
	var scrollBar = getSvgElem("positionScrollBar");
	minX_CursorPosition = positionScroller.getAttributeNS(null, 'x');
	maxX_CursorPosition = scrollBar.getAttributeNS(null,'x') + scrollBar.getBBox() - cursorPositionMarginInBar - positionScroller.getBBox();
	console.log("minX_CursorPosition = ", minX_CursorPosition, "maxX_CursorPosition = ", maxX_CursorPosition);
		
	playPauseButtonText.textContent = "Play";
	pauseIcon.setAttributeNS(null, 'opacity', '0');	
	
	correctionDelayText.textContent = audioTimeDelay;
	
	audioFileName = 'audio/navire_de_sang.wav';	
	console.log("Chargement du fichier son : \n", audioFileName);
	audio = new Audio(audioFileName);
	audioInit = true;
	
	resetTimer();
}

function startTimer(){
  if(!running){
	console.log("Starting Timer");
    startTime = new Date().getTime();
    tInterval = setInterval(getShowTime, 1);
	// change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   
 
    paused = 0;
    running = 1;
  }
}

function pauseTimer(){
  if (!difference){
    // if timer never started, don't allow pause button to do anything
  } else if (!paused) {
    clearInterval(tInterval);
    savedTime = difference;
    paused = 1;
    running = 0;
  } else {
	// if the timer was already paused, when they click pause again, start the timer again
	startTimer();
  }
}
function resetTimer(){
  clearInterval(tInterval);
  savedTime = 0;
  difference = 0;
  paused = 0;
  running = 0;
}

function computePrintableTime(time) {
  var sign = "";
  if (time < 0) { 
  time = - time;  
  sign = "- ";
  }
  // var days = Math.floor(time / (1000 * 60 * 60 * 24));
  var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((time % (1000 * 60)) / 1000);
  var milliseconds = Math.floor(time % (1000));
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
  return sign + hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
}

function computeShortPrintableTime(time) {
  var sign = "  ";
  if (time < 0) { 
  time = - time;  
  sign = "- ";
  }
  var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((time % (1000 * 60)) / 1000);
  var milliseconds = Math.floor(time % (1000));
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
  return sign + minutes + ':' + seconds + ':' + milliseconds;
}

function getShowTime(){
  updatedTime = new Date().getTime() + audioTimeDelay;
  if (savedTime){
    difference = (updatedTime - startTime) + savedTime;
  } else {
    difference =  updatedTime - startTime;
  }
  updateGUI();
 }
 
function updateGUI() {
  if (timeText != null) timeText.textContent = computePrintableTime(difference);
  if (delayText != null) delayText.textContent = computeShortPrintableTime(difference-(audio.currentTime*1000));	
  
  var newX = minX_CursorPosition + (maxX_CursorPosition - minX_CursorPosition) * audio.currentTime/audio.duration;
  if (positionScroller != null) positionScroller.setAttributeNS(null,'x', newX);
}

function showHideGui() {
	toggleVisibilty(playIcon);
	toggleVisibilty(pauseIcon);
	toggleVisibilty(timeText);
	toggleVisibilty(delayText);
	toggleVisibilty(loadJsonButton);
	toggleVisibilty(playButton);
	toggleVisibilty(subDelayButton);
	toggleVisibilty(addDelayButton);
	toggleVisibilty(correctionDelayText);
}

function moveScroller() {
}

function getSvgElem(elemId)
{
	var svgElem = document.getElementById(elemId);
	if(svgElem == null) {
	console.error("Erreur dans le fichier svg. Impossible de trouver l'élément :", elemId);
	}
	else return svgElem;
}

function globalExists(varName) {
  // Calling eval by another name causes evalled code to run in a
  // subscope of the global scope, rather than the local scope.
  const globalEval = eval;
  try {
    globalEval(varName);
    return true;
  } catch (e) {
    return false;
  }
}

function toggleVisibilty(svgElem) {
	var newValue = svgElem.getAttributeNS(null, 'visibility')
	if ('hidden' != newValue) { newValue = 'hidden'; }
	else { newValue = 'visible'; }
	svgElem.setAttributeNS(null, 'visibility', newValue);
}

function toggleOpacity(svgElem) {
	var newValue = svgElem.getAttributeNS(null, 'opacity')
	if ('0' != newValue) { newValue = '0'; }
	else { newValue = '1'; }
	svgElem.setAttributeNS(null, 'opacity', newValue);
}

function animTest()
{
//let el = document.querySelector('playIcon');
let el = document.getElementById('playIcon');

el.animate([
    { background: '#ff004d', offset: 0 },
    { background: '#ff77ab', offset: 0.20 },
    { background: '#00e756', offset: 0.5 },
    { background: '#29adff', offset: 0.80 },
    { background: '#ff77ab', offset: 1 }
], {
    duration: 2000,
    direction: 'alternate',
    iterations: Infinity
});
}

function play()
{
	playPauseAudio();
	playPauseAnim();
}

function playPauseAnim(){
	if (animInit)	{
		var animInit = false;
		var animIsPlaying = false;
		// var audio = new Audio(audioFileName);
		// animTest();
		animInit = true;
	}
	
	if (animIsPlaying) {	
	//audio.pause(); 
	animIsPlaying = false;
	}
	else{	
	//audio.play(); 
	animIsPlaying = true;
	}	
}

function logCurrentTime() {
	if (audioInit)	{		
		console.log("Current stopwatchtime : ", computePrintableTime(difference) );
		console.log("Current audio time : ", computePrintableTime(audio.currentTime*1000));
		console.log("Current Delay : ", computePrintableTime(difference-(audio.currentTime*1000)));
		console.log("Corection Delay : ", audioTimeDelay);
	}
}

function subDelay() {
	audioTimeDelay = audioTimeDelay - 10;
	correctionDelayText.textContent = audioTimeDelay;
}

function addDelay() {
	audioTimeDelay = audioTimeDelay + 10;
	correctionDelayText.textContent = audioTimeDelay;
}

function timerCalibrate() {
	difference = audio.currentTime*1000;
}

function playPauseAudio()
{
	if (audioInit)	{		
		if (audio.paused) {	
			console.log("Audio -> play. Current position is : ", audio.currentTime); 
			audio.play();				
			playPauseButtonText.textContent = "Pause";
			toggleOpacity(playIcon);
			toggleOpacity(pauseIcon);
			startTimer();
		}
		else {	
			console.log("Audio -> pause. Current position is : ", audio.currentTime); 
			audio.pause(); 
			playPauseButtonText.textContent = "Play";	
			toggleOpacity(playIcon);
			toggleOpacity(pauseIcon);
			pauseTimer();
			audioTimeDelay = 0;		
			correctionDelayText.textContent = audioTimeDelay;
		}
	}
}

function getNextFreeTextObject(type,textObject) {
//TODO : add a boolean and a counter for each text object
}

function liberateTextObject(type,textObject) {
//TODO : add a boolean and a counter for each text object
}

function setTextValue(labelName, textValue) {	
	//window.alert("Changing text of svgElem : " + labelName + " to text : " + textValue);
	try {
           var svgElem = document.getElementById(labelName);
		   if (svgElem != null) svgElem.textContent = textValue;
		   //$('#'+labelName).text(textValue);
		} catch (e) {
		console.error("SVG elem pas trouvé :", e);
		}		
}

function setBloodPool(value) {	
	//window.alert("Changing text of svgElem : " + labelName + " to text : " + textValue);
	setNumberValue("point_sang", value, 20);
}

function setWillPool(value) {	
	//window.alert("Changing text of svgElem : " + labelName + " to text : " + textValue);
	setNumberValue("point_volonte", value, 10);
}

function setNumberValue(baseNumberName, value, maxValue) {	
	//window.alert("Changing value of svgElem : " + baseNumberName + " to value : " + value);
	
	for (var i = 0; i < maxValue; i++) {
		var svgElem = null;
		try {
			svgElem = document.getElementById(baseNumberName+i);
			if ( i <= value) {
				if (svgElem != null) svgElem.style.fill = "#000000ff";
			} else {
				if (svgElem != null) svgElem.style.fill = "#ffffffff";
			}	
		} catch (e) {
			console.error("SVG elem pas trouvé :", e);
		}				 
	}		
}

function loadJSON(callback) {
	var jsonFile = "navire_de_sang.json";
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");	
	window.alert("openning " + jsonFile);
	xobj.open('GET', jsonFile, true); // Second element is the path to the file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4) {
			if (xobj.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);
			}
		}
	};
	xobj.send(null);  
}