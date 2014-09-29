/**
 * Created by Owner on 9/22/2014.
 */
var map;
var marker;
var infowindow;
var mystartloc;
var eventfeed = "http://eventfeed.me",
    localhost = "http://localhost:8080";

function initialize() {
    mystartloc = new google.maps.LatLng(43.7000,-79.4000);
    var mapOptions = {
        zoom: 12,
        center: mystartloc
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
function getEvents(){
    // Get the events from Json to objects events
}

// Search for events by name
function search(){
    var name = $("#searchtxt").val();
    //e.preventDefault();
    $.ajax({
        url: localhost + '/feed/events/name/' + name,
        type: 'GET',
        dataType: 'json',
        success: function(data){
          console.log("Successful GET.");
          var events = [];
          data.forEach(function(e) {
            events.push(e);
          });
          console.log(events);
          loadEvents(data);
        }
    });
}

// Loading only one event on a map
function loadOneEvent(data) {
  var locations = [43.7000, -79.4000];

  marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[0], locations[1]),
      map: map,
      title: data[i].name,
      icon: 'https://cdn1.iconfinder.com/data/icons/BRILLIANT/food/png/32/beer.png'
  });
  google.maps.event.addListener(marker, 'click', clickEvent);
  google.maps.event.addListener(marker, 'mouseover', mouseOverEvent);
  var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">'+ data[i].description +'</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Party details</b>' +
      '</div>' +
      '</div>';

  infowindow = new google.maps.InfoWindow({
      content: contentString
  });
}

// Loading array of the events on a map
function loadEvents(events) {
    var locations = [43.7000, -79.4000, 43.7100, -79.4000, 43.7200, -79.4000]; // for testing
    console.log("loading events on map!");
    for (var k in events) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(events[k].location.latitude, events[k].location.longitude),
            map: map,
            title: events[k].name,
            icon: 'https://cdn1.iconfinder.com/data/icons/BRILLIANT/food/png/32/beer.png'
        });
        google.maps.event.addListener(marker, 'click', clickEvent);
        google.maps.event.addListener(marker, 'mouseover', mouseOverEvent);
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">'+ events[k].name +'</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Details: </b><br>' +
            '<b>Description: ' + events[k].permalink + '<br>' +
            'Start: ' + events[k].time_start + '<br>' +
            'End: ' + events[k].time_end + '</b></p><br>' +
            '</div>';

        infowindow = new google.maps.InfoWindow({
            content: contentString
        });
    }
}

// Window that appears when user hover over the 'Pin'
function mouseOverEvent(){
    // user mouse over event
}

// Window that appears when user click on 'Pin'
function clickEvent(){
    map.setCenter(marker.getPosition());
    infowindow.open(map,marker);
}

// Initializes Map
google.maps.event.addDomListener(window, 'load', initialize);
