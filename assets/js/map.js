// Keep a reference about the map
var map;

// zIndex incrementor
var z = 6;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {
      lat: 34.972232,
      lng: 38.504639
    }
  });

  setMarkers(map);
}

// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
var redcross = [
  ['redcross1', 34.112544, 40.141602, 1],
  ['redcross2', 33.592487, 38.076172, 4],
  ['redcross3', 34.264765, 37.243958, 4],
  ['redcross4', 34.518609, 38.216248, 5],
  ['redcross5', 35.948718, 39.036102, 2]
];

var police = [
  ['police1', 35.630122, 40.141602, 1],
  ['police2', 35.334902, 40.131989, 4],
  ['police3', 35.106035, 39.681549, 4],
  ['police4', 34.903559, 38.885040, 5],
  ['police5', 36.235025, 37.160187, 2]
];

var criminal = [
  ['criminal1', 35.982063, 38.994904, 1],
  ['criminal2', 34.592487, 37.076172, 4],
];

function setMarkers(map) {
  // Adds markers to the map.

  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.

  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  var image = {
    url: 'images/icons/redcrossicon.png',
    // This marker is 32 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (70, 0).
    anchor: new google.maps.Point(16, 32)
  };
  var image1 = {
    url: 'images/icons/policeicon.png',
    // This marker is 32 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (70, 0).
    anchor: new google.maps.Point(16, 32)
  };
  var image2 = {
    url: 'images/icons/criminalicon.png',
    // This marker is 32 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (70, 0).
    anchor: new google.maps.Point(16, 32)
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  for (var i = 0; i < redcross.length; i++) {
    var point = redcross[i];
    var marker = new google.maps.Marker({
      position: {
        lat: point[1],
        lng: point[2]
      },
      map: map,
      icon: image,
      shape: shape,
      title: point[0],
      zIndex: point[3]
    });
  }
  for (var i = 0; i < police.length; i++) {
    var point = police[i];
    var marker = new google.maps.Marker({
      position: {
        lat: point[1],
        lng: point[2]
      },
      map: map,
      icon: image1,
      shape: shape,
      title: point[0],
      zIndex: point[3]
    });
  }
  for (var i = 0; i < criminal.length; i++) {
    var point = criminal[i];
    var marker = new google.maps.Marker({
      position: {
        lat: point[1],
        lng: point[2]
      },
      map: map,
      icon: image2,
      shape: shape,
      title: point[0],
      zIndex: point[3]
    });
  }
}

// init PubNub API
var PUBNUB_demo = PUBNUB({
  publish_key: 'pub-c-490ddb36-f631-41f6-a754-8982f15c2338',
  subscribe_key: 'sub-c-11a62d48-72a1-11e5-9611-02ee2ddab7fe'
});
// subscribe to the main channel to get news
PUBNUB_demo.subscribe({
  channel: 'main',
  message: receiver,
  error: function(error) {
    console.log(JSON.stringify(error));
  }
});
// broadcast the data to the main channel
function publish(data) {
  PUBNUB_demo.publish({
    channel: 'main',
    message: {
      lat: data[0],
      long: data[1],
      desciption: data[2],
      type: data[3]
    }
  });
}

// get the user location and the hazard desciption
var latLong = [];
navigator.geolocation.getCurrentPosition(function(position) {
  latLong[0] = position.coords.latitude;
  latLong[1] = position.coords.longitude;
});

// Add the hazard info as a new marker on the map
function updateMap(data) {
  if (!(data && data[0] && data[1] && data[2] && data[3])) {
    return console.error("Did not received data for the new feed update!");
  }

  var myLatLng = {
    lat: data[0],
    lng: data[1]
  };

  var latLng = new google.maps.LatLng(data[0], data[1]);

  var bounds = new google.maps.LatLngBounds();
  bounds.extend(latLng);
  map.fitBounds(bounds);

  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  var image = {
    url: 'images/icons/' + data[3] + 'icon.png ',
    // This marker is 32 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (70, 0).
    anchor: new google.maps.Point(16, 32)
  };
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: image,
    shape: shape,
    title: data[3] + z,
    zIndex: z++
  });

  var content = '<b>' + data[3] +
    ' at location:' + data[0] + ',' + data[1] + '</b></br>' + data[2];

  marker.info = new google.maps.InfoWindow({
    content: content
  });

  google.maps.event.addListener(marker, 'click', function() {
    marker.info.open(map, marker);
  });

  // set back the zoom
  map.setZoom(6);

  // Append the new info to the live feed
  var feed = $('#feed div');
  feed.append('[' + (new Date()).toDateString() + '] ');
  feed.append($("<b>").text(data[3] +
    ' at location:' + data[0] + ',' + data[1]));
  feed.append($("<br>"));
  feed.append(data[2]);
  feed.append($("<br>"));

  feed.append($("<br>"));
  feed.scrollTop(feed.scrollTop() + 10000);
}

// bind 'updateMapEvent' event to updateMap function
PUBNUB.events.bind('updateMapEvent', function(data) {
  updateMap(data);
});

// handling channel updates
function receiver(updates) {
  if (updates['lat'] && updates['long']) {

    var desciption = "";
    if (updates['desciption'])
      desciption = updates['desciption'];

    var type = "other";
    if (updates['type'])
      type = updates['type'];

    PUBNUB.events.fire(
      'updateMapEvent', [updates['lat'], updates['long'], desciption, type]
    );
  }
}

function report(description, type) {
  publish([latLong[0], latLong[1], desciption.value, type]);
}