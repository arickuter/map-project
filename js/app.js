var model = {
  map: null,
  markers: [],
  lastWindow: null,
  messages: ['Big area with squash courts, fields, cricket nets and a baseball field',
    'A nice market to go to with a wide variety of food and good prices', 'A convenient little shop',
    'Small skate park with some cool ramps', 'A good school for kids'
  ],

  locations: [{
      title: 'Radloff Park',
      location: {
        lat: -34.079939,
        lng: 18.870788
      },
    },
    {
      title: 'Lourensford Market',
      location: {
        lat: -34.067609,
        lng: 18.893209
      },
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
    filterView.initList();
  },

  populateLocations: function(locationId) {
    return `<li id="loc${locationId}">` + model.locations[locationId].title + '</li>';
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
  },

  getMessage: function(messageId) {
    return model.messages[messageId];
  },

  callback: function(message, marker) {

  },

  openInfo: function(message, marker) {
    if (model.lastWindow) {
      model.lastWindow.close();
    }
    var infoWindow = new google.maps.InfoWindow({
      content: marker.title.bold() + '<br>' + message,
    });

    infoWindow.open(model.map, marker);
    model.lastWindow = infoWindow;
  }
};

var mapView = {
  init: function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -34.071912,
        lng: 18.879996
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

      // Add event listener that when clicked, map is centered at the marker and infoWindow is shown
      marker.addListener('click', function() {
        viewModel.getMap().panTo(this.getPosition());
        viewModel.openInfo(viewModel.getMessage(this.id), this);
      });

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

var filterView = {
  initList: function() {
    for (i = 0; i < viewModel.getLocations().length; i++) {
      document.getElementById("locations").innerHTML += viewModel.populateLocations(i);
    }
    $('ul').on('click', function(e) {
      var locationArr = viewModel.getLocations();
      for (var i = 0; i < locationArr.length; i++) {
        if (locationArr[i].title == e.target.innerHTML) {
          viewModel.getMap().panTo(viewModel.getMarkers()[i].getPosition());
          viewModel.openInfo(viewModel.getMessage(i), viewModel.getMarkers()[i]);
          break;
        }
      }
    });
  }
};
