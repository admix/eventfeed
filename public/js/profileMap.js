/**
 * Created by EventFeed team on 9/22/2014.
 */
var numOfEvents;
var defaultEvent = [];
var panorama = [] ;
var showPplAttending = [] ;
var showEventDesc = [];
var eventsUserHost = [];
var mapId = [];
var contentDesc = [];
var directionsService = new google.maps.DirectionsService();
var pos;
var directionsDisplay = new google.maps.DirectionsRenderer();
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
  $("#directions-panel").hide();
  var fenway = [];
  var mapOptions= [];
  var map = [];
  var panoramaOptions;
  var eventMarker = [];

  numOfEvents = eventsUserHost.length;
  for (i = 0; i < eventsUserHost.length; i++) {
    fenway[i] = new google.maps.LatLng(eventsUserHost[i].location.latitude, eventsUserHost[i].location.longitude);
    mapOptions[i] = {
      center: fenway[i],
      zoom: 14,
      streetViewControl: false
	  };
		map[i] = new google.maps.Map(document.getElementById("map-event"+i), mapOptions[i]);

    contentDesc[i] = '<b style="font-size:180%;">'+  eventsUserHost[i].name  +'</b> <br> Event Details: ' + eventsUserHost[i].description + '<br> Date: '+ eventsUserHost[i].date +
                  '<br> Time: ' + eventsUserHost[i].time + '<br> Location: ' + eventsUserHost[i].location.address + '<br>' +
				 '<button type="button" class="btn btn-md" onclick="showPplAttendingEvent('+i+');">Show People Attending</button>';

    document.getElementById("event-desc"+i).innerHTML = contentDesc[i];

		eventMarker[i] = new google.maps.Marker({
		  position: fenway[i],
		  map: map[i],
		  title: 'Event Feed'
		});
		panorama[i] = map[i].getStreetView();
		panorama[i].setPosition(fenway[i]);
		panorama[i].setPov(/** @type {google.maps.StreetViewPov} */({
		  heading: 265,
		   pitch: 0
		}));

		var showMapEvent =document.getElementById("map-event"+i);
		showMapEvent.style.visibility="visible";

		var showEventDesc =document.getElementById("event-desc"+i);
		showEventDesc.style.visibility="visible";

  }

	if(numOfEvents == 0) {

    document.getElementById("event-desc0").innerHTML = '<b> You currently have not created any events <br> '+
    'Go to  the home page and start creating! </b>';

    var showEventDesc =document.getElementById("event-desc0");
    showEventDesc.style.visibility="visible";
	}
}

function toggleStreetView() {

  var toggle = panorama[0].getVisible();
  if (toggle == false) {
   for (i = 0; i < numOfEvents; i++)
    panorama[i].setVisible(true);
  } else {
  for (i = 0; i < numOfEvents; i++)
    panorama[i].setVisible(false);
  }
}
function showPplAttendingEvent(idx) {

  document.getElementById("event-showUsers").innerHTML = '<b style="font-size:200%;"> People Attending: <br> ';

  if(eventsUserHost[idx].users.length > 0) {
	   document.getElementById("event-showUsers").innerHTML = '<b style="font-size:200%;"> People Attending: <br>';
	    for (i = 0; i < eventsUserHost[idx].users.length; i++) {
        document.getElementById("event-showUsers").innerHTML += eventsUserHost[idx].users[i].username + '<br> ';
      }
  }

  showPplAttending = document.getElementById("event-showUsers");
	showPplAttending.style.visibility="visible";
}



