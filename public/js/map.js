/**
 * Created by Owner on 9/22/2014.
 */
var directionsService = new google.maps.DirectionsService();
var pos;
var directionsDisplay;
var map;
var markersArray = [];
var infowindow;
var mystartloc;
var geocoder;
var event_address;
var mc; // marker clusterer
var eventfeed = "http://eventfeed.me",
    localhost = "http://localhost:8080";

// Setup the different icons and shadows
var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';
var mapStyle = [{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#C6E2FF"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#C5E3BF"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#D1D1B8"}]}];

var icons = [
  iconURLPrefix + 'red-dot.png',
  iconURLPrefix + 'green-dot.png',
  iconURLPrefix + 'blue-dot.png',
  iconURLPrefix + 'orange-dot.png',
  iconURLPrefix + 'purple-dot.png',
  iconURLPrefix + 'pink-dot.png',
  iconURLPrefix + 'yellow-dot.png'
]
var icons_length = icons.length;
var shadow = {
  anchor: new google.maps.Point(15,33),
  url: iconURLPrefix + 'msmarker.shadow.png'
};
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var contentString = '<div id="content" class="markerInfo">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h3 id="firstHeading" class="firstHeading">You are here</h3>' +
                '<div id="bodyContent">' +
                '<p><b>What do you want to do today? </b><br>' +
                '<b>Create new event: <button type="button" data-toggle="modal" href="#modalCreate" class="btn btn-default btn-sm">Create new</button><br>' +
                '<b>Find event: <input type="text" class="form-control m-b-10" id="searchtxt2" placeholder="Enter event name" style="color: #333 !important; border: 1px solid #333;background: none;width: 70%;"><br>' +
                '<button type="button" class="btn btn-md" onclick="search();">Search</button>' +
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: contentString
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
            center: mystartloc,
            scrollwheel: false,
            styles: mapStyle
        }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    mc = new MarkerClusterer(map);
}
function getEvents(){
    // Get the events from Json to objects events
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(-29.3456, 151.4346),
        content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

// Search for events by name
function search(){
    var name = $("#searchtxt").val();
    if(name == "") {
      name = $("#searchtxt2").val();
    }

    //searh nearby

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
    console.log("in myevents");
    $.ajax({
        url: localhost + '/feed/myevents',
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

  var marker = new google.maps.Marker({
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
    console.log("in calc route");
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
    var infowindow = new google.maps.InfoWindow({
      maxWidth: 200
    });
    var iconCounter = 0,
        i = 0;
    for (var k in events) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(events[k].location.latitude, events[k].location.longitude),
            map: map,
            icon : icons[iconCounter],
            shadow: shadow,
            title: events[k].name
        });
        markersArray.push(marker);
        var contentString = '<div id="content" class="markerInfo">' +
            '<div id="siteNotice">' + events[k].id +
            '</div>' +
            '<h3 id="firstHeading" class="firstHeading">'+ events[k].name +'</h3>' +
            '<div id="bodyContent">' +
            '<p><b>Details: </b><br>' +
            '<b>Description: ' + events[k].permalink + '<br>' +
            'Time: ' + events[k].time + '<br>' +
            'Date: ' + events[k].date + '</b></p><br>' +
			      '<div><button type="button" data-toggle="modal" href="#modalInfo" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-info-sign"></span></button><br>' +
            '<button type="button" onclick="calcRoute()" class="btn btn-sm btn-default">Direction</button>&nbsp;' +
            '<button type="button" onclick="register()" id="reg" class="btn btn-sm btn-primary">Register</button></div>' +
            '</div>';

        // infowindow = new google.maps.InfoWindow({
        //     content: contentString
        // });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            event_address = marker.getPosition();
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          }
        })(marker, i));
        //google.maps.event.addListener(marker, 'mouseover');

        mc.addMarker(marker);
        iconCounter++;
        i++;
        if(iconCounter >= icons_length){
        	iconCounter = 0;
        }
    }

}
function register() {
  console.log("Registering");
  var eventid = $('#siteNotice').text();
  console.log(eventid);
  $.ajax({
      url: localhost + '/feed/user/event/' + eventid,
      type: 'POST',
      dataType: 'json',
      success: function(data){
        console.log(data);
        console.log("Successful GET.");
        if(data == "sent") {
          console.log("sent");
        } else if(data == "error") {
          console.log("error");
        }
      }
  });
}

$("#address").geocomplete()
  .bind("geocode:result", function(event, result){
    //$.log("Result: " + result.formatted_address);
  })
  .bind("geocode:error", function(event, status){
    $.log("ERROR: " + status);
  })
  .bind("geocode:multiple", function(event, results){
    $.log("Multiple: " + results.length + " results found");
  });

$("#createButton").click(function(e) {

    e.preventDefault();
    var eventName = $("#name").val();
    var eventCat = $("#category").val();
    var eventDate = $("#date").val();
    var eventTime = $("#time").val();
    var eventDesc = $("#description").val();
    var eventAddress = $("#address").val();
    var eventPrivate = $("#private").is(':checked');
    var eventData = {
      "name": eventName,
      "category": eventCat,
      "date": eventDate,
      "time": eventTime,
      "private": eventPrivate,
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
                  $("#modalCreate").modal("hide");
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
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.location.latitude, data.location.longitude),
      map: map,
      animation: google.maps.Animation.DROP,
      title: data.name
  });
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
  google.maps.event.addListener(marker, 'click', function() {
        event_address = marker.getPosition();
        infowindow.open(map,marker);
  });
  google.maps.event.addListener(marker, 'mouseover');
  markersArray.push(marker);
  mc.addMarker(marker);
}

function clearMap() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
  mc.clearMarkers();
}

// Initializes Map
console.log("Creating map");
google.maps.event.addDomListener(window, 'load', initialize);
