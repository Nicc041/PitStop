// Dynamically load the Google Maps JavaScript API
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB1MV-DVA0tixP2NNh-VB1rDK7mPew9W7I&callback=initMap&libraries=geometry,visualization';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

// Initialize the Google Map
function initMap() {
    const troyNY = { lat: 42.7284, lng: -73.6918 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: troyNY,
    });

    const kmlLayer = new google.maps.KMLLayer({
        url: 'downtown.kml',
        map: map,
    });

    kmlLayer.setOptions({
        suppressInfoWindows: false,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

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

                map.setCenter(userLocation);
            },
            (error) => {
                console.error("Geolocation service failed or was denied:", error.message);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Load the Google Maps API when the document is ready
loadGoogleMapsAPI();