function handleNoGeolocation(errorFlag) {
    var contentString = '<div id="content" class="markerInfo">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3 id="firstHeading" class="firstHeading">Start eventing!</h3>' +
        '<div id="bodyContent">' +
        '<p><b>What do you want to do today? </b><br>' +
        '<b>Create new event: <button type="button" data-toggle="modal" href="#modalCreate" class="btn btn-default btn-sm">Create new</button><br>' +
        '<b>Find event: <input type="text" class="form-control m-b-10" id="searchtxt2" placeholder="Enter event name" style="color: #333 !important; border: 1px solid #333;background: none;width: 70%;"><br>' +
        '<button type="button" class="btn btn-md" onclick="search();">Search</button>' +
        '</div>';

    var options = {
        map: map,
        position: new google.maps.LatLng(43.653226, -79.383184),
        content: contentString
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
          infowindow.close();
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
//  for myProfile
function myProfile(){
  numOfEvents=0;
  console.log("in myProfie Loading..");
	var test;
    $.ajax({
        url: '/feed/myevents',
        type: 'GET',
        dataType: 'json',
        success: function(data){
          console.log(data);
          console.log("Successful GET.");
          data.forEach(function(e) {
  		      numOfEvents++;
            eventsUserHost.push(e);
  			    console.log("HUUUH---> "+numOfEvents);
          });
          loadMap();
        }
    });

}

// Directions calculations
function calcRoute() {
    directionsDisplay.setMap(null);
    directionsDisplay.setOptions({ preserveViewport: true });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    $("#directions-panel").show();
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
    var iconCounter = 0,
        i = 0;
    var det = ['bring a friend', 'could be cold', 'check email', 'smile', 'bring your own drink', 'whaaat?', 'have fun', 'nice weather', 'wear jeans and shirt', 'be patient'];
    var h = 0;
    for (var k in events) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(events[k].location.latitude, events[k].location.longitude),
            map: map,
            icon : icons[iconCounter],
            shadow: shadow,
            title: events[k].name
        });
        markersArray.push(marker);
        events[k].name = events[k].name[0].toUpperCase() + events[k].name.substr(1);
        events[k].description = events[k].description[0].toUpperCase() + events[k].description.substr(1);
        if(!det[h]) {
          console.log('in h');
          h = 0;
        }
        console.log(det[h]);
        var contentString = '<div id="content" class="markerInfo panel panel-default">' +
        '<div id="siteNotice">' + events[k].id +
        '</div>' +
        //'<h3 id="firstHeading" class="firstHeading">'+ events[k].name +'</h3>' +
        '<div class="panel-heading"><h2 class="panel-title">'+events[k].name+'</h2></div>' +
        '<div class="panel-body" style="width: 100%">' +
        '<span style="text-decoration: underline;">Details: '+det[h]+'</span> <br>' +
        '<span style="text-decoration: underline;">Description: </span>' + events[k].description + '<br>' +
        '<span style="text-decoration: underline;">Time: </span>19:30 <br>' +// + /*events[k].time*/ + '<br>' +
        '<span style="text-decoration: underline;">Date: </span>' + events[k].date + '<br></div>' +
        '<span style="text-decoration: underline;">Address: </span>' + events[k].location.address + '<br></div>' +
	      '<div class="panel-footer"><button type="button" data-toggle="modal" href="#modalInfo" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-info-sign"></span></button>&nbsp;' +
        '<button type="button" onclick="calcRoute()" class="btn btn-sm btn-default">Direction</button>&nbsp;' +
        '<button type="button" onclick="register()" id="reg" class="btn btn-sm btn-primary">Register</button></div>' +
        '</div>';

        var infowindow = new google.maps.InfoWindow({
          maxWidth: 300
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i, contentString) {
          return function() {
            event_address = marker.getPosition();
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          }
        })(marker, i, contentString));
        map.setZoom(11);
        //google.maps.event.addListener(marker, 'mouseover');
        console.log("here");
        mc.addMarker(marker);
        iconCounter++;
        i++;
        h++;
        if(iconCounter >= icons_length){
        	iconCounter = 0;
        }
    }

}

// Register for event
function register() {
  console.log("Registering");
  var eventid = $('#siteNotice').text();
  console.log(eventid);
  //$("#modalRegister").modal("show");
  $.ajax({
      url: localhost + '/feed/user/event/' + eventid,
      type: 'POST',
      dataType: 'json',
      success: function(data){
        console.log(data);
        console.log("Successful GET.");
        if(data == "sent") {
          console.log("sent");
          $("#modalRegister").modal("show");
        } else if(data == "error") {
          console.log("error");
        }
      },
      error: function(e) {
        $("#modalInfo").modal("hide");
        $("#modalRegister").modal("show");
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

// Create new event
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

// Converting address to lat long
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


          $.ajax({
              url: localhost + '/feed/event',
              type: 'POST',
              data: eventData,
              success: function(data){
                  $("#dataById").html(data.name);
                  console.log(JSON.stringify(data));
                  $("#modalCreate").modal("hide");
                  loadOneEventCreate(data);
              }
          });

      } else {
          alert('Geocode was not successful for the following reason: ' + status);
      }
  });
}

function loadOneEventCreate(data) {
  clearMap();
  var infowindow = new google.maps.InfoWindow({
    maxWidth: 200
  });
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.location.latitude, data.location.longitude),
      map: map,
      animation: google.maps.Animation.DROP,
      title: data.name
  });

  var contentString = '<div id="content" class="markerInfo">' +
      '<div id="siteNotice">' + data.id +
      '</div>' +
      '<h3 id="firstHeading" class="firstHeading">'+ data.name +'</h3>' +
      '<div id="bodyContent">' +
      '<p><b>Details: </b><br>' +
      '<b>Description: ' + data.permalink + '<br>' +
      'Time: ' + data.time + '<br>' +
      'Date: ' + data.date + '</b></p><br>' +
      '<div><button type="button" data-toggle="modal" href="#modalInfo" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-info-sign"></span> more info</button><br><br>' +
      '<button type="button" onclick="calcRoute()" class="btn btn-sm btn-default">Direction</button>&nbsp;' +
      '<button type="button" onclick="register()" id="reg" class="btn btn-sm btn-primary">Register</button></div>' +
      '</div>';

  infowindow = new google.maps.InfoWindow({
      content: contentString
  });
  google.maps.event.addListener(marker, 'click', function() {
        event_address = marker.getPosition();
        infowindow.open(map,marker);
  });
  // google.maps.event.addListener(marker, 'mouseover');
  markersArray.push(marker);
  mc.addMarker(marker);
}

// Clear map
function clearMap() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
  directionsDisplay.setMap(null);
  directionsService = new google.maps.DirectionsService();
  $("#directions-panel").hide();
  map.setZoom(12);
  if(mc) {
    mc.clearMarkers();
  }
}

function loadMap() {
  google.maps.event.addDomListener(window, 'load', initialize);
}
// Initializes Maps With Users Events
myProfile();
