var map;

function initialize() {
  var latlng = new google.maps.LatLng(51, 0);
  var myOptions = {
                  zoom: 4,
                  center: latlng,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
          };
  var map = new google.maps.Map(document.getElementById('map'), myOptions);
  return map;
}
var map = initialize();

function createMap(lat, lng, zoom) {
    var latlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
                    zoom: zoom,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
            };
    var map = new google.maps.Map(document.getElementById('map'), myOptions);
    return map;
}

function initiate_geolocation(map) {
  //navigator.geolocation.getCurrentPosition(handle_location_query, handle_error);
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          console.log(initialLocation);
          map.setCenter(initialLocation);
          map.setZoom(14);
      });
  }
}

function handle_location_query(position) {

  //Build some variables
  var latitude, longitude, zoom;

  //Check to see if we know the location
  if (position == null) {
  latitude = 51.5;
  longitude = 0.00;
  zoom = 5;
  } else {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  zoom = 14;
  }

  //Update the long and lat of the position
  console.log(position);                     
}

function handle_error(error) {
  switch(error.code)
  {
    case error.PERMISSION_DENIED: $('#feedback').html('<p class="error">You did not share your geolocation data.<br />You need to allow your browser to use your location, or use the map below and click on your location</p></p>');
    break;

    case error.POSITION_UNAVAILABLE: $('#feedback').html('<p class="error">Could not detect current position.<br />Please use the map below and click on your location</p>');
    handle_location_query();        
    break;

    case error.TIMEOUT: $('#feedback').html('<p class="error">Retrieving position timed out.<br />Please use the map below and click on your location</p></p>');
    break;

    default: $('#feedback').html('<p class="error">Unknown error.<br />Please use the map below and click on your location</p></p>');
    break;
  }
}

//var map = createMap(51, 0, 4);

$("#btnLoc").click(function() {
  initiate_geolocation(map);
  $(".content").fadeOut();
  $(".sidebar").fadeIn();
  return false;
}); 