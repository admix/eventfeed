/**
 * Created by Owner on 9/22/2014.
 */
var directionsService = new google.maps.DirectionsService();
var pos;
var directionsDisplay;
var map;
var marker;
var markersArray = [];
var infowindow;
var mystartloc;
var geocoder;
var event_address;
var eventfeed = "http://eventfeed.me",
    localhost = "http://localhost:8080";

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Im Here.'
            });
            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
		console.log("no pos");
        mystartloc = new google.maps.LatLng(43.7000,-79.4000);
		map.setCenter(mystartloc);
        handleNoGeolocation(false);
    }
	var mapOptions = {
            zoom: 12,
            center: mystartloc
        }
    directionsDisplay.setMap(map);
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

// Get events by username
function myEvents(){
    //e.preventDefault();
    $.ajax({
        url: localhost + '/feed/eventsby/user',
        type: 'GET',
        dataType: 'json',
        success: function(data){
          console.log(data);
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
      title: data[i].name
      //icon: 'https://cdn1.iconfinder.com/data/icons/BRILLIANT/food/png/32/beer.png'
  });
  markersArray.push(marker);
  google.maps.event.addListener(marker, 'click', clickEvent);
  google.maps.event.addListener(marker, 'mouseover', mouseOverEvent);
  var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">'+ data[i].description +'</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Party details</b>' +
      '</div>' +
	  '<div><input type="button" onclick="calcRoute()" value="Directions"></div>' +
      '</div>';

  infowindow = new google.maps.InfoWindow({
      content: contentString
  });
}
// Directions calculations
function calcRoute() {
    var start = pos;
    var end = event_address;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

// Loading array of the events on a map
function loadEvents(events) {
    var locations = [43.7000, -79.4000, 43.7100, -79.4000, 43.7200, -79.4000]; // for testing
    console.log("loading events on map!");
    clearMap();
    for (var k in events) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(events[k].location.latitude, events[k].location.longitude),
            map: map,
            title: events[k].name
        });
        markersArray.push(marker);
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
			'<div><input type="button" onclick="calcRoute()" value="Directions"></div>' +
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

$("#createButton").click(function(e) {

    e.preventDefault();
    var eventName = $("#name").val();
    var eventCat = $("#category").val();
    var eventDate = $("#date").val();
    var eventTime = $("#time").val();
    var eventDesc = $("#description").val();
    var eventAddress = $("#address").val();
    var eventData = {
      "name": eventName,
      "category": eventCat,
      "date": eventDate,
      "time": eventTime,
      "private": false,
      "permalink": eventName.replace(" ","_"),
      "location": {
        "address": eventAddress,
        "latitude": 0,
        "longitude": 0
      },
      "description": eventDesc
    };

    convertLatLong(eventData);

});

function convertLatLong(eventData) {
  console.log("Converting location");
  var latitude = 0;
  var longitude = 0;
  var event = [];
  geocoder.geocode( { 'address': eventData.location.address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
          map.setCenter(results[0].geometry.location);
          event = [latitude, longitude];
          console.log(event);
          console.log(eventData.location.latitude);
          eventData.location.latitude = event[0];
          eventData.location.longitude = event[1];
          loadOneEventCreate(eventData);

          $.ajax({
              url: localhost + '/feed/event',
              type: 'POST',
              data: eventData,
              success: function(data){
                  $("#dataById").html(data.name);
              }
          });

      } else {
          alert('Geocode was not successful for the following reason: ' + status);
      }
  });
}

function loadOneEventCreate(data) {
  console.log(data);
  console.log("location info lat: " + data.location.latitude);
  console.log("location info long: " + data.location.longitude);
  marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.location.latitude, data.location.longitude),
      map: map,
      title: data.name
  });
  markersArray.push(marker);
  google.maps.event.addListener(marker, 'click', function() {
        event_address = marker.getPosition();
        infowindow.open(map,marker);
  });
  google.maps.event.addListener(marker, 'mouseover', mouseOverEvent);
  var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">'+ data.name +'</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Details: </b><br>' +
      '<b>Description: ' + data.permalink + '<br>' +
      'Time: ' + data.time_start + '<br>' +
      '</b></p><br>' +
      '<div><input type="button" onclick="calcRoute()" value="Directions"></div>' +
      '</div>';

  infowindow = new google.maps.InfoWindow({
      content: contentString
  });
}

function clearMap() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

// Initializes Map
console.log("Creating map");
google.maps.event.addDomListener(window, 'load', initialize);
