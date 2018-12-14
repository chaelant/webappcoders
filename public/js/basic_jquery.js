(function($) {
  // Let's start writing AJAX calls!

  var todoArea = $("#todo-area");
  var reviewArea = $("#review-details");

  function bindEventsToTodoItem(todoItem) {
    todoItem.find(".finishItem").on("click", function(event) {
      event.preventDefault();
      var currentLink = $(this);
      var currentId = currentLink.data("id");
      var name = currentLink.data('myval');
      
      //hide all other businesses
      todoArea.hide();
      reviewArea.show();
      $('#businessid').val(currentId);
      $('#businessname').val(name);
      //reviewArea.find(".businessid input").val(currentId);
      //reviewArea.find(".businessname input").val(name);
    });
  }

  reviewArea.hide();
  todoArea.children().each(function(index, element) {
    bindEventsToTodoItem($(element));
  });
})(window.jQuery);
