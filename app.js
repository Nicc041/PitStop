// Initialize the Google Map
function initMap() {
    const troyNY = { lat: 42.7284, lng: -73.6918 }; // Center on Troy, NY
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: troyNY,
    });

    // Fetch the KML file (the external Google My Maps link)
    fetch("https://www.google.com/maps/d/u/0/kml?mid=1WRdL1YfZysVpV1d3_A3q0uZE9enEFgE&output=kml")
        .then(response => response.text())
        .then(data => {
            // Parse the KML data
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(data, "application/xml");
            const placemarks = kmlDoc.querySelectorAll("Placemark"); // Get all Placemark elements

            let currentInfoWindow = null; // Variable to track the currently opened info window

            // Loop through each placemark (marker) in the KML file
            placemarks.forEach(placemark => {
                const name = placemark.querySelector("name").textContent; // Get the name of the place
                const coords = placemark.querySelector("coordinates").textContent.trim().split(","); // Get coordinates (longitude, latitude, altitude)
                const lon = parseFloat(coords[0]); // Longitude
                const lat = parseFloat(coords[1]); // Latitude

                // Only proceed if coordinates are valid
                if (!isNaN(lat) && !isNaN(lon)) {
                    const position = { lat, lng: lon }; // Marker position

                    // Create a new marker for each placemark
                    const marker = new google.maps.Marker({
                        position,
                        map,
                        title: name, // Title of the marker (used in the info window)
                    });

                    // Create an info window that will display when the marker is clicked
                    const infoWindow = new google.maps.InfoWindow({
                        content: `<h3>${name}</h3>`, // Content to display in the info window
                    });

                    // When the marker is clicked, show the info window
                    marker.addListener("click", () => {
                        // If an info window is already open, close it
                        if (currentInfoWindow) {
                            currentInfoWindow.close();
                        }
                        // Open the new info window for this marker
                        infoWindow.open(map, marker);
                        currentInfoWindow = infoWindow; // Set this info window as the current one
                    });
                }
            });
        })
        .catch(error => console.error("Error loading KML data:", error)); // Log error if the KML data can't be loaded

    // Geolocation: Show the user's current location on the map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Add a marker for the user's location
                const userMarker = new google.maps.Marker({
                    position: userLocation,
                    map,
                    title: "Your Location", // Title for the user marker
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#4285F4",
                        fillOpacity: 0.8,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                    },
                });

                // Center the map on the user's location
                map.setCenter(userLocation);
            },
            () => {
                console.error("Geolocation service failed or was denied.");
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}
