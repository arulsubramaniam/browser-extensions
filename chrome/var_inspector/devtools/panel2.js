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
	var content = message.data.result;
	if (options.format == "raw") {
		content = {
			result : JSON.stringify(content)
		}
	}
	$('.content-item').jsonpanel({
		data : content
	})
}

/*
 * document.documentElement.onclick = function() { respondToDevTools("message
 * from panel"); };
 */

function clearButtonHandler() {
	$(".panel-content-wrapper").html("");
}

function refreshButtonHandler() {
	clearButtonHandler();
	var bgp = chrome.extension.getBackgroundPage();
	bgp.retrieveDataFromPage();
}

function expandAllButtonHandler() {
	$("li.expandable").not(".expanded").find("a.expander").click();
}

function expandButtonHandler(target) {
	var parent = target.currentTarget.closest(".panel-content-wrapper");
	$("#" + parent.id).find(".content-item.jsonpanel li.expandable").not(".expanded").find("a.expander").click();
}

function collapseAllButtonHandler() {
	$("li.expandable.expanded").find("div[class=panel]").remove();
	$("li.expandable.expanded").removeClass("expanded");
}

function collapseButtonHandler(target) {
	var parent = target.currentTarget.closest(".panel-content-wrapper");
	var elem = $("#" + parent.id).find(".content-item.jsonpanel li.expandable.expanded"); 
	elem.find("div[class=panel]").remove();
	elem.removeClass("expanded");
}

function toggleButtonHandler() {
	$(".expander").click();
}

$('document').ready(function() {
	$('#clear-button').on("click", clearButtonHandler);
	$('#expandall-button').on("click", expandAllButtonHandler);
	$('#collapseall-button').on("click", collapseAllButtonHandler);
	$('.expand-button').on("click", expandButtonHandler);
	$('.collapse-button').on("click", collapseButtonHandler);
	$('#refresh-button').on("click", refreshButtonHandler);
})

$('document').ready(function() {
	display_message({
		"data" : {
			"result" : {
				"page" : {
					"name" : "search"
				},
				"user" : {
					"userId" : "4614"
				},
				"pageLoaded" : true
			}
		}
	});
});