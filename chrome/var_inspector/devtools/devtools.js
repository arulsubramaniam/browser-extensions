/*
 * VarInspector
 * 
 * Devtools controller
 *
 */
chrome.devtools.panels.create("VarInspector", "images/icon-32.png", "devtools/panel.html", function(extensionPanel) {
	var _window; // Going to hold the reference to panel.html's `window`

	var data = [];
	var port = chrome.runtime.connect({
		name : 'devtools'
	});
	port.onMessage.addListener(function(msg) {
		// Write information to the panel, if exists.
		// If we don't have a panel reference (yet), queue the data.
		if (_window) {
			_window.write_message(msg);
		} else {
			data.push(msg);
		}
	});

	extensionPanel.onShown.addListener(function tmp(panelWindow) {
		extensionPanel.onShown.removeListener(tmp); // Run once only

		_window = panelWindow;

		// Release queued data
		var msg;
		while (msg = data.shift())
			_window.write_message(msg);

		// Just to show that it's easy to talk to pass a message back:
		_window.respondToDevTools = function(msg) {
			port.postMessage(msg);
		};
	});
	
});
