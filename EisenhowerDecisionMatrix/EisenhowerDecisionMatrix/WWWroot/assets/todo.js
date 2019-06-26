const uri = "api/todo";

var data = null;
var todo = null;
var defaults = null;
var codes = null;

// Generic function to make an AJAX call
var fetchData = function (query, dataURL) {
	// Return the $.ajax promise
	return $.ajax({
		data: query,
		dataType: 'json',
		url: dataURL
	});
}

var defaults = {
	todoTask: "todo-task",
	todoHeader: "task-header",
	todoTitle: "task-title",
	todoDescription: "task-description",
	todoCompleted: "todo-completed",
	taskId: "task-",
	formId: "todo-form",
	deleteDiv: "delete-div"
}, quadrants = {
	"0": "#UrgentAndImportant",
	"1": "#NotUrgentAndImportant",
	"2": "#UrgentButNotImportant",
	"3": "#NotUrgentNotImportant"
};

$(document).ready(function () {
	data = data || {};
	todo = todo || {};

	var options = {};
	options = $.extend({}, defaults, options);
	getData();
});

//Get Task
function getData() {

	$.ajax({
		type: "GET",
		url: uri,
		cache: false,
		success: function (data) {
			$("." + defaults.todoTask).remove();
			$.each(data, function (index, params) {
				generateElement(params);
			})
		},
		error:function (xhr, errorType, exception) {
			var errorMessage = exception || xhr.statusText;
			alert("There was an error in getting tasks: " + errorMessage);
		}
	});
}

//Delete Task
function deleteItem(id) {
	$.ajax({
		url: uri + "/" + id,
		type: "DELETE",
		success: function (result) {
			getData();
		},
		error: function (xhr, errorType, exception) {
			var errorMessage = exception || xhr.statusText;
			alert("There was an error in deleting the task " + errorMessage);
		}
	});
}

// Add task
additem = function () {
	var errorMessage = "Title can not be empty";
	//id, title, description, isUrgent, isImportant;

	if ($("#title").val() == "") {
		generateDialog(errorMessage);
		return;
	}

	const item = {
		title: $("#title").val(),//inputs[0].value,
		description: $("#description").val(),//inputs[1].value,
		isUrgent: $("#urgent").is(":checked"),
		isImportant: $("#imp").is(":checked"),
		isComplete: false
	};


	$.ajax({
		type: "POST",
		accepts: "application/json",
		url: uri,
		contentType: "application/json",
		data: JSON.stringify(item),
		error: function (jqXHR, textStatus, errorThrown) {
			alert("Something went wrong!");
		},
		success: function (result) {
			// Refresh data
			getData();

			// Reset Form
			$("#title").val("");
			$("#description").val("");
			$("#urgent").prop("checked", false);
			$("#imp").prop("checked", false);
		},
		error: function (xhr, errorType, exception) {
			var errorMessage = exception || xhr.statusText;
			alert("There was an error in adding the task " + errorMessage);
		}
	});

};

//Update Task
function markCompleted(params) {
	const item = {
		id: params.id,
		title: params.title,
		description: params.description,
		isUrgent: params.isUrgent,
		isImportant: params.isImportant,
		isComplete: true
	};
	$.ajax({
		url: uri + "/" + params.id,
		type: "PUT",
		accepts: "application/json",
		contentType: "application/json",
		data: JSON.stringify(item),
		success: function (result) {
			getData();
		},
		error: function (xhr, errorType, exception) {
			var errorMessage = exception || xhr.statusText;
			alert("There was an error in marking the task completed: " + errorMessage);
		}
	});

}


var generateDialog = function (message) {
	var responseId = "response-dialog",
		title = "Messaage",
		responseDialog = $("#" + responseId),
		buttonOptions;

	if (!responseDialog.length) {
		responseDialog = $("<div />", {
			title: title,
			id: responseId
		}).appendTo($("body"));
	}

	responseDialog.html(message);

	buttonOptions = {
		"Ok": function () {
			responseDialog.dialog("close");
		}
	};

	responseDialog.dialog({
		autoOpen: true,
		width: 400,
		modal: true,
		closeOnEscape: true,
		buttons: buttonOptions
	});
};

var generateElement = function (params) {
	var parent = $(quadrants[params.placement]), wrapper;

	if (!parent) {
		return;
	}

	wrapper = $("<div />", {
		"class": defaults.todoTask,
		"id": defaults.taskId + params.id,
	})
		.append("<Button id=btnDelete_" + params.id + " class=\"buttonDelete\" style=\"float:right;\">Delete</BUTTON> ").on('click', '.buttonDelete', function () {
			deleteItem(params.id);
		})
		.append("<Button id=btnDone_" + params.id + " class=\"buttonDone\" style=\"float:right;\">Done</BUTTON> ").on('click', '.buttonDone', function () {
			markCompleted(params);
		})
		.appendTo(parent);
	if (params.isComplete) {
		wrapper.addClass(defaults.todoCompleted);
		$("#btnDone_" + params.id).prop('disabled', true);
	}
	$("<div />", {
		"class": defaults.todoHeader,
		"text": params.title
	}).appendTo(wrapper);

	$("<div />", {
		"class": defaults.todoDescription,
		"text": params.description
	}).appendTo(wrapper);

}

