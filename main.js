var _map = null;
var _loc = null;
var _markers = [];

function addMarker(loc) {
  markers.push(new google.maps.Marker({
    map: _map,
    position: loc
  }));
}

function getLocationForAddress(address, callback) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status != google.maps.GeocoderStatus.OK) {
      return console.error('geocoder.geocode failed with:', status);
    }
    console.log(results);

    setTimeout(function() {
      callback(results[0].geometry.location);
    }, 0);
  });
}

function getCurrentLocation(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    setTimeout(function() {
      callback(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }, 0);
  }, function(err) {
    console.error('geolocation.getCurrentPosition failed with:', err);
  });
}

function initialize() {
  console.log(_loc);
  _map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 3,
    center: _loc ? _loc : new google.maps.LatLng(0,0)
  });
}

function loadMaps() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=initialize';
  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function() {
  loadMaps();
  getCurrentLocation(function(loc) {
    console.log(_map);
    _loc = loc;
    if (_map) {
      _map.setCenter(loc);
      addMarker(loc);
    }
  });
});
