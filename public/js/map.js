
	// mapboxgl.accessToken = mapToken;
    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //    // style:"mapbox://styles/mapbox/streets-v12",
    //     center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //     zoom: 9 // starting zoom
    // })

    // //console.log(coordinates);
    // const marker=new mapboxgl.Marker({color:"red"})
    // .setLngLat(coordinates)
    // .addTO(map);

    mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // The ID of the HTML container element for the map
    style: 'mapbox://styles/mapbox/streets-v12', // Map style
    center: coordinates, // Coordinates for the initial map center [longitude, latitude]
    zoom: 9 // Initial zoom level
});

// Add a marker to the map
const marker = new mapboxgl.Marker({
    color: "red" // Optional: Customize the marker color
})
    .setLngLat(coordinates) // Set marker coordinates [longitude, latitude]
    .addTo(map); // Add the marker to the map
