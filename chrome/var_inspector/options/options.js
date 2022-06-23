/*
 * VarInspector
 * 
 * Controller for options page
 *
 */
var options, prevOptions = {};

/**
 * Gets the boolean value of input string
 */
function getBoolean(key, obj) {
	if (obj === null || typeof obj === "undefined" || typeof obj.value === "undefined") {
		return false;
	} 
	if (obj.value === "true") {
		return true;
	} else if (obj.value === "false") {
		return false;
	} else {
		return obj.value;
	}
}

/**
 * Saves the options to local storage
 */
function saveOptions(event) {
	if (!!event) {
		event.preventDefault();
	}

	// update our options object with new values
	var options = prevOptions.options;
	for ( var key in options) {
		if (options.hasOwnProperty(key)) {
			var elem = document.querySelector("input[name='" + key + "']");
			if (!!elem) {
				if (elem.type === "text") {
					options[key] = elem.value;
				} else if (elem.type === "radio") {
					var active = document.querySelector("input[type='radio'][name='" + key + "']:checked");
					options[key] = getBoolean(key, active);
					toggleOptions();
				} else if (elem.type === "checkbox") {
					var active = document.querySelector("input[type='checkbox'][name='" + key + "']");
					options[key] = active.checked;
				} else {
					console.error("Unknown options element type ", elem.type, " for option ", key);
				}
			}
		}
	}

	// save the new values into local storage
	try {
		chrome.storage.local.set({
			"VarInpector" : options
		}, function() {
			if (!!chrome.runtime.lastError) {
				console.error("Error setting options: ", chrome.runtime.lastError);
			}
		});
	} catch (ex) {
		console.error("Error saving options: ", ex.message);
	}

	// update options for the panel
	chrome.extension.sendMessage({
		type : "update-options",
		data : options,
		label : "options"
	});
}

/**
 * Enable and Disable toggle options
 */
function toggleOptions() {
	document.querySelector("#expandAllJson").disabled  = !document.querySelector("#formatJson").checked;
}

/**
 * Binds the events for the inputs
 */
function bindEvents() {
	var buttons = document.querySelectorAll("input[type='radio'],input[type='checkbox']");
	for ( var btn in buttons) {
		if (buttons.hasOwnProperty(btn) && buttons[btn] instanceof HTMLInputElement) {
			buttons[btn].addEventListener("input", saveOptions);
			buttons[btn].addEventListener("change", saveOptions);
		}
	}

	var inputs = document.querySelectorAll("input[type='text']");
	for ( var inp in inputs) {
		if (inputs.hasOwnProperty(inp) && inputs[inp] instanceof HTMLInputElement) {
			inputs[inp].addEventListener("input", saveOptions);
		}
	}
}

/**
 * Sets the radio button value
 */
function setRadioButton(key, options) {
	var elem = document.querySelector("input[type='radio'][name='" + key + "'][value='" + options[key] + "']");
	if (!!elem) {
		elem.checked = true;
	}
}

/**
 * Sets the checkbox value
 */
function setCheckbox(key, options) {
	var elem = document.querySelector("input[type='checkbox'][name='" + key + "']");
	if (!!elem) {
		if (options[key]) {
			elem.checked = true;
		}
		if (options.format == "raw") {
			elem.disabled = true;
		} 
	}
}

/**
 * Restore state of options elements from preferences
 */
function restoreOptions(options_) {
	var options = prevOptions.options = options_.VarInpector;

	for ( var key in options) {
		if (options.hasOwnProperty(key)) {
			var elem = document.querySelector("input[name='" + key + "']");
			if (!!elem) {
				if (elem.type === "text") {
					elem.value = options[key];
				} else if (elem.type === "radio") {
					setRadioButton(key, options);
				} else if (elem.type === "checkbox") {
					setCheckbox(key, options);
				} else {
					console.error("Unknown options element type ", elem.type, " for option ", key);
				}
			}
		}
	}
}

/**
 * clears the local storage
 */
function clear(options) {
	chrome.storage.local.clear(function() {
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
		}
	});
}

// load options and update the HTML
document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get("VarInpector", restoreOptions);
	bindEvents();
});
