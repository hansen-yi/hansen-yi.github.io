// Function to initialize the map
function initMap() {
    // Create a map instance
    const map = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([-122.4194, 37.7749]), // Default map center (e.g., San Francisco coordinates)
            zoom: 12 // Default zoom level
        })
    });

    // Add a click event listener to the map
    // map.on('click', function (event) {
    //     const clickedCoordinate = event.coordinate;
    //     const [lng, lat] = ol.proj.toLonLat(clickedCoordinate);

    //     // Make a request to your backend API endpoint passing the clicked location coordinates
    //     fetch(`/foodtrucks?lat=${lat}&lng=${lng}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             // Handle the response data (array of nearby food trucks)
    //             // Display the nearby food trucks on the map as markers or custom overlays
    //             data.forEach(foodTruck => {
    //                 const marker = new ol.Feature({
    //                     geometry: new ol.geom.Point(ol.proj.fromLonLat([foodTruck.lng, foodTruck.lat])),
    //                     name: foodTruck.name
    //                 });
    //                 marker.setStyle(new ol.style.Style({
    //                     image: new ol.style.Icon({
    //                         src: 'marker.png', // Path to a custom marker icon
    //                         anchor: [0.5, 1],
    //                         scale: 0.5
    //                     })
    //                 }));

    //                 const vectorSource = new ol.source.Vector({
    //                     features: [marker]
    //                 });

    //                 const vectorLayer = new ol.layer.Vector({
    //                     source: vectorSource
    //                 });

    //                 map.addLayer(vectorLayer);
    //             });
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //         });
    // });
}
