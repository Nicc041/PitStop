// Dynamically load the Google Maps JavaScript API
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB1MV-DVA0tixP2NNh-VB1rDK7mPew9W7I&callback=initMap&libraries=geometry,visualization';  // Remove 'kml' from libraries
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

// Initialize map
function initMap() {
    const troyNY = { lat: 42.7284, lng: -73.6918 }; // Center on Troy, NY
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: troyNY,
    });

    // Add markers from Google My Maps link
    fetch("https://www.google.com/maps/d/u/0/kml?mid=1WRdL1YfZysVpV1d3_A3q0uZE9enEFgE&output=kml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(data, "application/xml");
            const placemarks = kmlDoc.querySelectorAll("Placemark");

            placemarks.forEach(placemark => {
                const name = placemark.querySelector("name").textContent;
                const coords = placemark.querySelector("coordinates").textContent.trim().split(",");
                const position = {
                    lat: parseFloat(coords[1]),
                    lng: parseFloat(coords[0]),
                };

                const marker = new google.maps.Marker({
                    position,
                    map,
                    title: name,
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<h3>${name}</h3>`,
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });
        })
        .catch(error => console.error("Error loading KML data:", error));

    // Geolocation: Show the user's current location
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
                    title: "Your Location",
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

// Load the Google Maps API when the document is ready
loadGoogleMapsAPI();
