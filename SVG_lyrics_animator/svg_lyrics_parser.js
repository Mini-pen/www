function initPage() {
	loadJSON(function(response) {
		// Parse JSON string into object
		//window.alert("before parse");
		//window.alert("contenu du json :\n" + response);
		console.error("contenu du json :\n" + response);
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
	
	var audioFileName = 'audio/navire_de_sang.wav';
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

function playPauseAnim()
{
	if (!globalExists(animInit))
	{
		var animInit = true;
		var animIsPlaying = false;
		//var audio = new Audio(audioFileName);
		animTest();
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

function playPauseAudio()
{
	if (!globalExists(audioInit))
	{
		var audioInit = true;
		var audioIsPlaying = false;		
		window.alert("Chargement du fichier son : \n" + audioFileName);
		var audio = new Audio(audioFileName);
	}
	
	if (globalExists(audio))
	{
	if (audioIsPlaying) {	
	console.error("Audio -> pause"); 
	audio.pause(); 
	audioIsPlaying = false;
	}
	else{	
	console.error("Audio -> play"); 
	audio.play(); 
	audioIsPlaying = true;
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