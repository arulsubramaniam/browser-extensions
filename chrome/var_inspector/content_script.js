/*
 * Var Inspecter
 * 
 * content script
 *
 */

var options;

chrome.storage.local.get("VarInpector", function(data) {
	options = data.VarInpector;
});

function injectScript(callbackFunc) {
	var code = function(varName) {
		var data;
		if (varName === "") {
			data = {
				"message" : "Variable not defined! Set variable name in options page.",
				"displayType": "html"
			};
		} else if (eval("typeof " + varName.toString()) === "undefined") {
			data = {
				"message" : "Variable '" + varName + "' not found in page scope.",
				"displayType": "html"
			};
		} else {
			data = {
				"message" : eval(varName),
				"displayType": "json"
			};
		}
		var dataString = JSON.stringify(data);
		localStorage.setItem("devtools-data", dataString);

	};
	var script = document.createElement('script');
	script.textContent = '(' + code + ')("' + options.variableName + '")';
	(document.head || document.documentElement).appendChild(script);
	script.parentNode.removeChild(script);
	callbackFunc();
}

function retrieveData() {
	var dataString = localStorage.getItem("devtools-data");
	var dataObject = JSON.parse(dataString);
	sendMessageToDevTools(dataObject);
	localStorage.removeItem("devtools-data");
}

document.addEventListener("DOMContentLoaded", function(event) {
	injectScript(retrieveData);
});

window.addEventListener('unload', function(event) {
	var dataObject = {
		"message" : "Loading data...",
		"displayType": "html"
	};
	sendMessageToDevTools(dataObject);
 });

function sendMessageToDevTools(dataObject) {
	chrome.runtime.sendMessage({
		type : "notify-devtools",
		label : "Result",
		data : dataObject
	});
}
