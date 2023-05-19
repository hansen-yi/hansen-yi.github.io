import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { transform } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { toStringXY } from 'ol/coordinate';

// Create a vector source for the food truck markers
const foodTruckSource = new VectorSource();

// Create a vector layer for the food truck markers
const foodTruckLayer = new VectorLayer({
  source: foodTruckSource,
});

// Create the map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    foodTruckLayer, // Add the food truck layer to the map
  ],
  view: new View({
    center: fromLonLat([-122.4194, 37.7749]),
    zoom: 4,
  }),
});

// Create an overlay to display information about the clicked food truck
const overlay = new Overlay({
  element: document.getElementById('overlay'),
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

// Add the overlay to the map
map.addOverlay(overlay);

// Event listener for map click
map.on('click', (event) => {
  const coordinate = event.coordinate;

  // Get the food trucks near the clicked coordinate
  const [longitude, latitude] = transform(coordinate, 'EPSG:3857', 'EPSG:4326');

  // Get the food trucks near the clicked coordinate
  const nearbyFoodTrucks = getNearbyFoodTrucks([latitude, longitude]);
  // const nearbyFoodTrucks = getNearbyFoodTrucks(coordinate);

  // Clear the previous food truck markers
  foodTruckSource.clear();

  // Add markers for the nearby food trucks
  nearbyFoodTrucks.forEach((foodTruck) => {
    const marker = new Feature({
      geometry: new Point(fromLonLat([foodTruck.longitude, foodTruck.latitude])),
      name: foodTruck.name,
    });

    foodTruckSource.addFeature(marker);
  });

  // Show the overlay with information about the clicked food truck
  if (nearbyFoodTrucks.length > 0) {
    const clickedFoodTruck = nearbyFoodTrucks[0];
    const content = `<h3>${clickedFoodTruck.name}</h3><p>Location: ${toStringXY(
      coordinate,
      2
    )}</p>`;
    overlay.getElement().innerHTML = content;
    overlay.setPosition(coordinate);
    overlay.getElement().style.display = 'block';
  } else {
    overlay.getElement().style.display = 'none';
  }
});

// Function to get nearby food trucks based on the clicked coordinate
// function getNearbyFoodTrucks(coordinate) {
//   // TODO: Implement the logic to fetch nearby food trucks from your dataset or API
//   // You can use the coordinate (latitude, longitude) to query for nearby food trucks

//   // Example data
//   const foodTrucks = [
//     {
//       name: 'Food Truck 1',
//       latitude: 37.7749,
//       longitude: -122.4194,
//     },
//     {
//       name: 'Food Truck 2',
//       latitude: 37.773972,
//       longitude: -122.431297,
//     },
//     {
//       name: 'Food Truck 3',
//       latitude: 37.771589,
//       longitude: -122.41496,
//     },
//   ];

//   return foodTrucks;
// }

async function getNearbyFoodTrucks(coordinate) {
  const latitude = coordinate[1];
  const longitude = coordinate[0];
  console.log(latitude);
  console.log(longitude);
  // Construct the API URL with latitude and longitude as query parameters
  const apiUrl = `https://data.sfgov.org/resource/rqzj-sfat.json?$where=within_circle(location,${latitude},${longitude},500000)`;
  // const apiUrl = `https://data.seattle.gov/resource/kzjm-xkqj.json?$where=within_circle(report_location, 47.59815, -122.334540, 500)`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Unable to fetch nearby food trucks.');
    }
    console.log(response);
    const foodTrucks = await response.json();
    console.log(foodTrucks);
    // Process the food truck data and return the relevant information
    const nearbyFoodTrucks = foodTrucks.map((truck) => ({
      name: truck.applicant,
      latitude: parseFloat(truck.latitude),
      longitude: parseFloat(truck.longitude),
    }));
    console.log(nearbyFoodTrucks);
    return nearbyFoodTrucks;
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
