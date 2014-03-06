function initialize() {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 2,
    center: new google.maps.LatLng(0,0)
  });
}

function loadMaps() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=initialize';
  document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
  loadMaps();
});
