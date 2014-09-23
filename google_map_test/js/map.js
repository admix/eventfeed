/**
 * Created by Owner on 9/22/2014.
 */
var map;
var marker;
var infowindow;
var mystartloc;

function initialize() {
    mystartloc = new google.maps.LatLng(43.7000,-79.4000);
    var mapOptions = {
        zoom: 12,
        center: mystartloc
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
function GetEvents(){
    // Get the events from Json to objects events
}
function Search(){
    var search = document.getElementById("Searchtxt").value;
    var tag = document.getElementById("tag").value;
    alert("Your searched for " + search + " under " + tag + " tag");
}
function LoadEvents(events) {
    var locations = [43.7000, -79.4000, 43.7100, -79.4000, 43.7200, -79.4000];
    for (var i = 0; i < locations.length; i += 2) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i], locations[i + 1]),
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
    map.setCenter(marker.getPosition());
    infowindow.open(map,marker);
}
google.maps.event.addDomListener(window, 'load', initialize);

