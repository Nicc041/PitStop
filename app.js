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
let infoWindow;

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

    infoWindow = new google.maps.InfoWindow();

    const kmlLayer = new google.maps.KmlLayer({
        url: 'https://nicc041.github.io/PitStop/downtown.kml',
        map: map,
        preserveViewport: true,
    });

    // Geolocation: Show the user's current location
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

function calculateAndDisplayRoute(destination) {
    directionsService.route(
        {
            origin: userLocation,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
            } else {
                console.error("Directions request failed due to " + status);
            }
        }
    );
}

loadGoogleMapsAPI();
