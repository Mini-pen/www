function initPage() {
	loadJSON(function(response) {
		// Parse JSON string into object
		//window.alert("before parse");
		//window.alert("contenu du json :\n" + response);
		var persoJSON = null;
		try {
           // null
			persoJSON = JSON.parse(response);
		} catch (e) {
		console.error("Erreur lors du parse :", e); 
		}
		//window.alert("after parse :\n");
		
		for (var key in persoJSON){
			var attrName = key;
			var attrValue = persoJSON[key];
			if( (typeof attrValue) === 'string') {
				setTextValue(attrName,attrValue);
			}
			else {
				if( (typeof attrValue) === 'number')
				setNumberValue(attrName,attrValue, 20);
			}
			//special cases
			if ( attrName == "illustration") {
			var svgElemImage = document.getElementById("image_link");
			svgElemImage.setAttribute('xlink:href', attrValue);
			svgElemImage.setAttribute('sodipodi:absref', "./"+attrValue);
			}
		}		
		//persoJSON.nom;
		
		window.alert("Init fini !");
	});
}

function setTextValue(labelName, textValue) {	
	//window.alert("Changing text of svgElem : " + labelName + " to text : " + textValue);
	try {
           var svgElem = document.getElementById(labelName);
		   if ((svgElem != null) && (typeof textValue === 'string') ) svgElem.textContent = textValue;
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

function setHealthLevel(value) {	
	//window.alert("Changing text of svgElem : " + labelName + " to text : " + textValue);
	setNumberValue("niveau_sante", value, 7);
}

function setNumberValue(baseNumberName, value, maxValue) {	
	//window.alert("Changing value of svgElem : " + baseNumberName + " to value : " + value);
	if( ( (typeof value) === 'number') && ( (typeof maxValue) === 'number') ) {
	for (var i = 0; i <= maxValue; i++) {
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
}

function loadJSON(callback) {
	var jsonFile = "dracula.json";
	var xobj = new XMLHttpRequest();	
	xobj.overrideMimeType("application/json");	
	window.alert("openning " + jsonFile);
	try {
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
	} catch (e) {
		console.error("Imposible de charger le fichier : ", e);
		//openFile(dispFile);
	}		
}


// function dispFile(contents) {
  // document.getElementById('contents').innerHTML=contents
// }

// function clickElem(elem) {
	// //Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
	// var eventMouse = document.createEvent("MouseEvents")
	// eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
	// elem.dispatchEvent(eventMouse)
// }

// function openFile(func) {
	// readFile = function(e) {
		// var file = e.target.files[0];
		// if (!file) {
			// return;
		// }
		// var reader = new FileReader();
		// reader.onload = function(e) {
			// var contents = e.target.result;
			// fileInput.func(contents)
			// document.body.removeChild(fileInput)
		// }
		// reader.readAsText(file)
	// }
	// fileInput = document.createElement("input")
	// fileInput.type='file'
	// fileInput.style.display='none'
	// fileInput.onchange=readFile
	// fileInput.func=func
	// document.body.appendChild(fileInput)
	// clickElem(fileInput)
// }