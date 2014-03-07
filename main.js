'use strict';

var chartBase = 'https://chart.googleapis.com/chart?chst=';

var _map = null;
var _geocoder;
var _loc = null;
var _userStartedInteracting = false;
var _markers = [];

function addMarker(loc) {
  var marker = new google.maps.Marker({
    map: _map,
    position: loc
  });
  _markers.push(marker);;
  return marker;
}

function getCountry(results) {
   var geocoderAddressComponent,addressComponentTypes,address;
   for (var i in results) {
     geocoderAddressComponent = results[i].address_components;
     for (var j in geocoderAddressComponent) {
       address = geocoderAddressComponent[j];
       addressComponentTypes = geocoderAddressComponent[j].types;
       for (var k in addressComponentTypes) {
         if (addressComponentTypes[k] == 'country') {
           return address;
         }
       }
     }
   }
  return 'Unknown';
}
function getCountryIcon(country) {
  return chartBase + 'd_simple_text_icon_left&chld=' + escape(country.long_name)  + '|14|999|flag_' + country.short_name.toLowerCase() + '|24|000|FFF';
}
function getMsgIcon(msg) {
  return  chartBase + 'd_bubble_text_small&chld=edge_bl|' + msg + '|C6EF8C|000000';
}

function getCurrentLocation(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    setTimeout(function() {
      callback(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }, 0);
  }, function(err) {
    console.error('geolocation.getCurrentPosition failed with:', err);
  }, { timeout: 5000 });
}

function getLocationForAddress(address, callback) {
  _geocoder.geocode({
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

function onMapClick(e) {
  _geocoder.geocode({ 'latLng': e.latLng }, function(results, status) {
    var marker = addMarker(e.latLng);
    if (status == google.maps.GeocoderStatus.OK) {
      marker.setIcon(getCountryIcon(getCountry(results)));
    }
    if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
      marker.setIcon(getMsgIcon('??'));
    }
    if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
      marker.setIcon(getMsgIcon('Sorry, maps quota reached!'));
    }
  });
}

function initialize() {
  // created using http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
  var styleOff = [{ visibility: 'off' }];
  var stylez = [{
      featureType: 'administrative',
      elementType: 'labels',
      stylers: styleOff
  }, {
      featureType: 'administrative.province',
      stylers: styleOff
  }, {
      featureType: 'administrative.locality',
      stylers: styleOff
  }, {
      featureType: 'administrative.neighborhood',
      stylers: styleOff
  }, {
      featureType: 'administrative.land_parcel',
      stylers: styleOff
  }, {
      featureType: 'poi',
      stylers: styleOff
  }, {
      featureType: 'landscape',
      stylers: styleOff
  }, {
      featureType: 'road',
      stylers: styleOff
  }];
  var mapDiv = document.getElementById('map-canvas');
  _loc = _loc || new google.maps.LatLng(53.012924,18.59848);
  _map = new google.maps.Map(mapDiv, {
    center: _loc,
    zoom: 4,
    disableDefaultUI: true,
    scaleControl: true,
    mapTypeId: 'Border View',
    draggableCursor: 'pointer',
    draggingCursor: 'wait',
    mapTypeControlOptions: {
      mapTypeIds: ['Border View']
    }
  });
  _map.mapTypes.set('Border View', new google.maps.StyledMapType(stylez, { name: 'Border View' }));
  _geocoder = new google.maps.Geocoder();

  google.maps.event.addListener(_map, 'click', onMapClick);
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
    _loc = loc;
    if (_map && !_userStartedInteracting) {
      _map.setCenter(loc);
    }
  });
});
