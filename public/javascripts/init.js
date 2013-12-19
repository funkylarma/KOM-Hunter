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
    map.clearOverlays();
    $(".sidebar h1").text('Map moved, reloading.');
    $('#feedback').html('');
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
      });
    });
    $(".sidebar h1").text('Select a KOM');
    $(".distance").text('');
    $(".climb").html('');
    $(".link__ss").html('');
    $('#feedback').html('');
    window.location = '#' + sw.lat() + ',' + sw.lng() + ',' + ne.lat() + ',' + ne.lng();
  });
  return map;
}

map = initialize();

if(window.location.hash) {
  var hash = window.location.hash.substring(1).split(',');
  map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(hash[0],hash[1]),new google.maps.LatLng(hash[2],hash[3])));
  $.getJSON("/segments/" + hash[0] + "/" + hash[1] + "/" + hash[2] + "/" + hash[3], function(data){
    $.each(data.segments, function(i,item){
      var marker = dropPin(item.start_latlng[0], item.start_latlng[1]);
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
        map.setCenter(marker.getPosition());
        display_segment(item);
      });
  	});
  });
  
  $('#feedback').html('');
  $(".content").fadeOut(800);
  $(".sidebar").addClass('open', 1200);
}

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
  	});
  });
  $(".sidebar h1").text('Select a KOM');
  $('#feedback').html('');
}

function handle_error(error) {
  switch(error.code)
  {
    case error.PERMISSION_DENIED:
      $(".sidebar h1").text('Whoops, problems.');
      $('#feedback').html('<p class="error">You did not share your geolocation data.<br />You need to allow your browser to use your location.</p>');
    break;

    case error.POSITION_UNAVAILABLE:
      $(".sidebar h1").text('Whoops, problems.');
      $('#feedback').html('<p class="error">Could not detect current position.<br />This some times happens if your on commerical networks, best to use a mobile device.</p>');       
    break;

    case error.TIMEOUT:
      $(".sidebar h1").text('Whoops, problems.');
      $('#feedback').html('<p class="error">Retrieving position timed out.</p>');
    break;

    default:
      $(".sidebar h1").text('Whoops, problems.');
      $('#feedback').html('<p class="error">Unknown error.</p>');
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