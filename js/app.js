var model = {
  map: null,
  markers: [],
  lastWindow: null,
  lastMarker: null,

  // Array of text that will displayed in infoWindow
  messages: ['Big area with squash courts, fields, cricket nets and a baseball field',
    'A nice market to go to with a wide variety of food and good prices', 'A convenient little shop',
    'Small skate park with some cool ramps', 'A good school for kids'
  ],

  // Array of location objects
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

  //Style object for map
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

// viewModel part of MVVM
var viewModel = {
  // Initialize all views
  init: function() {
    mapView.init();
    mapView.initMarkers();
    filterView.initList();
  },

  handleErrors: function(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  },

  // Adds a location to the map
  populateLocations: function(locationId) {
    return `<li id="loc${locationId}">` + model.locations[locationId].title + '</li>';
  },

  // Returns the array locations
  getLocations: function() {
    return model.locations;
  },

  // Returns the map
  getMap: function() {
    return model.map;
  },

  // Returns the array of markers
  getMarkers: function() {
    return model.markers;
  },

  // Returns the styles object for the map
  getStyles: function() {
    return model.styles;
  },

  // Sets the map object to a map
  setMap: function(map) {
    model.map = map;
  },

  // Adds the markers to the marker array
  addMarker: function(marker) {
    model.markers.push(marker);
  },

  // Returns the message from array
  getMessage: function(messageId) {
    return model.messages[messageId];
  },

  // Adds a picture to infoWindow of clicked marker
  addPic: function(searchStr) {
    var locationArr = viewModel.getLocations();
    for (var i = 0; i < locationArr.length; i++) {
      if (locationArr[i].title == searchStr) {
        viewModel.getMap().panTo(viewModel.getMarkers()[i].getPosition());
        viewModel.getMarkers()[i].setAnimation(google.maps.Animation.BOUNCE);
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchStr}`, {
            headers: {
              Authorization: 'Client-ID 1cf8a6d4be936f77a3cf9ee18f25bb48c9c868a6a67f8bdb0d5c6f1530c519a1'
            }
          }).then(viewModel.handleErrors)
          .then(function(response) {
            return response.json();
          }).then(function(data) {
            var htmlContent = '';
            var firstImage = data.results[0];
            // Constructs html to add the picture
            if (firstImage) {
              htmlContent = `<figure>
          <img src="${firstImage.urls.small}" alt="${searchStr}">
          <figcaption>${searchStr} by ${firstImage.user.name}</figcaption>
          </figure>`;
            } else {
              htmlContent = 'Unfortunately, no image was returned for your search.'
            }
            viewModel.openInfo(viewModel.getMessage(i), viewModel.getMarkers()[i], htmlContent);
          }).catch(function(error) {
            console.log(error);
          });
        break;
      }
    }
  },

  openInfo: function(message, marker, unsplash) {
    if (model.lastWindow) {
      // Closes the open infoWindow
      model.lastWindow.close();
      model.lastMarker.setAnimation(google.maps.Animation.NONE);
    }

    // Creates new infoWindow
    var infoWindow = new google.maps.InfoWindow({
      content: marker.title.bold() + '<br>' + message + unsplash
    });

    // Opens new infoWindow
    infoWindow.open(model.map, marker);
    model.lastWindow = infoWindow;
    model.lastMarker = marker;
  },
};

// One view part of the MVVM
var mapView = {
  // Initialize map and style it. Adds markers to the map and event listeners to them
  init: function() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: -34.071912,
        lng: 18.879996
      },
      zoom: 15.5,
      mapTypeControl: false
    });

    // Sets the map object to the created map
    viewModel.setMap(map);

    // Style the map
    viewModel.getMap().setOptions({
      styles: viewModel.getStyles().hide
    });

    // Creates and adds markers to array of markers
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
        searchStr = this.title;
        viewModel.addPic(searchStr);
      });

    }
  },

  // Puts the markers on the map
  initMarkers: function() {
    for (var i = 0; i < viewModel.getMarkers().length; i++) {
      viewModel.getMarkers()[i].setMap(viewModel.getMap());
    }
  },

  // Returns error if map can't load
  mapError: function() {
    alert('There was an error loading the map!');
  }
};

// Another view part of MVVM
var filterView = {
  // Initializes the list of locations
  initList: function() {
    for (i = 0; i < viewModel.getLocations().length; i++) {
      document.getElementById("locations").innerHTML += viewModel.populateLocations(i);
    }

    // Adds event listener to menu icon so when clicked it moves and shows/hides the menu
    $('#menuIcon').on('click', function() {
      if (document.getElementById('menu').style.visibility !== 'hidden') {
        document.getElementById('menu').style.visibility = 'hidden';
        document.getElementById('map').style.left = '50px';
        this.style.left = '-246px';
      } else {
        document.getElementById('menu').style.visibility = '';
        document.getElementById('map').style.left = '300px';
        this.style.left = '4px';
      }
    });

    // Adds picture to infoWindow
    $('ul').on('click', function(e) {
      viewModel.addPic(e.target.innerHTML);
    });

    // Filter functionality, hides items if no match to text, reshows if the search is found
    $('#searchField').keyup(function() {
      var searchStr = document.getElementById('searchField').value;
      var locationArr = viewModel.getLocations();
      for (var i = 0; i < locationArr.length; i++) {
        if (locationArr[i].title.toUpperCase().includes(searchStr.toUpperCase()) == true) {
          document.getElementById("locations").children[i].style.display = "";
          viewModel.getMarkers()[i].setVisible(true);
        } else {
          document.getElementById("locations").children[i].style.display = "none";
          viewModel.getMarkers()[i].setVisible(false);
        }
      }
    });
  }
};
