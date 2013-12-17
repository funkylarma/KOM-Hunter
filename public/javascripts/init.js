var map;
var markers = [];

function initialize() {
  var latlng = new google.maps.LatLng(51, 0);
  var myOptions = {
                  zoom: 4,
                  center: latlng,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  panControl: false,
                  mapTypeControl: false,
                  streetViewControl: false,
                  zoomControl: true,
                  zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.LEFT_CENTER
                  }
          };
  var map = new google.maps.Map(document.getElementById('map'), myOptions);
  
  google.maps.event.addListener(map, 'dragend', function(){
    console.log("User dragged the map");
    map.clearOverlays();
    $('#feedback').html('<p class="feedback">Looking up the local Stava segments</p>');
    var ne = map.getBounds().getNorthEast();
    var sw = map.getBounds().getSouthWest();

    $.getJSON("/segments/" + sw.lat() + "/" + sw.lng() + "/" + ne.lat() + "/" + ne.lng(), function(data){
      $.each(data.segments, function(i,item){
        var marker = dropPin(item.start_latlng[0], item.start_latlng[1]);
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          map.setCenter(marker.getPosition());
          display_segment(item);
        });
    	  console.log(item);
        console.log(marker);
    	});
    });
    $('#feedback').html('');
  });
  return map;
}

map = initialize();

function initiate_geolocation() {
  if (navigator.geolocation) {
    $(".sidebar h1").text('Calculating your location');
    $('#feedback').html('<p class="feedback">Looking up the local Stava segments</p>');
    navigator.geolocation.getCurrentPosition(handle_location_query, handle_error);
  }
}

function handle_location_query(position) {
  //Build some variables
  var bounds, latitude, longitude, zoom;
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  zoom = 14;
  initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  map.setCenter(initialLocation);
  map.setZoom(zoom);
  var ne = map.getBounds().getNorthEast();
  var sw = map.getBounds().getSouthWest();
  
  $.getJSON("/segments/" + sw.lat() + "/" + sw.lng() + "/" + ne.lat() + "/" + ne.lng(), function(data){
    $.each(data.segments, function(i,item){
      var marker = dropPin(item.start_latlng[0], item.start_latlng[1]);
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
        map.setCenter(marker.getPosition());
        display_segment(item);
      });
  	  console.log(item);
      console.log(marker);
  	});
  });
  $(".sidebar h1").text('Select a KOM');
  $('#feedback').html('');
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

function dropPin( lat, lng ) {
  var latlng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({
    position: latlng,
    draggable: true,
    icon: '/images/marker.png',
    map: map,
    animation: google.maps.Animation.DROP
  });
  return marker;
}

function display_segment(segment) {
  $(".sidebar h1").text(segment.name);
  $(".distance").text('Distance: ' + (segment.distance / 1000).toFixed(2) + "km");
  $(".climb").html("Average Grade: " + segment.avg_grade + "%<br />Climb Category: " + segment.climb_category_desc);
  $(".link__ss").html('<a href="http://app.strava.com/segments/' + segment.id + '" class="view_strava">View segment on Strava</a>');
}

google.maps.Map.prototype.clearOverlays = function() {
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
    markers.length = 0;
}

$("#btnLoc").click(function() {
  initiate_geolocation(map);
  $(".content").fadeOut(800);
  $(".sidebar").addClass('open', 1200);
  return false;
});