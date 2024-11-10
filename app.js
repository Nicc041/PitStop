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
        disableDefaultUI: true, 
    });

    const kmlLayer = new google.maps.KmlLayer({
        url: 'https://nicc041.github.io/PitStop/downtown.kml',
        map: map,
        preserveViewport: true,
    });

    // Geolocation: Show the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Add a marker for the user's location
                const userMarker = new google.maps.marker.AdvancedMarkerElement({
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
