$(document).ready(function(){
  $("#cat li a").click(function(){
      $("#cat .btn:first-child").text($(this).text());
      $("#cat .btn:first-child").val($(this).text());
   });
});
