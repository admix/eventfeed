$(document).ready(function(){
  console.log("utils loaded");
  var eventfeed = "http://eventfeed.me",
      localhost = "http://localhost:8080";

  $("#cat li a").click(function(){
      $("#cat .btn:first-child").text($(this).text());
      $("#cat .btn:first-child").val($(this).text());
   });
   $('[data-slidepanel]').slidepanel({
       orientation: 'right',
       mode: 'overlay'
   });

  // create a button inside the info window with this id: #register
  // (when the button will be clicked it will go in this functions)
  $("#register").click(function(e) {
    e.preventDefault();
    var eventId = 19;  // change to real event id

    $.ajax({
      url: localhost + '/feed/user/event/' + eventId,
      type: 'POST',
      dataType: 'json',
      success: function(data) {
        console.log(data); // 1 will be returned if success
      }
    })
  })

});
