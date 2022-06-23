/*
 * VarInspector
 * 
 * Panel controller
 *
 */
var options = {};

chrome.storage.local.get("VarInpector", function(data) {
	options = data.VarInpector;
});

function write_message(message) {
	switch (message.type) {
	case "notify-devtools":
		display_message(message);
		break;
	case "update-options":
		options = message.data;
		break;
	}
}

function display_message(message) {
	clearPanel();
	var displayType = message.data.displayType;
	var content = message.data.message;
	if (displayType == "json") {
		if (typeof content === "object") {
			if (options.format == "raw") {
				$('#raw-content-item').html(JSON.stringify(content));
			} else {
				$('#json-content-item').jsonpanel({
					data : content
				});
				if (options.expandall) {
					expandAll();
				}
			}
		} else {
			$('#raw-content-item').html(content);
		}
		$('#content-label').html(options.variableName);
	} else {
		$('#message-item').html(content);
	}
	
}

/*
 * document.documentElement.onclick = function() { respondToDevTools("message
 * from panel"); };
 */

function clearPanel() {
	$("#content-label").html("");
	$("#json-content-item").html("");
	$("#raw-content-item").html("");
	$("#message-item").html("");
}

function expandAll() {
	var nodes = $("li.expandable").not(".expanded").find("a.expander");
	var count = 0;
	while (nodes.length > 0) {
		nodes.click();
		count += 1;
		// to avoid infinite loop. we would'nt have more than 1000 nested blocks
		if (count > 1000 ) {
			break;
		}
		nodes = $("li.expandable").not(".expanded").find("a.expander");
	}
}

function collapseAll() {
	$("li.expandable.expanded").find("div[class=panel]").remove();
	$("li.expandable.expanded").removeClass("expanded");
}

$('document').ready(function() {
	$('#clear-button').on("click", clearPanel);
	$('#expandall-button').on("click", expandAll);
	$('#collapseall-button').on("click", collapseAll);
	
	display_message({
		"data" : {
			"message" : "Perform a request or hit <b>F5</b> to inspect.",
			"displayType": "html"
		}
	});
});

/*$('document').ready(function() {
	display_message({
		"data" : {
			"message" : {
				"page" : {
					"name" : "search"
				},
				"user" : {
					"userId" : "4614"
				},
				"pageLoaded" : true
			},
			"displayType" : "json"
		}
	});
});*/