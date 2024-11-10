// Dynamically load the Google Maps JavaScript API
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB1MV-DVA0tixP2NNh-VB1rDK7mPew9W7I&callback=initMap&libraries=geometry,visualization,marker'; 
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

let userLocation;
let directionsService;
let directionsRenderer;

// Initialize map
function initMap() {
    const troyNY = { lat: 42.7284, lng: -73.6918 }; // Center on Troy, NY

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: troyNY,
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const kmlLayer = new google.maps.KmlLayer({
        url: 'https://nicc041.github.io/PitStop/downtown.kml',
        map: map,
        preserveViewport: true,
    });

    let infoWindow = new google.maps.InfoWindow();

    kmlLayer.addListener('click', (event) => {
        if (userLocation) {
            const destination = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };

            const clickedPlacemark = event.feature;
            const title = clickedPlacemark.getProperty('name');
            const description = clickedPlacemark.getProperty('description');  

            calculateAndDisplayRoute(destination, title, description);
        } else {
            alert("User location is not available.");
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                new google.maps.Marker({
                    position: userLocation,
                    map: map,
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

                map.setCenter(userLocation);
            },
            () => console.error("Geolocation service failed or was denied.")
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function calculateAndDisplayRoute(destination, title, description) {
    directionsService.route(
        {
            origin: userLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);

                // Extract distance and duration
                const route = response.routes[0];
                const leg = route.legs[0]; // The first leg of the route
                const distance = leg.distance.text; // Distance in human-readable format
                const duration = leg.duration.text; // Duration in human-readable format

                // Create a description string with the distance and duration
                const routeDescription = `
                    <strong>${title}</strong><br>
                    ${description}<br><br>
                    <strong>Distance:</strong> ${distance}<br>
                    <strong>Duration:</strong> ${duration}
                `;

                // If InfoWindow is open, close it
                if (infoWindow.getMap()) {
                    infoWindow.close();
                }

                // Open the InfoWindow at the destination's position
                infoWindow.setContent(routeDescription);
                infoWindow.setPosition(destination);
                infoWindow.open(map);

            } else {
                console.error("Directions request failed due to " + status);
            }
        }
    );
}

// Load the Google Maps API when the document is ready
loadGoogleMapsAPI();