// Let's get this map party started!
var map = L.map('map').setView([40, -95], 4);

// Slapping on the OpenStreetMap tiles for a cool look
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // Zoom it real good
    attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Fetching the latest earthquake data – hold on tight!
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // Styling our earthquake markers like a boss
  function styleInfo(feature) {
    return {
      opacity: 0.8, // Let's make it a bit see-through
      fillOpacity: 0.6, // Even more see-through
      fillColor: getColor(feature.geometry.coordinates[2]), // Funky colors based on depth
      color: getStrokeColor(feature.geometry.coordinates[2]), // Stroke color for extra style
      radius: getRadius(feature.properties.mag), // Size matters – based on magnitude
      stroke: true,
      weight: feature.properties.mag / 2 // Thickness based on how big the quake was
    };
  }

  // Here's where we decide our stroke color
  function getStrokeColor(depth) {
    return depth > 50 ? "#ff7800" : "#008800"; // Orange for deep, green for shallow
  }

  // Our epic color function for depth
  function getColor(depth) {
    switch (true) {
      case depth > 90: return "#ea2c2c";
      case depth > 70: return "#ea822c";
      case depth > 50: return "#ee9c00";
      case depth > 30: return "#eecc00";
      case depth > 10: return "#d4ee00";
      default: return "#98ee00";
    }
  }

  // Bigger quakes get a bigger circle
  function getRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
  }

  // Adding those cool markers to the map
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag +
        "<br>Depth: " + feature.geometry.coordinates[2] +
        "<br>Location: " + feature.properties.place
      );
    }
  }).addTo(map);

  // And now, the legendary legend
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    let labels = [];
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "#98ee00", "#d4ee00", "#eecc00", 
      "#ee9c00", "#ea822c", "#ea2c2c"
    ];

    // Looping through for our legend items
    for (let i = 0; i < grades.length; i++) {
      labels.push(
        '<i style="background:' + colors[i] +
        '; width:20px; height:20px; display:inline-block;"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')
      );
    }

    div.innerHTML = labels.join(' '); // Lining them up side by side
    return div;
  };

  legend.addTo(map);
});
