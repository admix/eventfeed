/**
 * Created by Owner on 9/22/2014.
 */
var map;
var marker;
var infowindow;
var mystartloc;
var geocoder;

function initialize() {
    geocoder = new google.maps.Geocoder();
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Location found using HTML5.'
            });

            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
    var mapOptions = {
        zoom: 12,
        center: mystartloc
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
function GetEvents(){
    // Get the events from Json to objects events
}
function CreateEvent(){

    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            map.setCenter(results[0].geometry.location);
            var event = [latitude, longitude];
            LoadEvents(event);
            /*var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });*/
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function Search(){
    var search = document.getElementById("Searchtxt").value;
    var tag = document.getElementById("tag").value;
    alert("Your searched for " + search + " under " + tag + " tag");
}
function LoadEvents(events) {
    for (var i = 0; i < events.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(events[i], events[i + 1]),
            map: map,
            title: 'Event Name',
            icon: 'https://cdn1.iconfinder.com/data/icons/BRILLIANT/food/png/32/beer.png'
        });
        google.maps.event.addListener(marker, 'click', ClickEvent);
        google.maps.event.addListener(marker, 'mouseover', MouseOverEvent);
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">Event Feed Party</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Party details</b>' +
            '</div>' +
            '</div>';

        infowindow = new google.maps.InfoWindow({
            content: contentString
        });
    }
}
function MouseOverEvent(){
    // user mouse over event
}
function ClickEvent(){
   // map.setCenter(marker.getPosition());
    //infowindow.open(map,marker);
}
google.maps.event.addDomListener(window, 'load', initialize);

