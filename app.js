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
}
