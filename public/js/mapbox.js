/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibGlkaWlhOTIiLCJhIjoiY2s3eG9kYW54MGYybDNrcXA2bzBoanFwYiJ9.rxrV02oK72T0sc_FN6I2yg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/lidiia92/ck7xohld6087r1ill9njj6fbt',
  scrollZoom: false
  //   center: [-121.795594, 37.362582],
  //   zoom: 5,
  //   interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(location => {
  // Create marker

  const element = document.createElement('div');
  element.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element,
    anchor: 'bottom'
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  //Extend bounds to include the current location
  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
