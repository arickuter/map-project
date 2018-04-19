var model = {
  map: null,
  markers: [],

  locations: [{
      title: 'Radloff Park',
      location: {
        lat: -34.079939,
        lng: 18.870788
      }
    },
    {
      title: 'Lourensford Market',
      location: {
        lat: -34.067609,
        lng: 18.893209
      }
    },
    {
      title: 'Shell Garage Shop',
      location: {
        lat: -34.078280,
        lng: 18.869439
      }
    },
    {
      title: 'Skate Park',
      location: {
        lat: -34.078749,
        lng: 18.869662
      }
    },
    {
      title: 'Newberry House Montessori School',
      location: {
        lat: -34.063625,
        lng: 18.886529
      }
    }
  ],
  styles: {
    hide: [{
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.business",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "transit",
        "stylers": [{
          "visibility": "off"
        }]
      }
    ]
  }
};

var viewModel = {
  init: function() {
    mapView.init();
    mapView.initMarkers();
  },

  getLocations: function() {
    return model.locations;
  },

  getMap: function() {
    return model.map;
  },

  getMarkers: function() {
    return model.markers;
  },

  getStyles: function() {
    return model.styles;
  },

  setMap: function(map) {
    model.map = map;
  },

  addMarker: function(marker) {
    model.markers.push(marker);
  }
};

var mapView = {
  init: function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -34.071912,
        lng: 18.876036
      },
      zoom: 15.5,
      mapTypeControl: false
    });

    viewModel.setMap(map);

    viewModel.getMap().setOptions({
      styles: viewModel.getStyles().hide
    });

    for (var i = 0; i < viewModel.getLocations().length; i++) {
      var position = viewModel.getLocations()[i].location;
      var title = viewModel.getLocations()[i].title;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i,
      });
      viewModel.addMarker(marker);
    }
  },

  initMarkers: function() {
    for (var i = 0; i < viewModel.getMarkers().length; i++) {
      viewModel.getMarkers()[i].setMap(viewModel.getMap());
    }
  },

  mapError: function() {
    alert('There was an error loading the map!');
  }
};
