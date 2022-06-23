/*
 * VarInspector
 * 
 * Background controller
 *
 */
var ports = [];

chrome.runtime.onConnect.addListener(function(port) {
	if (port.name !== "devtools")
		return;
	ports.push(port);
	// Remove port when destroyed (when devtools is closed)
	port.onDisconnect.addListener(function() {
		var i = ports.indexOf(port);
		if (i !== -1)
			ports.splice(i, 1);
	});
	port.onMessage.addListener(messageFromDevtools);
});

// Function to send a message to all devtools views
function notifyDevtools(msg) {
	ports.forEach(function(port) {
		port.postMessage(msg);
	});
}

// Function to receive a message from devtools views
function messageFromDevtools(msg) {
	// Received message from devtools
	// console.log('messageFromDevtools from devtools page', msg);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch (message.type) {
	case "notify-devtools":
		notifyDevtools(message);
		break;
	case "update-options":
		notifyDevtools(message);
		break;
	}
});

/**
 * Store Options (on extension installation)
 */
function initOptions() {
	var options = {
		"format" : "json",
		"variableName" : "",
		"expandall" : false
	};

	chrome.storage.local.set({
		"VarInpector" : options
	}, function() {
		if (!!chrome.runtime.lastError) {
			console.error("Error setting init options: ", chrome.runtime.lastError);
		}
	});
	
}

chrome.runtime.onInstalled.addListener(initOptions);
