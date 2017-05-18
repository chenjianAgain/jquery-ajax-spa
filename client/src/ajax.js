
var actionUrl = 'https://7d9iex0e8j.execute-api.us-east-1.amazonaws.com/dev/todos';

function getTemplateString(todo) { return `
			<li class="list-group-item">
				<div class="edit-item-form">
					<div class="form-group">
						<label for="${todo._id}">Item Text</label>
						<input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
					</div>
					<button class="btn btn-primary update-item-button">Update Item</button>
				</div>
				<span class="lead">
					${todo.text}
				</span>
				<div class="pull-right">
					<button class="btn btn-sm btn-warning edit-button">Edit</button>
					<button class="btn btn-sm btn-danger delete-item-button">Delete</button>
				</div>
				<div class="clearfix"></div>
			</li>
			`}


$(document).ready(function() {

	// Get All List Items

	$.get(actionUrl, function(todos) {
		todos.forEach(function(todo){
			$('#todo-list').append(getTemplateString(todo));
		})
	});

	// Create To Do Item

	$('#create-item-button').on('click', function() {
				var textval = $("#new-item").val(); 
				$("#new-item").val('');
				$.ajax({
					url: actionUrl,
					data:  JSON.stringify({ text: textval }),
					type: 'POST',
					dataType: 'json',
					success:  function(todo) { 
						$('#todo-list').append(getTemplateString(todo));
					}
				});
	});


	// Edit To Do Item

	$('#todo-list').on('click', '.edit-button', function() {
		$(this).parent().siblings('.edit-item-form').toggle();
		$(this).blur();
	});

	$('#todo-list').on('click', '.update-item-button', function() {
		var originalItem = $(this).parent().parent('.list-group-item');
		var idVal = originalItem.find('.form-control').attr('id');
		var newVal = $(this).parent().parent('.list-group-item').find('input').val();
		$.ajax({
			url: actionUrl,
			data: JSON.stringify({_id: idVal, text: newVal}),
			type: 'PUT',
			dataType: 'json',
			success: function(data) {
				originalItem.find('span').html(`${data.text}`);
				originalItem.find('.form-control').val(`${data.text}`);
			}
		});
	});

	// Delete To Do Item

	$('#todo-list').on('click', '.delete-item-button', function() {
		var confirmResponse = confirm('Are you sure?');
		if(confirmResponse) {
			var itemToDelete = $(this).parent().parent('.list-group-item');
			var idVal = itemToDelete.find('.form-control').attr('id');			
			$.ajax({
				url: actionUrl,
				type: 'DELETE',
				dataType: 'json',
				data: JSON.stringify({_id: idVal}),
				success: function(data) {
					itemToDelete.remove();
				} 
			});
		} else {
			$(this).find('button').blur();
		}
	});
	
});