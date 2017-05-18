'use strict';

var actionUrl = 'https://7d9iex0e8j.execute-api.us-east-1.amazonaws.com/dev/todos';

function getTemplateString(todo) {
	return '\n\t\t\t<li class="list-group-item">\n\t\t\t\t<div class="edit-item-form">\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<label for="' + todo._id + '">Item Text</label>\n\t\t\t\t\t\t<input type="text" value="' + todo.text + '" name="todo[text]" class="form-control" id="' + todo._id + '">\n\t\t\t\t\t</div>\n\t\t\t\t\t<button class="btn btn-primary update-item-button">Update Item</button>\n\t\t\t\t</div>\n\t\t\t\t<span class="lead">\n\t\t\t\t\t' + todo.text + '\n\t\t\t\t</span>\n\t\t\t\t<div class="pull-right">\n\t\t\t\t\t<button class="btn btn-sm btn-warning edit-button">Edit</button>\n\t\t\t\t\t<button class="btn btn-sm btn-danger delete-item-button">Delete</button>\n\t\t\t\t</div>\n\t\t\t\t<div class="clearfix"></div>\n\t\t\t</li>\n\t\t\t';
}

$(document).ready(function () {

	// Get All List Items

	$.get(actionUrl, function (todos) {
		todos.forEach(function (todo) {
			$('#todo-list').append(getTemplateString(todo));
		});
	});

	// Create To Do Item

	$('#create-item-button').on('click', function () {
		var textval = $("#new-item").val();
		$("#new-item").val('');
		$.ajax({
			url: actionUrl,
			data: JSON.stringify({ text: textval }),
			type: 'POST',
			dataType: 'json',
			success: function success(todo) {
				$('#todo-list').append(getTemplateString(todo));
			}
		});
	});

	// Edit To Do Item

	$('#todo-list').on('click', '.edit-button', function () {
		$(this).parent().siblings('.edit-item-form').toggle();
		$(this).blur();
	});

	$('#todo-list').on('click', '.update-item-button', function () {
		var originalItem = $(this).parent().parent('.list-group-item');
		var idVal = originalItem.find('.form-control').attr('id');
		var newVal = $(this).parent().parent('.list-group-item').find('input').val();
		$.ajax({
			url: actionUrl,
			data: JSON.stringify({ _id: idVal, text: newVal }),
			type: 'PUT',
			dataType: 'json',
			success: function success(data) {
				originalItem.find('span').html('' + data.text);
				originalItem.find('.form-control').val('' + data.text);
			}
		});
	});

	// Delete To Do Item

	$('#todo-list').on('click', '.delete-item-button', function () {
		var confirmResponse = confirm('Are you sure?');
		if (confirmResponse) {
			var itemToDelete = $(this).parent().parent('.list-group-item');
			var idVal = itemToDelete.find('.form-control').attr('id');
			$.ajax({
				url: actionUrl,
				type: 'DELETE',
				dataType: 'json',
				data: JSON.stringify({ _id: idVal }),
				success: function success(data) {
					itemToDelete.remove();
				}
			});
		} else {
			$(this).find('button').blur();
		}
	});
});