$(document).ready(function(){
  console.log("File is inclided");
  function create() {
    alert("hello!");
  }
  var eventfeed = "http://eventfeed.me",
      localhost = "http://localhost:8080";
  $("#createButton").click(function(e) {
      //var id = $("#setId").val();
      console.log("in post click");
      e.preventDefault();
      var eventName = $("#name").val();
      var eventCat = $("#category").val();
      var eventDate = $("#date").val();
      var eventTime = $("#time").val();
      var eventDesc = $("#description").val();
      var eventData = {
        "name": eventName,
        "category": eventCat,
        "date": eventDate,
        "time": eventTime,
        "description": eventDesc
      }
      $.ajax({
          url: localhost + '/feed/event',
          type: 'POST',
          data: eventData,
          success: function(data){
              console.log("new event: " + data.name);
              $("#dataById").html(data.name);
          }
      });
  });
});
