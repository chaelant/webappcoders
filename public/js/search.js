function searchFun(){
var $businesses = $('#businesses');
var inputdata = $("#input").val();
$("#input").val();
$( ".searchlist" ).remove();
$.ajax({
  method : 'POST',
  url : '/search',
  data: JSON.stringify({ input : inputdata }),
	contentType: "application/json; charset=utf-8",
	dataType: "json",
  success : function(data) {
    $.each(data, function(i, business) {
      $businesses.append('<li class="searchlist"> <a href="/detail/'+business._id+'">'+ business.alias +'</a></li>');
    });
  }
}); 
}