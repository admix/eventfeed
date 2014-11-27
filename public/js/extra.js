$(function() {
  console.log('extrajs loaded');
  // $('#friendNotification').hide();
  $(function () {
    console.log('popover loaded');
    $('[data-toggle="popover"]').popover()
  })

});

function confirmFriend(friendId, flag, id) {
  console.log(friendId);
  $.ajax({
    url: '/friend/confirm',
    type: 'POST',
    dataType: 'json',
    data: {'friendToConfirm': friendId, 'flag': flag},
    success: function(data){
      console.log("Successful POST.");
      console.log(data);
      $('#add'+id+'').remove();
    },
    error: function(e) {
      console.log('error');
    }
  });
}

function removeFriend(friendId, id) {
  console.log(friendId);
  $.ajax({
    url: '/friend/remove',
    type: 'POST',
    dataType: 'json',
    data: {'friend': friendId},
    success: function(data){
      console.log("Successful REMOVE.");
      console.log(data);
      $('#rem'+id+'').remove();
    },
    error: function(e) {
      console.log('error');
    }
  });
}
