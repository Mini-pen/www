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
}

function playAudio()
{
	var audio = new Audio('audio/navire_de_sang.wav');
	audio.play();
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